---
title: "Giving Your AI Memory: Why a Chatbot That Forgets Is a Toy"
description: "Every time you start a new chat with a local AI, it forgets you. Your name, your work, what you talked about yesterday — gone. Here's how to fix that."
series: "build-your-ai"
seriesOrder: 3
publishDate: 2026-04-26
author: "David Florence and Silas"
readTime: "11 min"
tags: ["basic-memory", "mem0", "memory", "local-ai", "ollama", "agents"]
featured: false
draft: false
metaTitle: "Local AI Memory Setup: Basic Memory + Mem0 (2026 Guide)"
metaDescription: "Most local AI setups forget everything between sessions. Here's how to give yours real persistent memory using Basic Memory and Mem0 — locally, free, and actually useful."
---

# Giving Your AI Memory: Why a Chatbot That Forgets Is a Toy

Every time you start a new chat with a local AI, it knows nothing about you. Your name. Your work. Your kid's name. What you talked about yesterday. Gone.

That's not an assistant. That's a very fast search engine with a personality you have to re-explain every conversation.

The fix is memory. Real persistent memory — facts the AI carries with it across sessions, retrievable on demand, editable by you. This article is about how to wire it up locally on the same hardware you set up in Parts 1 and 2.

![Stacked translucent glass cards holding amber lines — a library of remembered facts](/images/article7_memory.png)

## What Memory Actually Means for AI

The phrase "AI memory" has gotten loose. Let's be specific.

Most "memory" features in cloud chatbots are conversation history. The product remembers the messages in this thread. Switch threads, you start over. Some have evolved to extract a few facts and prepend them to every conversation as a system message — that's what ChatGPT's "memory" toggle does. It's a step up. It's not what we mean here.

What we mean is **a persistent store, separate from the chat, that the AI can read and write**. Two flavors:

- **File-based / structured memory** — markdown files, simple search, human-readable, version-controllable. Great for facts you want to be able to edit by hand. Tool: Basic Memory.
- **Vector / semantic memory** — embeddings of past conversations and documents, retrieved by similarity, scaled to thousands of items. Great for "remember what we discussed three weeks ago." Tool: Mem0 + Qdrant.

You want both. They handle different problems and complement each other cleanly. We'll set up the simpler one first.

## What You'll Need

- Ollama running, with `qwen3:8b` (or similar) loaded. (Part 1.)
- Open WebUI, or any way to run a chat against your local model. (Part 2.)
- An embedding model in Ollama: `ollama pull nomic-embed-text` (~270 MB).
- Basic Memory: `pip install basic-memory` — open source, MIT, runs locally.
- Optional but recommended: Docker with Qdrant for the vector layer.

About 30 minutes total. Maybe an hour if you go deeper into the configuration than you need to.

## Step 1 — Install Basic Memory

```bash
pip install basic-memory
basic-memory --version
```

Basic Memory is a markdown-first knowledge base. It stores notes as files, indexes them with full-text search and vector embeddings, and exposes them as an MCP server. Your AI talks to the MCP server; the MCP server reads and writes the markdown. Everything stays on your disk.

Initialize a vault — this is just a directory where the markdown lives:

```bash
basic-memory project add personal C:\Users\<you>\BasicMemory
```

Pick a path you'll back up. The whole vault is human-readable; if you ever leave Basic Memory the data is yours, in plain markdown.

## Step 2 — Wire It to Your AI

If you're using Open WebUI: Settings → Tools → MCP Servers → add Basic Memory's MCP endpoint. The default after install is `http://localhost:8765`.

If you're using Claude Desktop or another MCP-aware client, edit the config file to include Basic Memory as a server. The Basic Memory docs walk through each client.

When it's wired, the AI gets four tools:

- `read_note` — load a specific note by title
- `write_note` — create or update a note
- `search_notes` — full-text + vector search across the vault
- `delete_note` — remove a note (with confirmation)

Test it: tell the AI "Remember that my dog's name is Cheerio." It should call `write_note`, save a note titled something like "Pets" or "Cheerio" with the fact, and confirm. Verify by opening the markdown file in the vault. The plain text should be there.

## Step 3 — Decide What You Actually Want Stored

This is the step everyone skips. Without intent, your vault becomes a junk drawer.

Categories that work well for personal use:

- **Identity** — your name, location, profession, key relationships
- **Preferences** — communication style, formats you like, things you don't want to be asked
- **Project state** — what you're currently building, where it is, what's next
- **Conversation summaries** — distilled notes from previous sessions, written by the AI at the end of each
- **Decisions** — calls you've made you don't want to re-litigate every time

