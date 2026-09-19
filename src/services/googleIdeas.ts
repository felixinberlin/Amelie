import { getAccessToken } from './googleAuth';

export interface GoogleIdeaItem {
  id: string;
  source: 'docs' | 'drive' | 'gmail' | 'sheets';
  title: string;
  snippet: string;
  fullContent?: string;
  modifiedTime: string;
  url: string;
  mimeType?: string;
  tags: string[];
}

/**
 * Searches Google Drive for documents, text notes, and files that could contain ideas.
 */
export async function searchDriveIdeas(queryStr: string = ''): Promise<GoogleIdeaItem[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in first.');
  }

  // Build Drive query: find Docs, text files, markdown, and sheets not in trash
  const mimeTypes = [
    "mimeType = 'application/vnd.google-apps.document'",
    "mimeType = 'text/plain'",
    "mimeType = 'text/markdown'",
    "mimeType = 'application/vnd.google-apps.spreadsheet'",
  ].join(' or ');

  let q = `trashed = false and (${mimeTypes})`;
  if (queryStr.trim()) {
    const escaped = queryStr.replace(/'/g, "\\'");
    q += ` and (name contains '${escaped}' or fullText contains '${escaped}')`;
  }

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', q);
  url.searchParams.set('pageSize', '30');
  url.searchParams.set('fields', 'files(id,name,mimeType,modifiedTime,webViewLink,description)');
  url.searchParams.set('orderBy', 'modifiedTime desc');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error('Drive search failed:', errBody);
    throw new Error(`Google Drive API error (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  const files = data.files || [];

  return files.map((file: any) => {
    let source: GoogleIdeaItem['source'] = 'drive';
    if (file.mimeType?.includes('document')) source = 'docs';
    else if (file.mimeType?.includes('spreadsheet')) source = 'sheets';

    const tags: string[] = ['Google Drive'];
    if (source === 'docs') tags.push('Google Doc');
    if (source === 'sheets') tags.push('Spreadsheet');

    return {
      id: file.id,
      source,
      title: file.name || 'Untitled Document',
      snippet: file.description || `Last modified ${new Date(file.modifiedTime).toLocaleDateString()}`,
      modifiedTime: file.modifiedTime,
      url: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
      mimeType: file.mimeType,
      tags,
    };
  });
}

/**
 * Fetches the text content of a Google Doc or Drive file to read the idea details.
 */
export async function fetchFileContent(fileId: string, mimeType?: string): Promise<string> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google.');
  }

  // If it's a Google Doc, export as plain text
  if (mimeType === 'application/vnd.google-apps.document') {
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
    const res = await fetch(exportUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      return await res.text();
    }
  }

  // Google Sheets can't be downloaded with alt=media; export as CSV
  if (mimeType === 'application/vnd.google-apps.spreadsheet') {
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`;
    const res = await fetch(exportUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? await res.text() : '';
  }

  // Try downloading directly (text or markdown file)
  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const res = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    return await res.text();
  }

  return '';
}

/**
 * Searches Gmail messages for idea drafts, notes, or messages sent to self.
 */
export async function searchGmailIdeas(queryStr: string = 'idea OR idee OR "app idea" OR "projekt"'): Promise<GoogleIdeaItem[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google.');
  }

  const listUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  listUrl.searchParams.set('q', queryStr);
  listUrl.searchParams.set('maxResults', '20');

  const res = await fetch(listUrl.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error('Gmail search failed:', errBody);
    throw new Error(`Gmail API error (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  const messages = data.messages || [];

  // Fetch snippets for found messages
  const items: GoogleIdeaItem[] = [];
  for (const msg of messages.slice(0, 15)) {
    try {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=From`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const headers = msgData.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const dateStr = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        items.push({
          id: msg.id,
          source: 'gmail',
          title: subject,
          snippet: msgData.snippet || '',
          modifiedTime: dateStr || new Date().toISOString(),
          url: `https://mail.google.com/mail/u/0/#inbox/${msg.id}`,
          tags: ['Gmail', 'Email Thread'],
        });
      }
    } catch (e) {
      console.warn('Error fetching message details for', msg.id, e);
    }
  }

  return items;
}

/**
 * Fetches the static ideas database from public/data/amelie-ideas.json
 * (Works natively on GitHub Pages without credentials or Firebase database).
 */
export async function fetchStaticIdeasData(): Promise<any> {
  try {
    const url = new URL('data/amelie-ideas.json', window.location.href);
    const res = await fetch(url.toString());
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch static ideas dataset:', e);
  }
  return null;
}
