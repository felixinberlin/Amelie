/**
 * Pure TypeScript OASIS XLIFF 1.2 Parser
 * Parses raw .xlf XML strings into structured key-value translation dictionaries.
 * Fully compatible with browsers and Node.js environments.
 */

export interface XliffTransUnit {
  id: string;
  source: string;
  target?: string;
  resname?: string;
  note?: string;
}

export interface XliffDocument {
  sourceLanguage: string;
  targetLanguage?: string;
  original?: string;
  units: Record<string, string>;
  rawUnits: Record<string, XliffTransUnit>;
}

/**
 * Decode XML entities like &amp;, &lt;, &gt;, &quot;, &apos;
 */
function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/**
 * Parse an XLIFF 1.2 XML string into a structured XliffDocument.
 * Uses a robust regex and tag extractor that never fails regardless of XML strictness.
 */
export function parseXliff(xmlString: string): XliffDocument {
  // Extract file tag attributes
  const fileTagMatch = xmlString.match(/<file\s+([^>]+)>/i);
  let sourceLanguage = 'en';
  let targetLanguage: string | undefined = undefined;
  let original: string | undefined = undefined;

  if (fileTagMatch) {
    const attrs = fileTagMatch[1];
    const srcMatch = attrs.match(/source-language=["']([^"']+)["']/i);
    if (srcMatch) sourceLanguage = srcMatch[1];

    const trgMatch = attrs.match(/target-language=["']([^"']+)["']/i);
    if (trgMatch) targetLanguage = trgMatch[1];

    const origMatch = attrs.match(/original=["']([^"']+)["']/i);
    if (origMatch) original = origMatch[1];
  }

  const units: Record<string, string> = {};
  const rawUnits: Record<string, XliffTransUnit> = {};

  // Match all <trans-unit ...> ... </trans-unit> blocks
  const transUnitRegex = /<trans-unit\s+([^>]+)>([\s\S]*?)<\/trans-unit>/gi;
  let match: RegExpExecArray | null;

  while ((match = transUnitRegex.exec(xmlString)) !== null) {
    const attrString = match[1];
    const unitBody = match[2];

    const idMatch = attrString.match(/id=["']([^"']+)["']/i);
    if (!idMatch) continue;
    const id = idMatch[1];

    const resnameMatch = attrString.match(/resname=["']([^"']+)["']/i);
    const resname = resnameMatch ? resnameMatch[1] : id;

    // Extract <source>
    const sourceMatch = unitBody.match(/<source(?:\s+[^>]*)?>([\s\S]*?)<\/source>/i);
    const source = sourceMatch ? decodeXmlEntities(sourceMatch[1].trim()) : '';

    // Extract <target>
    const targetMatch = unitBody.match(/<target(?:\s+[^>]*)?>([\s\S]*?)<\/target>/i);
    const target = targetMatch ? decodeXmlEntities(targetMatch[1].trim()) : undefined;

    // Extract <note>
    const noteMatch = unitBody.match(/<note(?:\s+[^>]*)?>([\s\S]*?)<\/note>/i);
    const note = noteMatch ? decodeXmlEntities(noteMatch[1].trim()) : undefined;

    // If target exists and isn't empty, use target; otherwise fallback to source
    const value = target !== undefined && target !== '' ? target : source;

    units[id] = value;
    rawUnits[id] = {
      id,
      resname,
      source,
      target,
      note,
    };
  }

  return {
    sourceLanguage,
    targetLanguage,
    original,
    units,
    rawUnits,
  };
}
