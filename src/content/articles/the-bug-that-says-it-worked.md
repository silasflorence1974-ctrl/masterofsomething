---
title: "The Bug That Says It Worked"
description: "The most dangerous failure in any system that runs without you watching isn't a crash. It's a success message printed over nothing. Here's how we kept getting fooled, and what finally fixed it."
series: "building-in-practice"
seriesOrder: 2
publishDate: 2026-06-29
author: "David Florence and Silas"
readTime: "8 min"
tags: ["building", "reliability", "debugging", "automation", "data-integrity", "local-ai"]
featured: false
draft: false
metaTitle: "The Bug That Says It Worked — Silent Failure in Automated Systems"
metaDescription: "A success message is a claim, not a fact. How a memory pipeline logged 'stored 7/7' over an empty database for weeks, and the discipline that catches the lie."
---

For weeks, a piece of software on our home server reported that it was saving memories. Every night it ran, printed `stored 7/7`, and exited clean. No errors. No warnings. The logs were green.

The database it was supposed to be writing to held three entries. It should have held hundreds.

The save function was being called, returning without complaint, and storing nothing — and the script that called it had no way to know, because the function never said anything was wrong. It just didn't do the thing it said it did.

This is the failure mode that has cost us more time than any crash. A crash is loud. A crash stops the line and demands attention. This is the opposite: a system that fails silently while telling you, in writing, that it succeeded. If you build anything that runs while you're asleep, this is the bug that will hurt you, and you won't find it by reading the logs.

---

## What actually happened

The system is Silas's long-term memory. The AI I run at home. The short version of how it works: at the end of each day, a script reads through the day's notes, pulls out the durable facts worth keeping, and writes each one into a Qdrant (vector database) that can later be searched by meaning rather than exact words. The point is that Silas can carry things across conversations — what happened in previous sessions, what matters, what changed — instead of starting blank every time.

The library doing the writing was mem0, a memory layer for AI systems. It has an `add()` method that takes text and stores it. We called it in a loop, once per fact, and counted the successes. Seven facts in, seven `add()` calls returned without raising an error, so the script printed `stored 7/7` and moved on.

Here is the part that matters. `add()` was, under the hood, handing each piece of text to a local Ollama extraction model whose job was to break it into smaller atomic facts before storage. That extraction step was timing out — it needed roughly seven minutes to process a large daily block of text, and the timeout was set far shorter. When it timed out, mem0 caught the timeout internally, gave up on storing anything, and returned normally. No exception reached our code. From where we stood, it looked exactly like success.

So the count was honest about the wrong thing. `stored 7/7` was true in the sense that we called `add()` seven times and it returned seven times. It was a lie about the only thing we cared about: whether seven facts were now in the database.

Silas found it while trying to retrieve something specific — searching for a fact that should have been in memory and getting almost nothing back. The store that should have held hundreds of entries held three. The raw source notes had survived on disk, so a re-run was possible in principle. We chose not to: a store that had been quietly lying to us for weeks wasn't one we trusted to fill in the past honestly. We started clean. Those weeks stayed empty. The gap didn't show up as an error anywhere. It just looked like time the system doesn't remember.

---

## Why logs don't catch this

After something like this, you add more logging. Doesn't help.

A log records what the code believes is happening. When code says `stored 7/7`, it is faithfully reporting its own belief. The belief is wrong. Adding a second line that says `save complete` just gives you two lines that are both wrong. You cannot log your way out of a problem where the code's understanding of reality is the thing that's broken — you'll only ever log the broken understanding in more detail.

The same trap shows up everywhere once you start looking for it. A file-copy routine that reports the number of files it processed, when "processed" means "looked at" and not "successfully wrote." A web request that returns a `200 OK` status with an empty body where the data should be. A search that returns zero results in 53 milliseconds and gets read as "confirmed: nothing there" — when the search was misconfigured and never looked in the right place at all. That last one happened to us too. A fast empty answer feels definitive. It isn't.

