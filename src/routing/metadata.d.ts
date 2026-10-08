declare module 'virtual:site-metadata' {
  export interface SiteMetadata {
    pages: Record<string, { title: string; description: string }>;
    candidateIds: string[];
    counts: Record<string, number>;
    doseIds: string[];
    chapters: Record<string, string[]>;
    ventureIds: string[];
  }
  const metadata: SiteMetadata;
  export default metadata;
}
