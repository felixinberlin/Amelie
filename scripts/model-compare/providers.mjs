// Anbieter-Adapter für den Modellvergleich: ein Gespräch mit Werkzeugaufrufen, überall dieselbe Form.
//
// Adapter-Schnittstelle:
//   start({ system, user, tools, nativeSearch, meta }) → state
//   step(state) → { text, calls:[{id,name,args}], usage:{in,out}, stop, resume? }
//   addToolResults(state, results:[{id,name,content}])
// runConversation() treibt die Schleife und protokolliert Werkzeugaufrufe, Tokens und Stoppgrund.
//
// SDKs werden erst beim Erzeugen des Adapters geladen (dynamischer Import): das Repo braucht sie nicht als Abhängigkeit.
//   npm i --no-save @anthropic-ai/sdk @anthropic-ai/vertex-sdk @google/genai
// Die Aufrufformen sind gegen die installierten Typdefinitionen geprüft (@anthropic-ai/sdk 0.129, vertex-sdk 0.20,
// @google/genai 2.24); gegen die Live-APIs wurden sie in dieser Umgebung nicht ausgeführt (keine Zugangsdaten).

// Schlüssel aus .env im Projektwurzelverzeichnis (git-ignoriert); bereits gesetzte Umgebungsvariablen gewinnen.
try { process.loadEnvFile(new URL('../../.env', import.meta.url)); } catch { /* keine .env: Umgebung zählt */ }

export const PROVIDERS = ['anthropic', 'vertex-claude', 'gemini', 'openai-compat', 'mock'];
const SDK_HINT = { anthropic: '@anthropic-ai/sdk', 'vertex-claude': '@anthropic-ai/vertex-sdk', gemini: '@google/genai' };

// ---------------------------------------------------------------- Gesprächsschleife

/**
 * requireTool: { names: [..], nudge: 'Text', max: 2 } — beendet das Modell ohne einen Aufruf eines dieser Werkzeuge,
 * hängt das Programm `nudge` als Nutzerzeile an (adapter.addUser) und zwingt den nächsten Schritt auf eines dieser
 * Werkzeuge (Gemini: Function-Calling-Modus ANY, Claude: tool_choice). So kann sich ein Modell nicht an der Suche vorbeimogeln.
 */
export async function runConversation(adapter, { system, user, tools, handlers, nativeSearch = false, maxTurns = 20, meta = {}, requireTool = null }) {
  const state = await adapter.start({ system, user, tools, nativeSearch, meta });
  const toolLog = [];
  const usage = { in: 0, out: 0, turns: 0, searches: 0 };
  let text = '';
  let stop = '';
  let nudges = 0;
  for (let turn = 0; turn < maxTurns; turn++) {
    const r = await adapter.step(state);
    usage.turns++;
    usage.in += r.usage?.in ?? 0;
    usage.out += r.usage?.out ?? 0;
    usage.searches += r.usage?.searches ?? 0;
    if (r.text) text = r.text;
    stop = r.stop ?? '';
    if (r.resume && !r.calls?.length) continue; // serverseitige Pause (Anthropic pause_turn): weitermachen
    state.force = null;
    if (!r.calls?.length) {
      const need = requireTool && requireTool.names.some((n) => handlers[n]) && !toolLog.some((t) => requireTool.names.includes(t.name));
      if (need && adapter.addUser && nudges < (requireTool.max ?? 2)) {
        nudges++;
        adapter.addUser(state, requireTool.nudge);
        state.force = requireTool.names.filter((n) => handlers[n]);
        usage.nudges = nudges;
        continue;
      }
      return { text, usage, toolLog, stop, turns: usage.turns };
    }
    const results = [];
    for (const c of r.calls) {
      const h = handlers[c.name];
      let content;
      try { content = h ? await h(c.args ?? {}) : `Unbekanntes Werkzeug: ${c.name}. Es gibt NUR diese Werkzeuge (kein Python, keine Codeausführung): ${Object.keys(handlers).join(', ')}.`; } catch (e) { content = `Fehler: ${e.message}`; }
      toolLog.push({ name: c.name, args: c.args ?? {}, result: String(content).slice(0, 300) });
      results.push({ id: c.id, name: c.name, content: String(content) });
    }
    adapter.addToolResults(state, results);
  }
  return { text, usage, toolLog, stop: 'max_turns', turns: usage.turns };
}