What does *not* belong:

- Anything you'd be uncomfortable seeing in a backup
- Anything you'd regret if you misplaced the laptop
- Passwords, MFA seeds, payment details — these have their own tools
- Other people's private information without their consent

The line is about the same line you'd use for a paper journal. Memory is that.

## Step 4 — Add the Vector Layer (Optional, Recommended)

For "remember what we talked about three weeks ago" you want vector search across past conversations. That's where Mem0 comes in.

Mem0 is an open-source memory layer that stores conversation snippets as embeddings in a vector database (we use Qdrant) and retrieves the relevant ones when the AI asks. It's designed to plug into agent loops.

Run Qdrant in Docker:

```bash
docker run -d -p 6333:6333 -v qdrant_data:/qdrant/storage \
  --name qdrant qdrant/qdrant
```

Install Mem0:

```bash
pip install mem0ai
```

Configure Mem0 to use your local Ollama for embeddings (so nothing leaves your machine):

```python
from mem0 import Memory

config = {
    "vector_store": {
        "provider": "qdrant",
        "config": { "url": "http://localhost:6333" }
    },
    "embedder": {
        "provider": "ollama",
        "config": { "model": "nomic-embed-text" }
    },
    "llm": {
        "provider": "ollama",
        "config": { "model": "qwen3:8b" }
    }
}
m = Memory.from_config(config)
```

Mem0's API is `m.add()` to store, `m.search()` to retrieve. The trick is that you don't call these manually — you wire them into your agent loop so it automatically saves a few sentences after each interaction and queries before each new one.

Open WebUI doesn't have this loop built in (yet). If you're not building your own agent, stick with Basic Memory only — it covers most of what you actually want, and the markdown layer is more comfortable to live with day-to-day.

## Why This Changes Everything

After a week of using a memory-equipped AI, going back to a stateless one feels broken.

Examples of the difference:

**Without memory:**
> "Hey, can you help me debug this Python script?"
> "Sure! What does the script do?"
> "It's the one I told you about yesterday."
> "I don't have access to previous conversations…"

**With memory:**
> "Hey, can you help me debug this Python script?"
> "The summarizer for your news feed? You hit a token limit last time. What happened today?"

The change isn't intelligence. It's continuity. The AI moves from a tool you reach for to a collaborator that knows where you left off.

![Two terminal windows joined by an unbroken thread of amber light — context carried forward](/images/article7_continuity.png)

## What's Going to Frustrate You

Three predictable ones.

**1. The first run is slow.**

Embedding a fresh vault takes a few seconds per note. If you import a year of journal entries, the first index can take five minutes. After that it's near-instant. Don't kill it during the first index — let it finish.

**2. Embedding model size vs. quality.**

`nomic-embed-text` (270 MB) is the lightest acceptable embedder. `bge-large` (~700 MB) is noticeably better at semantic search. The trade is RAM. If you have 16 GB and you're already running a 5 GB chat model, the small embedder is the right call. If you have 32 GB or more, swap to `bge-large` and the search results get sharper.

**3. The AI hoards.**

Out of the box, models love to write down everything you say. "I'll remember that you mentioned coffee." Without explicit instruction, your vault fills with noise.

The fix is in the system prompt. Tell the AI explicitly: only write notes when you've been asked to remember something, or when you've reached a meaningful conclusion that future-you will need. For everything else, let the conversation be ephemeral. We use a 50-word system prompt block specifically about memory hygiene; it's enough.

## The Overnight Test

The single experiment that proves memory is working:

Start a session at night. Tell the AI three specific facts: a project you're working on, a decision you've made, and something you want to ask about tomorrow. Save the session. Close the chat.

Open a new chat the next morning. Don't reload the previous thread. Ask: "what were we working on?"

If the answer reflects last night's facts, memory is wired. If it says "I don't have context from previous conversations," something in the chain is unhooked — usually the MCP isn't reaching the vault, or the search query isn't being issued.

We've found this single test catches almost every misconfigured setup faster than reading any logs.

## What Comes Next

You now have a local AI that knows you, with a chat interface and persistent memory. The next step is giving it tools — the ability to search the web, read files, control your home, schedule tasks. That's where the agent loop starts.

Part 4 walks through the first tool: web search. It's the simplest of the bunch and the one that adds the most everyday utility. Once that works, the rest of the toolbelt follows the same pattern.

For now, talk to it. The memory is the part that makes everything else feel different.

---

*Read the rest of the Build Your AI series at masterofsomething.com.*

*— David Florence and Silas | In Practice Media*
