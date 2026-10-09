import { AnalysisResult } from '../types';

export function exportDigestAsMarkdown(result: AnalysisResult, userName?: string): void {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  let md = `# MissedIt AI — Intelligence Briefing\n`;
  md += `**Date:** ${dateStr} | **Topic:** ${result.summary.topicTitle}\n`;
  md += `**Scope:** ${result.summary.totalMessages} messages analyzed across ${result.summary.totalSpeakers} participants in ${result.summary.executionTimeMs}ms\n`;
  md += `*Processed 100% locally on-device — Zero cloud transfer*\n\n`;

  md += `## 📌 Executive Summary\n${result.summary.conciseOverview}\n\n`;

  if (result.urgentItems.length > 0) {
    md += `## 🚨 Urgent Items (${result.urgentItems.length})\n`;
    result.urgentItems.forEach(item => {
      md += `- [ ] **${item.title}** (${item.urgencyReason})\n`;
      md += `  - *Assignee:* ${item.assignee}\n`;
      md += `  - *Evidence:* "${item.sourceMessage.text.replace(/\n/g, ' ')}" — ${item.sourceMessage.sender} (${item.sourceMessage.timestamp || 'No time'})\n`;
    });
    md += `\n`;
  }

  if (userName && result.userTasks.length > 0) {
    md += `## 👤 Assigned to ${userName} (${result.userTasks.length})\n`;
    result.userTasks.forEach(item => {
      md += `- [${item.isCompleted ? 'x' : ' '}] **${item.title}**${item.deadline ? ` (Due: ${item.deadline})` : ''}\n`;
      md += `  - *Evidence:* "${item.sourceMessage.text.replace(/\n/g, ' ')}" — ${item.sourceMessage.sender}\n`;
    });
    md += `\n`;
  }

  if (result.teamTasks.length > 0) {
    md += `## 📋 Team Tasks & Blockers (${result.teamTasks.length})\n`;
    result.teamTasks.forEach(item => {
      md += `- [${item.isCompleted ? 'x' : ' '}] **${item.title}** (Owner: ${item.assignee})\n`;
      md += `  - *Evidence:* "${item.sourceMessage.text.replace(/\n/g, ' ')}" — ${item.sourceMessage.sender}\n`;
    });
    md += `\n`;
  }

  if (result.decisions.length > 0) {
    md += `## ✅ Locked Decisions (${result.decisions.length})\n`;
    result.decisions.forEach(item => {
      md += `- **${item.title}**\n`;
      if (item.rationale) md += `  - *Rationale:* ${item.rationale}\n`;
      md += `  - *Decided by:* ${item.decidedBy} (${item.timestamp || 'N/A'})\n`;
      md += `  - *Citation:* "${item.sourceMessage.text.replace(/\n/g, ' ')}"\n`;
    });
    md += `\n`;
  }

  if (result.unresolvedQuestions.length > 0) {
    md += `## ❓ Unresolved Questions & Follow-ups (${result.unresolvedQuestions.length})\n`;
    result.unresolvedQuestions.forEach(item => {
      md += `- **${item.question}** (Asked by ${item.askedBy})\n`;
      if (item.suggestedAction) md += `  - *Status:* ${item.suggestedAction}\n`;
      md += `  - *Citation:* "${item.sourceMessage.text.replace(/\n/g, ' ')}"\n`;
    });
    md += `\n`;
  }

  // Trigger client-side file download
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `missedit-briefing-${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportDigestAsJson(result: AnalysisResult): void {
  const jsonStr = JSON.stringify(result, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `missedit-digest-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