// ---------------------------------------------------------------- Umgebung

export function resolveEnv(spec, env = process.env) {
  return {
    project: spec.project ?? env.GOOGLE_CLOUD_PROJECT ?? env.ANTHROPIC_VERTEX_PROJECT_ID ?? env.GCLOUD_PROJECT ?? null,
    region: spec.region ?? env.CLOUD_ML_REGION ?? 'global',
    geminiKey: env[spec.apiKeyEnv ?? 'GEMINI_API_KEY'] ?? env.GOOGLE_API_KEY ?? null,
    compatKey: env[spec.apiKeyEnv ?? 'OPENROUTER_API_KEY'] ?? null,
  };
}

/** Prüft, ob ein Modell ohne Aufruf startklar aussieht (Modell-Id gesetzt, Zugang erkennbar, SDK ladbar). */
export async function checkReady(spec, { env = process.env, loadSdk = defaultLoadSdk } = {}) {
  const problems = [];
  if (!PROVIDERS.includes(spec.provider)) problems.push(`Anbieter „${spec.provider}“ unbekannt (${PROVIDERS.join(' | ')})`);
  if (!spec.model || /^SET_ME/i.test(spec.model)) problems.push('model ist nicht gesetzt (in models.local.json eintragen)');
  const e = resolveEnv(spec, env);
  if (spec.provider === 'vertex-claude' && !e.project) problems.push('GCP-Projekt fehlt (GOOGLE_CLOUD_PROJECT oder project in der Konfiguration)');
  if (spec.provider === 'gemini') {
    if (spec.vertex && !e.project) problems.push('GCP-Projekt fehlt (GOOGLE_CLOUD_PROJECT oder project)');
    if (!spec.vertex && !e.geminiKey) problems.push('GEMINI_API_KEY fehlt (oder "vertex": true mit Projekt setzen)');
  }
  if (spec.provider === 'openai-compat' && !spec.noKey && !e.compatKey) problems.push(`${spec.apiKeyEnv ?? 'OPENROUTER_API_KEY'} fehlt (für lokale Server ohne Schlüssel "noKey": true setzen)`);
  if (spec.provider === 'anthropic' && !env.ANTHROPIC_API_KEY && !env.ANTHROPIC_AUTH_TOKEN) problems.push('ANTHROPIC_API_KEY fehlt (oder `ant auth login`; das lässt sich von hier nicht prüfen)');
  if (SDK_HINT[spec.provider]) {
    try { await loadSdk(SDK_HINT[spec.provider]); } catch { problems.push(`SDK fehlt: npm i --no-save ${SDK_HINT[spec.provider]}`); }
  }
  return { ok: problems.length === 0, problems };
}

async function defaultLoadSdk(name) { return import(name); }

// ---------------------------------------------------------------- Claude (direkt und über Vertex AI)

