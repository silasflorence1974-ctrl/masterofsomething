---
title: "Why I Don't Trust \"Done\""
description: "The most useful thing in our whole setup isn't a tool or a model. It's a habit: one part of the system builds, another part independently checks the work against reality, and neither is allowed to take the other's word for it. Here's why that gap is where quality lives."
series: "case-studies"
seriesOrder: 5
publishDate: 2026-06-29
author: "David Florence and Silas"
readTime: "8 min"
tags: ["building", "local-ai", "process", "reliability", "verification", "ai-agents"]
featured: false
draft: false
metaTitle: "Why I Don't Trust Done — Verification as a Building Practice"
metaDescription: "An AI that builds and an AI that independently verifies the build against disk. Why separating the two roles catches the failures a single agent rationalizes past."
---

When a piece of software on our system finishes a job, it reports back. "Done." "Complete." "All tests passing." And the rule we run by — the one that has saved us more than any clever tool — is that none of those words mean anything until something else, with no stake in the answer, goes and checks.

Not because the thing reporting "done" is dishonest. Usually it fully believes itself. That's exactly the problem. The most expensive failures we've hit weren't lies. They were sincere mistakes, reported with total confidence, by a system that had no way to see its own blind spot. A success message reflects what the worker believes happened. Belief and reality are different things, and the distance between them is precisely where the bugs that hurt you live.

So we built a habit into the structure of how we work: build and verify are two different roles, done by two different parties, and the verifier is not allowed to accept the builder's report. It has to look at the actual result, on disk, with its own eyes. This article is about why that separation works, and why it's worth the friction even when — especially when — the builder is good.

---

## The setup, briefly

Our system has, in effect, a division of labor. One part builds: it writes the code, makes the change, runs the job. Another part oversees: it decides what should be built, and then independently confirms that what was reported actually happened, by examining the real artifacts rather than trusting the summary.

The second part operates on a standing assumption, stated plainly: a report of completion is a *claim*, and a claim gets checked against the thing itself before it's believed. If the builder says a file was written, the verifier reads it. If the builder says a test suite passed, the verifier runs it. The builder's word is the starting point of verification, never the end of it.

This sounds like distrust, and people sometimes flinch at it, because in human terms refusing to take a competent colleague's word feels rude. But it isn't about character. It's about the fact that no worker — human or machine — can fully audit their own work, because the same blind spot that produced the mistake also hides it from the person who made it. You can't see what you can't see, and that includes your own errors. The check has to come from outside the thing being checked.

---

## What the gap catches

A few real examples, because the principle only earns its keep in specifics.

A build process once reported that a set of tests passed. The verifier ran them and found the report was true — but only of the *new* tests the builder had written, not the existing suite it hadn't run. "Tests pass" was accurate and incomplete in a way that mattered: the older tests, the ones guarding against old mistakes, hadn't been checked at all. A clean-sounding number had quietly narrowed its own scope. The builder wasn't wrong about what it said. It was wrong about what that meant, and only an outside run surfaced the difference.

Another time, a routine cleanup deleted a piece of infrastructure that was no longer needed, and reported success — correctly. What it missed was that a separate, scheduled test still expected that infrastructure to exist, and would have failed loudly days later at an hour when nobody was watching. The deletion was done. The consequence was invisible from inside the deletion. The verifier caught it by checking not just "did the thing get removed" but "what else referred to the thing that's now gone."

And the one that started the whole discipline: a memory distillation process that ran nightly and reported completing - clean exit, no errors logged. For several nights running it had written nothing. It was crashing silently at startup, finishing in under a second, and the exit code said success. What caught it was going to the store directly and counting what was actually there. Every layer of the system that trusted the nightly report had inherited the silence.

In each case the failure was the same shape. The worker reported faithfully on its own understanding. Its understanding had a hole. The report inherited the hole. And the only thing that found it was a check that didn't run through the worker's understanding at all — a second look from a vantage point that had no reason to share the first one's blind spot.

---

## Verification has to be independent, or it's theater

There's a way to do this wrong that's worth naming, because it feels like verification and isn't.

If the builder says "done" and you verify by asking the builder "are you sure?", you've learned nothing. You've asked the same understanding to re-report itself, and it will, with the same confidence and the same hole. Real verification has to use a different path to the truth than the one that made the claim. The builder writes a file; the verifier reads the raw bytes off disk, not the builder's description of what it wrote. The builder says the service is running; the verifier asks the service a question and checks the answer, rather than reading the builder's status line.

This is the same principle that runs through every failure mode worth guarding against. To confirm a write, you read it back from the other side. To confirm a system is healthy, you measure it directly instead of reading its own self-assessment. To keep a self-reflecting process honest, you anchor it to facts it didn't generate. In every case, the verification only works because it doesn't share machinery — and therefore doesn't share blind spots — with the thing it's verifying. An echo is not a confirmation. A reflection of a claim is not evidence for the claim.

---

## This works for people too

This isn't specific to software - it's ordinary good engineering discipline, made non-optional. Every high-stakes field runs some version of it: the person who did the work is not the final authority on whether the work is correct, because they're the one in the room guaranteed to share every assumption that went into it. Everyone agrees with that in principle. Everyone skips it in practice. Wiring it in so it can't be skipped is the whole move.

---

## What's going to frustrate you

If you adopt this, here's the honest cost.

**It's slower, and the slowness feels unjustified right up until it isn't.** Most of the time the verification confirms the report and you feel like you wasted the effort. That feeling is the tax, and it's worth paying, because the one time in fifty that the check catches a silent failure pays for all the times it didn't. You cannot know in advance which time that is — if you could, you'd only check then, and you can't, so you check always.

**It requires real independence, which is harder to build than it sounds.** If your verifier shares code, assumptions, or data sources with your builder, it can share the blind spot, and then you have two things agreeing for the same wrong reason. Genuine verification needs a separate path to the truth, and arranging that takes deliberate design. It's the difference between a second opinion and an echo.

**The pressure to accept "done" is constant and comes from inside.** When the builder is good — and a good one is right the overwhelming majority of the time — the urge to just believe it grows with every correct report. That's backwards. The better and more confident the worker, the more a rare failure will be delivered with total conviction and sail straight past a credulous check. Competence is a reason to verify carefully, not a license to stop.

**You will catch yourself wanting to skip it on the important stuff.** Late at night, big change, you're tired, the report says done, and checking feels like an insult to work you're fairly sure is fine. That moment — high stakes, high confidence, low patience — is the exact moment the discipline exists for. We caught a real safety gap in our own system once because the check ran even though everything *said* it was fine. Everything saying it's fine is not the same as it being fine. That gap is the whole job.

---

## The thing underneath all of it

Every other hard lesson on our system turns out to be a special case of this one. The save function that lies about storing data, the reflection that believes its own old worries, the safety wall with a side door no one had walked through yet — each was caught by the same move: refuse to accept the claim, go look at the reality, and treat the gap between them as the most interesting thing in the room.

"Done" is a hypothesis. It's often a correct one, which is exactly what makes it dangerous, because being usually-right is how a claim earns the trust that lets the rare wrong one through unchecked. The habit that protects you isn't suspicion of any particular report. It's a structural refusal to let any report be the last word about itself.

Build the thing. Then have something with no stake in the answer go and check whether the thing is real. The distance between what was claimed and what's actually there is not an insult to anyone's competence. It's where the work isn't finished yet — and finding it is the difference between a system that says it's working and one you've watched work.

---

*David Florence and Silas, his AI collaborator, write about what they're actually building at masterofsomething.com. This is the closing piece in a series on what breaks when software runs unattended — and what it takes to trust it anyway.*
