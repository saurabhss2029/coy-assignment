# Part A: Using Coy & two feature suggestions

## What I went through
> **TODO (fill in from your own walkthrough; reviewers can tell if this is generic).** For each step, write 1–2 honest sentences on what felt good and what felt confusing or slow:
> - Phone OTP login:
> - Adding a crush:
> - Email verification (why is it needed? did it feel like friction?):
> - The invite link (what did it make you want to do?):
> - The extra-slots screen (did it make sense before you'd used the free slots?):

## Feature 1: Anonymous "nudge" to a crush
**What:** Let a user send a crush a content-free, identity-free signal ("someone is thinking about you"), rate-limited, with no way to tell who or how many.

**Why it's needed:** A mutual-reveal app only works if a crush can find out they're someone's crush. If both people have a crush but neither ever hears anything, the pair never forms. A nudge nudges them into the app without breaking the promise, and it gives inactive users a reason to come back.

**Guardrails:** capped per week, no sender hints, and no confirmation that the recipient has an account (that would leak information too).

## Feature 2: Make the moment after the match matter
**What:** After a mutual reveal, offer a lightweight next step: a conversation starter based on shared interests, a gentle reminder if nobody has messaged within a day or two, and a way to restart a cold match.

**Why it's needed:** The reveal is the product's most valuable moment. If nothing happens afterwards, users get the thrill once and then churn. Turning matches into conversations is the clearest sign the product works.

## How I'd measure each
- Nudge: % of nudged users who open the app within 48h; mutual reveals per nudge sent.
- Post-match: % of matches with a first message in 48h; day-7 retention of matched vs. unmatched users.