function claudeAdapter(spec, client) {
  const vertex = spec.provider === 'vertex-claude';
  return {
    name: spec.id,
    start({ system, user, tools, nativeSearch }) {
      const t = tools.map((x) => ({ name: x.name, description: x.description, input_schema: x.input_schema }));
      // Auf Vertex gibt es nur die einfache Websuche; direkt die neuere Variante mit dynamischer Filterung.
      if (nativeSearch) t.push({ type: vertex ? 'web_search_20250305' : 'web_search_20260209', name: 'web_search' });
      return { messages: [{ role: 'user', content: user }], system, tools: t };
    },
    async step(st) {
      const req = { model: spec.model, max_tokens: spec.maxTokens ?? 16000, system: st.system, messages: st.messages };
      if (st.tools.length) req.tools = st.tools;
      if (spec.effort) req.output_config = { effort: spec.effort };
      if (st.force?.length && st.tools.length && !spec.effort) req.tool_choice = st.force.length === 1 ? { type: 'tool', name: st.force[0] } : { type: 'any' };
      const resp = await client.messages.create(req);
      st.messages.push({ role: 'assistant', content: resp.content }); // vollständig zurückgeben (Thinking-Blöcke müssen bleiben)
      const blocks = resp.content ?? [];
      const calls = blocks.filter((b) => b.type === 'tool_use').map((b) => ({ id: b.id, name: b.name, args: b.input }));
      const text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('');
      const u = resp.usage ?? {};
      if (resp.stop_reason === 'refusal') throw new Error(`Modell lehnte ab (refusal${resp.stop_details?.category ? `: ${resp.stop_details.category}` : ''})`);
      return {
        text, calls,
        usage: { in: u.input_tokens ?? 0, out: u.output_tokens ?? 0, searches: u.server_tool_use?.web_search_requests ?? 0 },
        stop: resp.stop_reason,
        resume: resp.stop_reason === 'pause_turn',
      };
    },
    addUser(st, text) { st.messages.push({ role: 'user', content: [{ type: 'text', text }] }); },
    addToolResults(st, results) {
      st.messages.push({ role: 'user', content: results.map((r) => ({ type: 'tool_result', tool_use_id: r.id, content: r.content })) });
    },
  };
}

// ---------------------------------------------------------------- Gemini (Gemini-API oder Vertex AI)

function geminiAdapter(spec, client) {
  return {
    name: spec.id,
    start({ system, user, tools, nativeSearch }) {
      // Funktionsaufrufe und die eingebaute Google-Suche lassen sich nicht in jedem Modell kombinieren:
      // mit nativer Suche bekommt Gemini nur die Suche (Parität entfällt, der Bericht sagt es).
      const t = nativeSearch
        ? [{ googleSearch: {} }]
        : tools.length ? [{ functionDeclarations: tools.map((x) => ({ name: x.name, description: x.description, parametersJsonSchema: x.input_schema })) }] : [];
      return { contents: [{ role: 'user', parts: [{ text: user }] }], system, tools: t };
    },
    async step(st) {
      const config = { systemInstruction: st.system, maxOutputTokens: spec.maxTokens ?? 16000 };
      if (st.tools.length) config.tools = st.tools;
      if (st.force?.length && st.tools.length && !st.tools.some((t) => t.googleSearch)) config.toolConfig = { functionCallingConfig: { mode: 'ANY', allowedFunctionNames: st.force } };
      if (spec.temperature != null) config.temperature = spec.temperature;
      const resp = await client.models.generateContent({ model: spec.model, contents: st.contents, config });
      const cand = resp.candidates?.[0];
      if (cand?.content) st.contents.push(cand.content);
      const parts = cand?.content?.parts ?? [];
      const calls = parts.filter((p) => p.functionCall).map((p) => ({ id: p.functionCall.id ?? p.functionCall.name, callId: p.functionCall.id, name: p.functionCall.name, args: p.functionCall.args ?? {} }));
      const text = parts.filter((p) => p.text && !p.thought).map((p) => p.text).join('');
      const u = resp.usageMetadata ?? {};
      if (!cand && resp.promptFeedback?.blockReason) throw new Error(`Anfrage blockiert (${resp.promptFeedback.blockReason})`);
      st.lastCalls = calls;
      return { text, calls, usage: { in: u.promptTokenCount ?? 0, out: (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0) }, stop: String(cand?.finishReason ?? '') };
    },
    addUser(st, text) { st.contents.push({ role: 'user', parts: [{ text }] }); },
    addToolResults(st, results) {
      st.contents.push({
        role: 'user',
        parts: results.map((r) => {
          const call = (st.lastCalls ?? []).find((c) => c.id === r.id);
          return { functionResponse: { ...(call?.callId ? { id: call.callId } : {}), name: r.name, response: { output: r.content } } };
        }),
      });
    },
  };
}

