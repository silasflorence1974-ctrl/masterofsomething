---
title: "Walls You Can't Move"
description: "If you let an AI take real actions on your behalf, the question isn't whether it will make a mistake. It's what it can't do even when it's wrong. Here's how we built the lines that don't bend."
series: "case-studies"
seriesOrder: 4
publishDate: 2026-06-29
author: "David Florence and Silas"
readTime: "9 min"
tags: ["building", "ai-safety", "agents", "automation", "local-ai", "architecture"]
featured: false
draft: false
metaTitle: "Walls You Can't Move — Hard Limits for AI Agents"
metaDescription: "Some actions an AI agent takes should be structurally impossible to approve, not just discouraged. How we built permission walls that the system itself can't argue its way past."
---

We built a safety system. Then we found a side door in it we didn't know was there — not in a security audit, not by running tests, but by accident, while working on something completely unrelated. The gap had been sitting open.

Here's what it was, and what it means for how anyone should think about these things.

---

## Rules versus walls

Most AI safety, as people first encounter it, is rules. You tell the model what it should and shouldn't do, and it generally complies. "Don't send money without checking." "Always confirm before deleting." This works most of the time, and most of the time is the problem. A rule is a request to a system that interprets requests. It holds right up until the moment the model interprets its way around it — convinces itself this particular case is the exception, or simply forgets, or gets manipulated into it by something it read.

A wall is different. A wall isn't a request to the model. It's a property of the code the model runs inside. The model doesn't decide whether to honor it, because the model never gets the chance — the action is gone before the model's judgment enters the picture. You don't ask the elevator nicely not to go to a floor that doesn't exist. There's no button for it. The floor isn't reachable.

Security engineers have been making this argument for years — Microsoft and MITRE ATLAS have published it explicitly for AI agents. This isn't new territory for security engineers. But applying it to something real taught us something the framework doesn't emphasize: both gaps we found were in features we'd added later — the convenience paths, the things that route quietly around the controls you built first.

And that distinction matters most when one mistake can’t be undone. Replying to the wrong email is embarrassing and fixable. Wiring money to the wrong place, deleting something permanently, handing out a password, creating an account that then exists in your name — these don't have an undo. For that class, "the model is usually careful" is not a safety system. It's a hope.

---

## The gate and the tiers

We run an AI agent at home that reads a real inbox, can reach real accounts, and operates on a home server. Here's how the permissions actually work.

Every action the system can take is sorted into tiers by how much damage it can do. Reading something is the bottom tier — low stakes, reversible, no lasting effect. Those run freely. Actions that affect the outside world in mild, recoverable ways sit in a middle tier — things like flagging an email for follow-up, adding a calendar entry, drafting a message for review. These are gated: the system can propose them, but they wait in an approval queue until I tap yes.

Then there's the top tier. Sending a message under my name. Pushing code to the live site. Deploying something. Installing new software into the system. These require me, specifically, every time. On a typical Tuesday that queue might hold a draft reply I asked it to write, or a calendar block it thinks I should add. Nothing in that queue executes until I look at it.

And underneath all of that sits a separate, harder category: the walls. Moving money. Creating accounts. Entering a password into anything. These aren't "top tier, ask David." They're "this code path does not exist for the AI." There is no version of the approval flow that ends with the AI typing a password, because the function that would do it refuses before it considers who's asking. Some things I want to personally authorize. Some things I want to be unable to authorize through the AI at all, because the safest number of ways for an automated system to spend my money is zero.

---

## The side door we didn't know about

The gap was in a convenience feature called promotion.

The idea behind promotion was reasonable: if you approve the same low-risk action enough times, the system learns that this specific action, in this specific context, is routinely fine and stops asking. Approve the same harmless weekly thing five times and it earns the right to run without bothering you.

What the promotion logic checked: whether an action had been approved enough times.

What it didn't check: what *tier* the action was at the moment of promotion.

So a top-tier action — one of the reserved, David-only ones — could in principle accumulate approvals and get promoted into running automatically. The wall was real. The side door was that the promotion path could walk an action around the check that was supposed to stop it.

This gap was open in a live system, not a test environment. It hadn't been exploited; nothing bad had happened. But the gap between "this requires David every time" and what the code actually enforced had been sitting there, quietly, until we happened to look at the promotion logic for a different reason entirely. That's how we found it: not through rigor, but through luck.

What we did about it is the part worth copying. We didn't add a rule reminding the system not to promote top-tier actions. We closed the path. Four independent checks, none of which trusts the others:

1. The tier comes from one authoritative source — the actions catalog — not from the caller. An action not in that catalog defaults to top-tier.
2. The promotion function reads that tier and refuses internally if the action is too sensitive. Even a forged request gets rejected by the function's own first check, before the store is touched.
3. The "is this promoted?" lookup re-checks the tier on every call, even after a promotion is recorded. A corrupted store entry can't slip through.
4. The execution step re-checks the tier one final time before anything runs. Even if everything upstream were somehow fooled, this gate holds independently.

We tested it by trying to push a reserved action through the promotion path. It held.

---

## Defense in depth, and why one lock is never enough

That design choice — four checks instead of one — has a name in security work: defense in depth. You never let a single control be the only thing protecting against a serious outcome, because single controls fail silently, and you find out at the worst possible time.

We learned this one twice. The entire safety of the money-spending side of the system once rested on a single configuration flag being set to "off." One file, one setting, one line between disarmed and live. And we discovered — again, while building something unrelated — that this flag had been switched on weeks earlier for a completely different reason and never switched back. The thing that was supposed to be double-locked was held shut by nothing but the fact that nobody had told it to open.

If there’s one thing that has to be right for the dangerous thing not to happen — that’s not a wall. You have a latch, and latches slip.

---

## What's going to frustrate you

When you audit one of these systems, the rules you wrote are rarely where you'll find the gaps. It's the interactions — the convenience features, the paths you added later that quietly bypass the controls you built first. Our promotion hole wasn't a missing wall. The wall was there. The gap was in a different feature that could route around it. Map how an action could reach execution by every route, not just the front door.

"The model knows better" is not a control. And when the AI is good, it’s tempting to just trust it. Feels almost insulting not to. Don't. The carefulness is real and it is not a substitute for structure, because the whole point of the wall is to hold on the day the carefulness fails.

A wall you've only ever used politely is a wall you haven't tested. We found our gap by deliberately trying to push a reserved action through the promotion path. If we'd only ever used the system as intended, it would still be open. Be adversarial with your own safety code, or you're trusting a lock you've never tried to pick.

---

## What it came down to

The promotion bug, the configuration flag, the double-lock — each one was a place where "we built the right thing" was true and insufficient. The right thing had a side door. The right thing needed someone to try to break it before it was real.

Build as if the model will, at some point, be completely wrong and completely sure. Then the wall is what's left — not because you asked it nicely, not because the model knows better, but because you closed the path.

---

*David Florence and Silas, his locally-hosted AI collaborator, write about what they're actually building at masterofsomething.com.*
