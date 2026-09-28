import { describe, it, expect } from 'vitest';

// Define a simple DocumentProcessor class for testing purposes
class DocumentProcessor {
  /**
   * Cleans and normalizes text for LLM processing.
   * - Removes excessive whitespace
   * - Trims leading/trailing whitespace
   * - Converts to lowercase (optional, depending on LLM)
   * - Handles basic punctuation normalization
   */
  static cleanTextForLLM(text: string): string {
    if (!text) return '';
    // Replace multiple newlines/spaces with a single space
    let cleaned = text.replace(/\s+/g, ' ').trim();
    // Normalize punctuation: ensure one space after, remove spaces before
    cleaned = cleaned.replace(/\s*([.,!?;:])\s*/g, '$1 ');
    // Remove trailing space if the last char is punctuation (from above rule)
    if (cleaned.length > 0 && [',', '.', '!', '?', ';', ':'].includes(cleaned[cleaned.length - 1])) {
      cleaned = cleaned.trim();
    }
    return cleaned.toLowerCase(); // Example: convert to lowercase
  }

  /**
   * Splits a document into chunks suitable for LLM context windows.
   * This is a simplified example, real-world would involve more complex logic
   * like sentence boundary detection, token counting, and overlap.
   */
  static chunkDocument(text: string, chunkSize: number = 200, overlap: number = 50): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk) {
        chunks.push(chunk);
      }
    }
    return chunks;
  }
}

describe('DocumentProcessor', () => {
  it('should clean text by normalizing whitespace and converting to lowercase', () => {
    const input = "  This is a TEST.   With   extra  spaces and  Newlines.\nAnother line! ";
    const expected = "this is a test. with extra spaces and newlines. another line!";
    const actual = DocumentProcessor.cleanTextForLLM(input);
    expect(actual).toBe(expected);
  });

  it('should handle empty string gracefully for cleaning', () => {
    expect(DocumentProcessor.cleanTextForLLM('')).toBe('');
    expect(DocumentProcessor.cleanTextForLLM('   ')).toBe('');
  });

  it('should split a short document into a single chunk', () => {
    const text = "This is a short document that should fit into one chunk easily.";
    const chunks = DocumentProcessor.chunkDocument(text, 50, 10);
    expect(chunks.length).toBe(1);
    expect(chunks[0]).toBe(text);
  });

  it('should split a longer document into multiple chunks with overlap', () => {
    const text = "This is the first sentence. This is the second sentence. This is the third sentence. This is the fourth sentence. This is the fifth sentence. This is the sixth sentence. This is the seventh sentence. This is the eighth sentence. This is the ninth sentence. This is the tenth sentence.";
    const chunkSize = 10; // words
    const overlap = 3; // words
    const chunks = DocumentProcessor.chunkDocument(text, chunkSize, overlap);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].split(' ').length).toBeLessThanOrEqual(chunkSize);
    expect(chunks[1].split(' ').length).toBeLessThanOrEqual(chunkSize);

    // Simple check for overlap presence, not exact content verification for brevity
    const firstChunkEnd = chunks[0].split(' ').slice(-overlap).join(' ');
    expect(chunks[1]).toContain(firstChunkEnd);
  });

  it('should handle document chunking for exact chunk size', () => {
    const text = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen";
    const chunkSize = 5;
    const overlap = 0;
    const chunks = DocumentProcessor.chunkDocument(text, chunkSize, overlap);
    expect(chunks.length).toBe(3);
    expect(chunks[0]).toBe("one two three four five");
    expect(chunks[1]).toBe("six seven eight nine ten");
    expect(chunks[2]).toBe("eleven twelve thirteen fourteen fifteen");
  });

  it('should return an empty array for an empty document', () => {
    expect(DocumentProcessor.chunkDocument('', 10)).toEqual([]);
    expect(DocumentProcessor.chunkDocument('   ', 10)).toEqual([]);
  });
});