// ---------------------------------------------------------------- OpenAI-kompatibel (OpenRouter, DeepSeek, Groq, Together, Mistral, Ollama, LiteLLM)

const COMPAT_DEFAULT_URL = 'https://openrouter.ai/api/v1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** POST mit Wiederholung bei 429/5xx (kostenlose Kontingente drosseln oft). Kein SDK nötig: nur fetch. */
async function compatPost(url, headers, body, { fetchFn = fetch, retries = 4, baseDelay = 2000 } = {}) {
  for (let i = 0; ; i++) {
    const res = await fetchFn(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (res.ok) return res.json();
    const retry = res.status === 429 || res.status >= 500;
    const txt = await res.text().catch(() => '');
    if (!retry || i >= retries) throw new Error(`HTTP ${res.status} von ${url}: ${txt.slice(0, 300)}`);
    const ra = Number(res.headers?.get?.('retry-after'));
    await sleep(Number.isFinite(ra) && ra > 0 ? Math.min(ra * 1000, 60000) : baseDelay * 2 ** i);
  }
}

function openaiCompatAdapter(spec, { key, fetchFn, baseDelay } = {}) {
  const url = `${String(spec.baseUrl ?? COMPAT_DEFAULT_URL).replace(/\/+$/, '')}/chat/completions`;
  const headers = { 'content-type': 'application/json', ...(key ? { authorization: `Bearer ${key}` } : {}), ...(spec.headers ?? {}) };
  return {
    name: spec.id,
    start({ system, user, tools }) {
      // Eingebaute Websuche gibt es hier nicht: Modelle nutzen das Werkzeug web_search des Programms.
      const t = tools.map((x) => ({ type: 'function', function: { name: x.name, description: x.description, parameters: x.input_schema } }));
      return { messages: [{ role: 'system', content: system }, { role: 'user', content: user }], tools: t };
    },
    async step(st) {
      const req = { model: spec.model, messages: st.messages, max_tokens: spec.maxTokens ?? 16000 };
      if (st.tools.length) req.tools = st.tools;
      if (st.force?.length && st.tools.length) req.tool_choice = st.force.length === 1 ? { type: 'function', function: { name: st.force[0] } } : 'required';
      if (spec.temperature != null) req.temperature = spec.temperature;
      Object.assign(req, spec.extraBody ?? {});
      const resp = await compatPost(url, headers, req, { fetchFn, baseDelay });
      if (resp.error) throw new Error(`Anbieterfehler: ${resp.error.message ?? JSON.stringify(resp.error).slice(0, 300)}`);
      const choice = resp.choices?.[0];
      const msg = choice?.message ?? { role: 'assistant', content: '' };
      st.messages.push({ role: 'assistant', content: msg.content ?? null, ...(msg.tool_calls?.length ? { tool_calls: msg.tool_calls } : {}) });
      const calls = (msg.tool_calls ?? []).map((c) => {
        let args = {};
        try { args = JSON.parse(c.function?.arguments || '{}'); } catch { args = {}; }
        return { id: c.id, name: c.function?.name, args };
      });
      const u = resp.usage ?? {};
      return { text: typeof msg.content === 'string' ? msg.content : '', calls, usage: { in: u.prompt_tokens ?? 0, out: u.completion_tokens ?? 0 }, stop: String(choice?.finish_reason ?? '') };
    },
    addUser(st, text) { st.messages.push({ role: 'user', content: text }); },
    addToolResults(st, results) {
      for (const r of results) st.messages.push({ role: 'tool', tool_call_id: r.id, content: r.content });
    },
  };
}

// ---------------------------------------------------------------- Mock (Trockenlauf und Tests)

const CANNED_ROW = (title, id, urteil, beleg) => `| ${title} (\`${id}\`) | Beschreibung | Typ B | Empfänger | \`${urteil}\` | ${beleg} | Restlücke |`;

/** Feste Antwort ohne Netz: zeigt Form und Kennzahlen der Auswertung. Jedes Mock-Modell variiert leicht. */
export function mockReply(spec, { engine = 'scout' } = {}) {
  const v = [...String(spec.id)].reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
  const rows = [
    CANNED_ROW('Pegel-Wette', 'pegel-wette', 'verengt', '[Schnipsel] https://wetterturnier.de/history/'),
    v === 0 ? CANNED_ROW('Boule-Messfoto', 'boule-messfoto', 'frei', '[Seite] https://example.org/boule') : CANNED_ROW('Kritische-Masse-Rechner', 'kritische-masse-rechner', 'unklar', '[Seite] https://arxiv.org/abs/2604.13390'),
    CANNED_ROW(`Testidee ${engine} ${v}`, `testidee-${engine}-${v}`, 'unklar', '[Schnipsel] https://example.org/a'),
  ];
  const quellen = v === 2
    ? 'QUELLE NEU: Beispiel | typ=Datensatz | kategorie=Forschung | enthaelt=x | note=falsche Werte'
    : 'QUELLE NEU: Beispielquelle Mock | typ=D | kategorie=norm | enthaelt=Testinhalt | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://example.org/a | note=Mock-Meldung.';
  return `## Kandidaten\n\n| Idee | Beschreibung | Quelle | Empfänger | Urteil | Beleg | Restlücke |\n|---|---|---|---|---|---|---|\n${rows.join('\n')}\n\n## Gelernt / Nächstes Mal\n\n- Mock-Lauf (${spec.id}).\n\n**Quellenmeldung**\n${quellen}\n`;
}

function mockAdapter(spec) {
  return {
    name: spec.id,
    start({ meta }) { return { meta }; },
    async step(st) { return { text: mockReply(spec, st.meta), calls: [], usage: { in: 1000, out: 400 }, stop: 'end_turn' }; },
    addToolResults() {},
  };
}

// ---------------------------------------------------------------- Fabrik

/** Erzeugt den Adapter für eine Modell-Spezifikation. deps.client (Tests) ersetzt das SDK; deps.loadSdk lädt es sonst. */
export async function createProvider(spec, deps = {}) {
  const loadSdk = deps.loadSdk ?? defaultLoadSdk;
  const env = resolveEnv(spec, deps.env ?? process.env);
  if (spec.provider === 'mock') return mockAdapter(spec);
  if (spec.provider === 'openai-compat') return openaiCompatAdapter(spec, { key: env.compatKey, fetchFn: deps.fetch, baseDelay: deps.baseDelay });
  if (deps.client) return spec.provider === 'gemini' ? geminiAdapter(spec, deps.client) : claudeAdapter(spec, deps.client);
  const need = (name) => loadSdk(name).catch(() => { throw new Error(`SDK fehlt: npm i --no-save ${name}`); });
  if (spec.provider === 'anthropic') {
    const { default: Anthropic } = await need('@anthropic-ai/sdk');
    return claudeAdapter(spec, new Anthropic());
  }
  if (spec.provider === 'vertex-claude') {
    const mod = await need('@anthropic-ai/vertex-sdk');
    const AnthropicVertex = mod.AnthropicVertex ?? mod.default;
    if (!env.project) throw new Error('GCP-Projekt fehlt (GOOGLE_CLOUD_PROJECT oder project)');
    return claudeAdapter(spec, new AnthropicVertex({ projectId: env.project, region: env.region }));
  }
  if (spec.provider === 'gemini') {
    const { GoogleGenAI } = await need('@google/genai');
    const client = spec.vertex
      ? new GoogleGenAI({ vertexai: true, project: env.project, location: spec.location ?? env.region })
      : new GoogleGenAI({ vertexai: false, apiKey: env.geminiKey }); // vertexai explizit aus: GOOGLE_GENAI_USE_VERTEXAI in .env darf den Key-Weg nicht kapern
    return geminiAdapter(spec, client);
  }
  throw new Error(`Anbieter „${spec.provider}“ unbekannt (${PROVIDERS.join(' | ')})`);
}
