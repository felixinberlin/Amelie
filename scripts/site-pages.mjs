import { build } from 'esbuild';
import { mkdtemp, readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Source registries are read at build time; only tiny navigation metadata ships in the shell. */
export function sitePages() {
  let root, base, outDir, data, isBuild;
  async function loadData() {
    const temp = await mkdtemp(join(tmpdir(), 'amelie-pages-'));
    try {
      const outfile = join(temp, 'registry.mjs');
      await build({ stdin: { contents: `
        export { DOSEN_DATA, DISCARDED_DATA } from './src/data/dosen';
        export { DOSE_BOOKS } from './src/data/doseBooks';
        export { ALL_NAV_TABS } from './src/data/navigation';
        export { DOSE_SIMULATOR_MAP } from './src/data/doseSimulators';
        export { CANDIDATE_IDEAS_DATA } from './src/data/unpacked';
        export { pipelineIdeas, GAME_DOSE_IDS } from './src/data/pipeline';
        export { NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS } from './src/data/ideas/normalJobsAndEverydayPeople';
        export { GAME_IDEAS } from './src/data/ideas/games';
        export { PLAYABLE_GAME_COUNT } from './src/data/playableGames';
        export { DELIVERIES_DATA } from './src/data/deliveries';
        export { AMELIE_MUSTERS } from './src/data/musterEmails';
        export { FUNDING_DATA } from './src/data/funding';
        export { QUELLEN_DATA } from './src/data/quellen';
        export { SISTER_PROJECTS } from './src/data/sisterProjects';
        export { tabPath, dosePath, chapterPath, simulatorPath, venturePath } from './src/routing/routes';
      `, resolveDir: root, loader: 'ts' }, bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent' });
      const m = await import(pathToFileURL(outfile).href);
      const ventures = JSON.parse(await readFile(resolve(root, 'public/data/ventures-dashboard.json'), 'utf8'));
      const simulatorKeys = [...new Set(Object.values(m.DOSE_SIMULATOR_MAP).map(s => s.key))];
      const metadata = {
        candidateIds: m.CANDIDATE_IDEAS_DATA.map(c => c.id),
        doseIds: m.DOSEN_DATA.map(d => d.id),
        chapters: Object.fromEntries(Object.entries(m.DOSE_BOOKS).map(([id, chapters]) => [id, chapters.map(c => c.slug)])),
        ventureIds: ventures.leads.map(v => v.id),
        counts: {
          dosen: m.DOSEN_DATA.length, discarded: m.DISCARDED_DATA.length,
          unpacked: m.pipelineIdeas(m.CANDIDATE_IDEAS_DATA).length,
          'normal-jobs': m.NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.length,
          games: m.GAME_IDEAS.length + m.GAME_DOSE_IDS.length + m.PLAYABLE_GAME_COUNT,
          sandboxes: simulatorKeys.length, matrix: m.DELIVERIES_DATA.length,
          'muster-emails': m.AMELIE_MUSTERS.length, funding: m.FUNDING_DATA.length,
          quellen: m.QUELLEN_DATA.length, relatives: m.SISTER_PROJECTS.length,
        },
      };
      const pages = [{ path: '/', title: 'Amélie — Gifts', description: 'Ideas and tools given away as public goods.' }];
      for (const tab of m.ALL_NAV_TABS) pages.push({ path: m.tabPath(tab), title: `Amélie — ${tab}`, description: `Explore Amélie: ${tab}.` });
      for (const dose of m.DOSEN_DATA) {
        pages.push({ path: m.dosePath(dose.id), title: `${dose.title} — Amélie`, description: dose.oneLinerEn });
        for (const chapter of m.DOSE_BOOKS[dose.id] ?? []) pages.push({ path: m.chapterPath(dose.id, chapter.slug), title: `${chapter.titleEn} — ${dose.title}`, description: chapter.noteEn });
      }
      for (const key of simulatorKeys) {
        const info = Object.values(m.DOSE_SIMULATOR_MAP).find(s => s.key === key);
        pages.push({ path: m.simulatorPath(key), title: `${info.titleEn} — Amélie`, description: info.descriptionEn });
      }
      for (const venture of ventures.leads) pages.push({ path: m.venturePath(venture.id), title: `${venture.name} — Amélie`, description: `Amélie venture: ${venture.name}.` });
      metadata.pages = Object.fromEntries(pages.map(({ path, title, description }) => [path, { title, description }]));
      return { metadata, pages };
    } finally { await rm(temp, { recursive: true, force: true }); }
  }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  return {
    name: 'amelie-static-pages', enforce: 'post',
    async configResolved(config) {
      isBuild = config.command === 'build';
      root = config.root; base = config.base; outDir = resolve(root, config.build.outDir);
      data = await loadData();
    },
    resolveId(id) { if (id === 'virtual:site-metadata') return '\0virtual:site-metadata'; },
    load(id) { if (id === '\0virtual:site-metadata') return `export default ${JSON.stringify(data.metadata)};`; },
    async closeBundle() {
      if (!isBuild) return;
      const index = await readFile(join(outDir, 'index.html'), 'utf8');
      for (const page of data.pages) {
        const canonical = `https://felixinberlin.github.io${base}${page.path.slice(1)}`;
        const html = index.replace(/<title>.*?<\/title>/s, () => `<title>${escape(page.title)}</title>`)
          .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*("\s*\/>)/g, (_match, before, after) => before + escape(page.description) + after)
          .replace(/(<meta property="og:title" content=")[^"]*("\s*\/>)/, (_match, before, after) => before + escape(page.title) + after)
          .replace('</head>', `    <link rel="canonical" href="${escape(canonical)}" />\n  </head>`);
        const dir = join(outDir, page.path);
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, 'index.html'), html);
      }
      await writeFile(join(outDir, '404.html'), index.replace('</head>', '<meta name="robots" content="noindex" /></head>'));
      await writeFile(join(outDir, '.nojekyll'), '');
      await writeFile(join(outDir, 'route-manifest.json'), JSON.stringify(data.pages, null, 2) + '\n');
    },
  };
}
