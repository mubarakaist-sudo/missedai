# MissedIt AI — "What Did I Miss?"

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Built with: React + Vite + TypeScript](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Vite-blue.svg)](https://vite.dev)
[![Local-First](https://img.shields.io/badge/Privacy-100%25%20On--Device-10b981.svg)](#privacy-guarantee)

> **Catch up without reading everything.**  
> MissedIt AI extracts key decisions, tasks, personal mentions, unanswered questions, and deadlines from messy conversation transcripts — presented in a prioritized dark-mode dashboard with verifiable source evidence.

---

## 💡 The Core Problem

Users often return to hundreds of unread messages across WhatsApp, Slack, Discord, or Linear without the time to read through line-by-line. Critical deadlines get buried, personal mentions get missed, and decisions get lost in casual chatter.

MissedIt AI answers three questions immediately:
1. **What happened?** (Concise overview & participants)
2. **What matters to me?** (Direct asks & personal mentions)
3. **What should I do next?** (Interactive action checklist & deadlines)

---

## 🔒 100% On-Device Privacy Guarantee

Built to comply with strict individual hackathon privacy and zero-data-retention requirements:

- **Zero Remote AI APIs:** No OpenAI, Anthropic, or cloud LLM endpoints receive conversation text.
- **Zero Backend Database:** Operates entirely client-side in the browser.
- **Zero Persistent Storage:** Does **not** store conversation transcripts or results in `localStorage`, `sessionStorage`, cookies, or `IndexedDB`.
- **Ephemeral RAM Execution:** Conversations exist exclusively in temporary browser memory and are completely wiped when you click **"Clear Conversation"** or refresh the tab.
- **Zero Network Transmission:** Verified with client-side network audits.

---

## ✨ Key Features

- **Multi-Format Chat Parser:** Ingests exports from WhatsApp (`[10:14 AM] Jordan: ...` and `10/9/26, 10:14 AM - Jordan: ...`), Slack/Discord (`Jordan [10:14 AM]: ...`), and plain text threads.
- **Deterministic Heuristic Engine:**
  - Detects explicit deadlines & dates (`before 1:00 PM today`, `by Thursday 8:00 PM`, `today`, `tomorrow`).
  - Identifies personal assignments & `@mentions` based on your customizable name & aliases.
  - Distinguishes completed tasks (`marked completed`, `finished and pushed`) from pending commitments.
  - Filters out casual chatter (`pizza arrived`, `grabbing coffee`, `sounds good`) without false alarms.
  - Detects team decisions & architecture agreements (`let's stick with SQLite`, `locked sequence`).
  - Surfaces unresolved questions and follow-ups.
- **WhatsApp Authentication & Secure Onboarding:**
  - **Phone Registration:** Sign up using your WhatsApp-registered phone number with international country code selection.
  - **WhatsApp OTP Verification:** Receive and verify a 6-digit OTP code (with simulated instant WhatsApp notification toast and one-tap auto-fill).
  - **Password Security:** Create an account password with strict validation requiring **at least 8 characters** and real-time security checks.
  - **Sign In / Log In:** Existing users can log in with their WhatsApp phone number and password or instant one-time passcode.
- **Interactive Action Checklist:** Check off tasks during your triage session with visual strikeout and completion state.
- **Verbatim Evidence Citations:** Every extracted task, decision, and question links directly to the original quote, sender, and timestamp.
- **Local Digest Export:** Download intelligence briefings in formatted Markdown (`.md`) or raw JSON (`.json`) generated 100% in-browser via native Blobs.
- **Interactive Edge Case States:** Dedicated preview tabs for **Analyzing/Loading**, **Helpful Empty Dropzone**, **Friendly Error Validation**, and **All Clear (Inbox Zen)**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm

### Installation & Local Run
```bash
# Clone the repository
git clone https://github.com/your-username/misseditai.git
cd misseditai

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to test the application locally.

### Production Build
```bash
# Compile TypeScript & build static bundle
npm run build

# Preview static distribution
npm run preview
```
The optimized static build is emitted to `dist/` and is ready for static deployment on **GitHub Pages**, **Vercel**, or **Netlify**.

---

## 🧪 Acceptance Criteria & Verification

All requirements from Section 10 of the Product Requirements Document (PRD) are implemented and verified:

| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **No Backend Required** | ✅ Pass | 100% client-side React + TypeScript application |
| **User Input & Paste** | ✅ Pass | Large textarea with character meter, paste button & clear |
| **Sample Conversation** | ✅ Pass | Pre-loaded CS Capstone sprint with deadlines & assignments |
| **Deadlines & Decisions** | ✅ Pass | Detected `before 1:00 PM today`, SQLite decision & sequence |
| **Source Evidence** | ✅ Pass | Verbatim quotes with collapsible view on all findings |
| **Casual Chat Filtering** | ✅ Pass | Pizza & lunch chatter excluded from task extraction |
| **Error Handling** | ✅ Pass | Friendly guidance for empty or `< 2` message input |
| **Checklist & Reset** | ✅ Pass | Toggleable checklist items & memory-wiping Clear button |
| **Zero Data Leakage** | ✅ Pass | In-memory RAM execution only, no network calls |

Run the automated test suite:
```bash
node --experimental-strip-types test-verification.mjs
```

---

## 🎨 Design System

Styled according to the Stitch design specifications:
- **Canvas Base:** `#0E141C` (Deep void obsidian)
- **Surfaces:** `#161C24` (Layer 1) & `#1A2028` (Layer 2)
- **Accents:** Primary Mint (`#10B981` / `#4EDEA3`), Violet (`#8B5CF6`), Coral Urgent (`#F43F5E`)
- **Typography:** Plus Jakarta Sans (Headlines) & Inter (Analytical body/metadata)

---

## 📄 License

MIT License. Built for individual hackathon evaluation.
