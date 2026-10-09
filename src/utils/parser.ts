import type { ChatMessage } from '../types/index.ts';

export function parseChatTranscript(rawText: string): ChatMessage[] {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  const lines = rawText.split(/\r?\n/);
  const messages: ChatMessage[] = [];
  let currentMsg: ChatMessage | null = null;
  let msgIndex = 0;

  // Regex patterns for different common chat export formats
  // 1. WhatsApp / Telegram bracket format: [09:12 AM, 10/9/2026] Maya Chen: message OR [10:14 AM] Jordan: message
  const bracketTimestampRegex = /^\[([^\]]+)\]\s*([^:]+):\s*(.*)$/;

  // 2. WhatsApp dash format: 10/9/26, 10:14 AM - Jordan: message OR 09/10/2026, 10:14 - Jordan: message
  const dashFormatRegex = /^(\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}[,\s]+(?:\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?))\s*[-–—]\s*([^:]+):\s*(.*)$/;

  // 3. Slack / Discord name first format: Jordan [10:14 AM]: message OR Jordan at 10:14 AM: message
  const nameFirstRegex = /^([A-Za-z0-9_\s]{2,25})\s*(?:\[([^\]]+)\]|at\s+([0-9:APMapm\s]+)):\s*(.*)$/;

  // 4. Simple Sender: Message format: Jordan: message
  const simpleSenderRegex = /^([A-Za-z0-9_\s]{2,25}):\s*(.*)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let match = line.match(bracketTimestampRegex);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      const timestamp = match[1].trim();
      const sender = match[2].trim();
      const text = match[3].trim();
      currentMsg = {
        id: `msg-${msgIndex++}`,
        raw: line,
        sender,
        timestamp,
        text,
        index: msgIndex,
      };
      continue;
    }

    match = line.match(dashFormatRegex);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      const timestamp = match[1].trim();
      const sender = match[2].trim();
      const text = match[3].trim();
      currentMsg = {
        id: `msg-${msgIndex++}`,
        raw: line,
        sender,
        timestamp,
        text,
        index: msgIndex,
      };
      continue;
    }

    match = line.match(nameFirstRegex);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      const sender = match[1].trim();
      const timestamp = (match[2] || match[3] || '').trim();
      const text = match[4].trim();
      currentMsg = {
        id: `msg-${msgIndex++}`,
        raw: line,
        sender,
        timestamp: timestamp || undefined,
        text,
        index: msgIndex,
      };
      continue;
    }

    match = line.match(simpleSenderRegex);
    if (match) {
      // Avoid matching HTTP URLs like http: or https:
      if (!match[1].toLowerCase().startsWith('http') && !match[1].toLowerCase().startsWith('ftp')) {
        if (currentMsg) messages.push(currentMsg);
        const sender = match[1].trim();
        const text = match[2].trim();
        currentMsg = {
          id: `msg-${msgIndex++}`,
          raw: line,
          sender,
          text,
          index: msgIndex,
        };
        continue;
      }
    }

    // Continuation line of the current message (e.g. multiline message or wrapped text)
    if (currentMsg) {
      currentMsg.text += `\n${line}`;
      currentMsg.raw += `\n${line}`;
    } else {
      // First line without recognizable sender: create generic message
      currentMsg = {
        id: `msg-${msgIndex++}`,
        raw: line,
        sender: 'Participant',
        text: line,
        index: msgIndex,
      };
    }
  }

  if (currentMsg) {
    messages.push(currentMsg);
  }

  return messages;
}

export function detectSpeakers(rawText: string): string[] {
  const messages = parseChatTranscript(rawText);
  const speakers = new Set<string>();
  for (const m of messages) {
    if (m.sender && m.sender !== 'Participant') {
      speakers.add(m.sender);
    }
  }
  return Array.from(speakers);
}