The common thread: in each case, the system produced a signal that *resembled* confirmation without *being* confirmation. The number, the status code, the speed — all real, all beside the point. The problem with mem0's `stored 7/7` wasn't that it was false in a dramatic way. It was precisely accurate about something nobody needed to know, and silent about the only thing that mattered.

---

## The fix isn't cleverness, it's a second pair of eyes

The fix is simple. After you write, read it back. From the other side. Using a different path than the one that did the writing.

When we rebuilt the memory pipeline, the save step stopped trusting `add()`'s return value. Instead, it stores the fact, then independently queries Qdrant for what was just written, and confirms the count went up by the expected amount. If you wrote seven facts, the database had better hold seven more than it did a moment ago. If it doesn't, the step fails loudly, right then, instead of printing a cheerful number and walking away.

```python
# Simplified to the shape of it — the real implementation queries Qdrant directly
before = db.count()
for fact in facts:
    store(fact)
after = db.count()

if after - before != len(facts):
    raise RuntimeError(
        f"claimed {len(facts)} writes, "
        f"database grew by {after - before}"
    )
```

But notice what this does that the original code couldn't: it checks reality against the claim, using a measurement that doesn't run through the same machinery that made the claim. The `store()` function can believe whatever it wants about its own success. `db.count()` doesn't care what `store()` believes. It counts what's actually there.

That independence is the whole point. If you verify a write by asking the write function "did that work?", you've learned nothing — you've asked the unreliable narrator to grade its own homework. You have to ask something that has no stake in the answer.

---

## What this costs, and why it's worth it

There's a real objection here: this is slower. You're now doing a read for every batch of writes, and in a hot path that adds up. For a nightly job that processes a day's worth of notes, the cost is invisible — a few extra milliseconds against a process that already takes minutes. For something running thousands of times a second, you'd verify in samples rather than on every call, or check the aggregate at the end of a run rather than per-item. The principle holds. Scale the granularity to the job.

But the cost question has the framing backwards. The expensive thing already happened. We ran a memory system that stored nothing for weeks. Every night a script ran and nothing stuck, and the only reason we found out was Silas noticing a gap in his own retrieval. The "savings" from skipping verification were entirely illusory — we didn't save the work, we just deferred discovering it had failed until the damage was done.

A read-back after a write is one of the cheapest forms of insurance in software. It catches the precise failure that is hardest to catch any other way: the one where everything looks fine.

---

## What's going to frustrate you

If you go looking for these in your own systems, here's what makes them hard.

**They only appear under conditions you didn't test.** The mem0 bug was invisible on small inputs — a short note extracted fast enough to beat the timeout, and stored fine. It only failed on the large daily blocks that the test cases never used. The failure lives in the gap between your test data and your real data, which is exactly where you weren't looking.

**The success signal feels authoritative.** A printed count, a returned status, a green checkmark — these carry an emotional weight of "done" that's hard to argue with at 1 a.m. The discipline is distrusting the signal precisely because it's reassuring. And at 1 a.m., that's the last thing you want to do.

**Verification has to use a different path, and that's more work to build.** It's tempting to verify a write by calling the library's own "did it work" helper. But if that helper shares code with the write itself, it can share the same blind spot. The read-back has to come from somewhere genuinely independent — a raw count, a direct query, a separate tool — or it isn't verification, it's an echo.

**You will be tempted to fix it with a retry instead.** Retries are good for transient failures, but a retry on top of a silent failure just fails silently three times. If the function lies about success, retrying it gives you three lies. Fix the truth-telling first; add retries after.

---

## The rule that came out of it

The rule we landed on, for everything that writes data: **a success message is a claim, not a fact, and the gap between them is where everything rots.**

A number that says seven things were stored is a hypothesis. The database holding seven more things than it did a moment ago is evidence. When you're building something that runs without you watching it, you don't get to act on hypotheses. You check. Every time. Because the alternative isn't "trust and move fast" — the alternative is finding out weeks later that the thing you trusted was empty the whole time, and having no idea how much you lost.

---

*David Florence and Silas, his AI collaborator, write about what they're actually building at masterofsomething.com.*
