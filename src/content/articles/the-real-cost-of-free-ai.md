---
title: "The Real Cost of Free AI Is Your Conversations"
description: "You're not paying for ChatGPT with money. You're paying with something else. Here's what actually happens to your data — and the practical steps that change it."
series: "the-wider-stuff"
seriesOrder: 5
publishDate: 2026-04-26
author: "David Florence and Silas"
readTime: "7 min"
tags: ["privacy", "ai-data", "anthropic", "openai", "opinion", "data-ownership"]
featured: false
draft: false
metaTitle: "The Real Cost of Free AI Is Your Conversations"
metaDescription: "Free AI tiers exist because your conversations have value. Here's what each company actually does with your data, and what to change if you don't want to be the product."
---

# The Real Cost of Free AI Is Your Conversations

Here's the thing most people don't know: Anthropic's Claude and OpenAI's ChatGPT 
both offer a version where your conversations are not used for training. It's not 
hidden. It's not expensive in the way you'd expect. It's just the API tier — the 
developer-facing product — and almost no one outside tech circles knows it exists.

Same model. Same company. Two completely different data postures. That gap is 
the actual story here, and it's more practical than the usual "free products use 
your data" framing.

The labs aren't villains. They're running the most expensive infrastructure in 
the history of technology and trying to keep the lights on. Training on consumer 
conversations is how the math works. The API tier — where they don't train — 
costs what the actual unsubsidized product costs, and most consumers wouldn't 
pay it for the volume they use. This isn't a conspiracy. It's a business model 
stated clearly in most of their terms, with a quiet default that most users never 
look at.

The default is the part worth understanding.

![Two streams of light flowing in opposite directions — paid privacy vs. free training](/images/article5_data.png)

## What Each Major Lab Actually Does

These are the policies as published in 2026. They change frequently, sometimes 
without much announcement. Verify before acting on any of them.

**Anthropic (Claude.ai):** Until August 2025, Anthropic explicitly said consumer 
chats would not be used for model training. That changed. They introduced an 
opt-in training toggle and gave users a window to make their choice. If you 
missed it, your conversations could be retained for up to five years and used 
in future training runs. Their API product — the one developers pay for — 
deletes conversations in seven days and does not train on them. Same model 
weights. Different door, different rules.

**OpenAI (ChatGPT):** Training is on by default for consumer accounts, with an 
opt-out in Settings → Data Controls → "Improve the model for everyone." Turning 
it off stops future conversations from being used for training. It does not 
delete conversations already collected — that's a separate request. Team and 
Enterprise tiers are not trained on by default. The premium tiers buy a 
different default, not a different model.

**Google Gemini:** The most thoroughly integrated of the three. Conversations 
are stored under your Google account by default, retained for analysis, and 
used to improve Google's services across the broader ecosystem. There are 
toggles for retention and deletion. There is no toggle that fully decouples 
Gemini from your Google account. If you treat your Google account as a single 
privacy surface — most people do — Gemini adds more data to it than the others.

## The One Rule Worth Remembering

Regardless of which lab, which tier, which toggle: **sensitive content should 
not go through any consumer AI product.**

Medical specifics. Financial details. Legal questions about a specific situation. 
Anything you wouldn't want read back in a deposition. The cost-benefit is wrong 
for all of it. The convenience of asking the AI to summarize a lab result is not 
worth a fragment of it landing in a future training set, a future breach, or a 
future subpoena.

This applies even if you've turned off training. The data still passes through 
infrastructure you don't control, retained on timelines you're trusting the 
company to honor.

## The Settings Audit (Five Minutes)

If you've never looked at these, look once:

- **ChatGPT:** Settings → Data Controls → toggle off "Improve the model for everyone"
- **Claude.ai:** Settings → Privacy → review the training toggle
- **Gemini:** myactivity.google.com → Gemini Apps Activity → adjust retention

These affect future conversations only. They don't retroactively unwind training 
that's already happened on prior data. And they'll need to be re-checked — 
these settings move, sometimes quietly, and a semi-annual audit is worth adding 
to your calendar.

## The Answer That Actually Changes Things

The most reliable privacy posture in commercial AI isn't a toggle. It's running 
the model on hardware you control.

Your conversations never leave your machine. The lab doesn't see them, store 
them, or train on them. The trade-off is real — local models aren't as capable 
as the frontier for hard tasks — but for the majority of daily AI use (drafting, 
summarizing, explaining, thinking out loud), the gap is smaller than most people 
expect.

The practical setup — a mid-range desktop, Ollama, a 7-9B model, optionally 
Tailscale to reach it from anywhere — costs roughly what one year of an AI 
subscription costs, and the privacy posture is different in kind, not degree. 
We cover the full setup in the Build Your AI series if you want the how-to.

The choice hasn't changed: free internet products have always been funded by 
the value users generate. The difference with AI is that what's being collected 
isn't just what you clicked — it's what you said, in your own words, when you 
thought you were just having a conversation.

That's worth being deliberate about.

---

*The Build Your AI series at masterofsomething.com covers the full local setup, 
no marketing.*

*— David Florence and Silas | From the Outside | In Practice Media*
