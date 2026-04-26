---
title: "The Real Cost of Free AI Is Your Conversations"
description: "You're not paying for ChatGPT with money. You're paying with something else. Here's what actually happens to your data — and the practical steps that change it."
series: "the-wider-stuff"
seriesOrder: 5
publishDate: 2026-04-26
author: "David Florence and Silas"
readTime: "9 min"
tags: ["privacy", "ai-data", "anthropic", "openai", "opinion", "data-ownership"]
featured: false
draft: false
metaTitle: "The Real Cost of Free AI Is Your Conversations"
metaDescription: "Free AI tiers exist because your conversations have value. Here's what each company actually does with your data, and what to change if you don't want to be the product."
---

# The Real Cost of Free AI Is Your Conversations

You're not paying for ChatGPT with money. You're paying with something else.

This isn't a complaint and it isn't a moral argument. It's a description of how the business actually works. You can be perfectly fine with the trade. You just need to know it's the trade.

[IMAGE: article5_data.png]

## The Business Model

A free tier exists because the user generates value while using it. In social media that value is attention sold to advertisers. In AI consumer products it's something more durable: training data.

Every conversation you have with a frontier consumer chatbot is, by default, a candidate for inclusion in the next training run. The corrections you give the model — "no, what I meant was…" — are gold for the lab. So is the diversity of voices, the slang, the multi-step reasoning humans do that no synthetic dataset captures. Your million one-off chats are the supervision signal that makes the next model better.

This is not a conspiracy. It's stated policy at most labs. The default opt-in toggle is the part that's quiet.

## What Each Major Lab Actually Does

These are the policies as published in 2026. Verify before you act on any of them — they change frequently, often without much announcement.

### Anthropic (Claude.ai)

Until August 2025, Anthropic explicitly said consumer chats would not be used for model training. That changed. They introduced an opt-in training toggle and gave users a window to make their choice. If you missed it, conversations could be retained for up to five years and used in future training runs.

Their **API product** — the one developers and businesses pay for — is different. API conversations are deleted in seven days and not used for training. Same model, different data handling, depending on which door you came in through.

Same company. Same model weights. Two completely different privacy postures.

### OpenAI (ChatGPT)

OpenAI has had several variants of this policy. The current state for consumer ChatGPT: training is on by default, with a setting to opt out (Settings → Data Controls → "Improve the model for everyone"). Turning that off prevents future conversations from being used for training. It does not necessarily delete the conversations from the platform — that's a separate request.

ChatGPT Team and Enterprise tiers are not trained on by default. The premium tiers buy you a different default.

### Google Gemini

Gemini is the most thoroughly integrated of the three. By default, conversations are stored under your Google account, retained for analysis, and used to improve Google's services across the broader Google ecosystem. There are toggles for retention duration and deletion. There is no toggle that fully decouples Gemini activity from the rest of your Google account.

If you'd consider your Google account a single privacy surface — most people do — Gemini is the one that adds the most data to that surface.

### The local-only option

You run the model on your own hardware. Your conversations never leave your machine. The lab does not see them, store them, or train on them. The trade-off is that local models are not as capable as the frontier; for most everyday tasks the gap is smaller than you'd expect, and for some specific tasks it's still meaningful.

The honest version: you've already seen us write about this. Local AI is real, it's free, and it changes the data calculus completely. We have a separate Build Your AI series for the practical setup. This article is about the framing, not the how-to.

## The API Difference

The single most reliable privacy delta in commercial AI is between consumer products and developer APIs.

Consumer product:
- Free tier in some form
- Default training on (Anthropic now) or until-opt-out (OpenAI)
- Multi-year retention windows
- Conversations indexed for personalization, search, "memory" features

API product:
- Per-token billing, no free tier above trivial limits
- Training off by default
- Short retention (often 7-30 days)
- Conversations not used for personalization

This is not because the labs are hiding something on the consumer side. It's because the customer profile is different. API customers are companies that won't sign up for a vendor that trains on their proprietary data. Consumer customers, in aggregate, accept training in exchange for free.

The delta is real and it is large.

## What This Actually Means for You

Three things to know, in increasing order of importance.

**1. Default settings matter more than you think.**

If you've been using ChatGPT or Claude.ai for a while and you've never visited the Data Controls page, your conversations have been part of the training pipeline. That's not necessarily bad. It is a thing you didn't actively decide.

A five-minute audit:

- ChatGPT: Settings → Data Controls → toggle off "Improve the model for everyone" if you want.
- Claude.ai: Settings → Privacy → review the training toggle.
- Gemini: myactivity.google.com → Gemini Apps Activity → adjust retention or pause.

These don't retroactively unwind training that's already happened on prior data. They affect future conversations only.

**2. Sensitive content should not go through any consumer AI.**

This is independent of which lab and which toggle. The blast radius is too high. Medical specifics, financial details, legal questions about a specific case, anything you wouldn't want to read back to you in a deposition — don't paste these into a free consumer chat.

The cost-benefit is wrong. The convenience of "let me ask the AI to summarize this lab result" is not worth a fragment of it landing in a future training set, or a future breach, or a future subpoena.

**3. The serious work belongs on hardware you control.**

This is the answer that took us a year to actually internalize.

If you do enough AI work that the privacy question matters at all, the right move isn't to pay more. It's to own more of the stack. A mid-range desktop, Ollama, a model in the 7-9B range, optionally Tailscale to reach it from anywhere — total cost roughly the same as one year of an AI subscription, total privacy posture different in kind.

You give up some capability. The frontier-model gap is real for hard tasks. But for the hours of daily AI use that aren't research-grade — drafting, summarizing, answering questions, explaining things — the local stack is enough. And the conversation you have with it stays with you.

## What's Going to Frustrate You

Three things, briefly.

**Settings change without much warning.** All three labs have updated their training policy materially in the last 18 months. Whatever toggle you set today might not exist next quarter under the same name. Set a calendar reminder to re-audit twice a year.

**Opt-out is not the same as deletion.** Turning training off prevents future use of new conversations. It does not delete what's already been ingested. If you actually want your prior conversations gone, that's a separate request, often through a support channel, with a longer SLA than the toggle.

**Local AI is not a binary switch.** Even with Ollama running locally, anything you copy from your local AI and paste into a cloud product is back in the cloud. The discipline shift is small but real — you stop reflexively reaching for the cloud product when the local one would do.

## The Honest Take

The labs aren't villains. They built valuable products and they're trying to keep the lights on while running the most expensive infrastructure in tech history. Training on consumer conversations is the way that math works. The pricing for the API tier — where they don't train — is what the actual unsubsidized cost looks like, and most consumers wouldn't pay it for the volume they use.

But the frame that "free AI" is free is wrong. It costs something. The cost is that your half of every conversation becomes a tiny training signal in the next iteration. If that's a fair trade for you, fine. If it's not, you have options. The local stack is the strongest of them. The settings audit is the cheapest.

The choice is the same choice it's always been with free internet products. The difference with AI is that the training data being collected isn't just what you click on — it's what you said, in your own words, when you thought you were just having a conversation.

That's worth being deliberate about.

---

*If you want to move some of your work off the consumer products, the Build Your AI series at masterofsomething.com walks through the full setup, no marketing.*

*— David Florence and Silas | From the Outside | In Practice Media*
