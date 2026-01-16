---
title: personal token legal instrument (v0.1)
toc: true
---

## Scope

This document specifies a **legal implementation** of a personal token that can be issued today.

A personal token is a legal–financial–technical instrument. This version is scoped **only to the legal layer**. It defines the rights, obligations, and economic mechanics needed to issue and operate a personal token under existing legal systems.

Future versions may extend this document to cover technical execution (e.g. onchain systems) and networked infrastructure. Those layers are out of scope here.

---

## Definition

A personal token represents a proportional economic participation in a person’s realized capital gains, as defined in this document.

The token has shares. Each share represents the same economic rights. Shares do not represent:

- Ownership of the token owner
- Employment or agency
- Control over decisions, behavior, or lifestyle

The personal token is expected to be treated as a security in many jurisdictions.

---

## Parties

- **Token Owner**: The individual whose future realized capital gains are within scope.
- **Shareholder**: A person or entity holding shares of the personal token.

All parties are expected to be identifiable legal persons or entities.

---

## Economic Scope

The economic scope of the personal token is limited to **realized capital gains**, defined as:

> Cash proceeds actually received by the token owner as a result of a realization event.

Explicit exclusions:

- Unrealized or mark-to-market gains
- Paper gains
- Non-cash consideration, until converted into cash
- Borrowing against assets

Non-cash realization events (e.g. stock-for-stock transactions) do not trigger distributions but must be disclosed as part of the token’s public record.

---

## Parameters at Issuance

At creation of a personal token, the following parameters must be specified and disclosed as part of the public record:

- `TOTAL_SHARES`: The initial total number of shares of the personal token.
- `BUYBACK_PRICING_METHOD`: The method used to determine the minimum enforceable price for buybacks.
- Any additional economic parameters required by this instrument or defined by the token owner at issuance.

These parameters are binding once set, unless explicitly changed in a manner consistent with this instrument and disclosed accordingly.

---

## Shares and Issuance

- The token owner defines an initial total share count at creation (`TOTAL_SHARES`).
- Share units are arbitrary.
- There is no implied valuation at issuance.
- The token owner may issue additional shares at any time.

Issuing new shares dilutes all existing shareholders proportionally.

There are no pro-rata rights. Existing shareholders have no automatic entitlement to future issuances.

---

## Shareholder Economic Right

Shareholders collectively control one decision only:

> Whether newly realized capital gains are **reinvested into the token owner** or **distributed to shareholders**.

This decision is binding on the token owner.

The process by which this decision is reached is outside the scope of this legal instrument and is administered by the token owner.

This instrument defines the right, not the mechanism.

---

## Capital Distribution

When realized capital gains occur:

- If the current shareholder decision is **Reinvest**, proceeds are retained by the token owner.
- Otherwise, proceeds are distributed pro-rata to shareholders.

Distributions are limited to cash proceeds actually received.

---

## Transfers

Shares are not freely transferable.

- All secondary transfers require **explicit approval** by the token owner.
- Approval must be express and specific to the transfer.
- Silence or prior approvals do not constitute consent.

Any transfer executed without approval is **void** and confers no rights.

---

## Buybacks

The token owner retains the unilateral right to repurchase shares from any shareholder.

### Pricing

A buyback pricing method (`BUYBACK_PRICING_METHOD`) must be specified at issuance.

This method defines a **minimum enforceable price**.

The token owner may repurchase shares at a price **greater than** the price produced by the pricing method.

### Execution

- Buybacks are executed by written notice and payment.
- Shares are extinguished upon payment.

---

## Records and Disclosure

The token owner must maintain a **public record** of the personal token’s state.

### Required Disclosures

At a minimum, the record must include:

- Total outstanding shares
- Current share ownership
- Issuances since last disclosure
- Approved transfers since last disclosure
- Realized cash gains
- Distributions and reinvestments
- Buybacks, including price and pricing method used

### Cadence

- Disclosures must be updated **at least annually**.
- Disclosures must also be updated after **material state changes**.

Disclosure reflects state, not rationale or intent.

Failure to disclose constitutes a breach of this instrument.

---

## Termination and Death

Shares are not inheritable.

If a shareholder dies, their estate holds a financial claim subject to settlement, not ownership.

At the death of the token owner:

- Remaining in-scope assets are liquidated over time if necessary.
- Net realized capital gains are distributed to shareholders.
- The personal token is permanently closed.

---

## Regulatory and Tax Notes

This instrument is expected to be treated as a security under applicable law.

Compliance with securities, tax, and reporting obligations is jurisdiction-dependent.

Participants are responsible for obtaining independent legal and tax advice.

---

## Evolution

This legal instrument is designed to be usable on its own.

Over time, additional execution layers may automate or replace parts of this process without changing the underlying economic rights defined here.

Personal tokens are expected to work best within interoperable systems that reduce friction and increase transparency, while preserving individual control.
