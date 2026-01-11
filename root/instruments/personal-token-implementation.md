---
title: personal token implementation (v0.1)
toc: true
---

## Overview

This document describes a concrete, onchain implementation of the personal token primitive defined in the [personal token spec](/personal-token-spec).

> Note: this is a very early draft. There are many details to flesh out to be able to implement this. We welcome contributions.

## Legal-Financial-Technical

We treat the personal token as a **legal–financial–technical instrument**: its operational state is represented and executed onchain as the canonical system of record, designed to remain coherent with and enforceable within existing legal systems.

Token owners and shareholders must be identifiable legal persons or entities, and legally binding court orders or regulatory directives may compel administrative onchain state changes in cases such as fraud, coercion, or incapacity. This legal grounding is a deliberate design choice to provide real-world enforceability and protection.

This implementation assumes that relevant assets, ownership state, voting state, and capital flows are represented onchain as part of onboarding, and that the onchain contracts constitute the canonical execution layer.

## Sufficiently decentralized

This implementation aims to be **sufficiently decentralized**: economic rights and operational state are enforced by transparent onchain contracts, while a minimal, explicitly scoped operator interface exists to keep the system coherent with real-world identity and legal enforcement. The goal is to minimize discretionary power and trust surface area while preserving user safety and legal grounding.

## Operator

This implementation assumes the presence of a centralized operator (referred to here as *rootnet*) with narrowly scoped responsibilities: ensure the system remains aligned with legal reality by propagating onchain state changes into the corresponding legal/administrative record, and propagating legally binding directives into the onchain source of truth when required.

Rootnet also provides identity verification, onboarding, and support for a permissioned instrument, and has limited administrative powers to execute compelled state changes and preserve the integrity and safety of the system under predefined procedures, including in unforeseen legal or operational scenarios.

Rootnet’s authority is constrained by transparency: every administrative action it takes is publicly visible and auditable onchain. Because the core ledger is public, the system is forkable: if trust in rootnet is lost, token owners and shareholders can coordinate to migrate to a forked deployment and a different operator, without depending on rootnet’s cooperation.

## Personal token

### Onchain representation:

- personal token shares are represented as onchain units of ownership.
- Share ownership state is canonical and publicly readable.
- No transfer, issuance, or routing action occurs offchain.

### Economic meaning:

- Shares represent proportional economic participation in the token owner’s realized capital gains within the defined economic scope.
- Shares do not represent ownership, employment, partnership, agency, or governance over the token owner.

### Legal instrument (offchain):

In deployments, the onchain ledger corresponds to a real‑world legal instrument and related agreements intended to remain coherent with it.

The onchain contracts are the canonical source of truth for all state transitions.

## Economic Scope

Economic scope is defined in the specification; this section defines how that scope is represented and enforced onchain.

In this implementation, all in-scope instruments are represented onchain (e.g., tokenized equity-like instruments, personal token shares, and other designated upside-only instruments). Scope is enforced by:

- an onchain registry of eligible instruments (and instrument types) whose realized gains are in-scope
- a canonical routing contract that receives proceeds from in-scope realization events and routes them according to the current voting state
- publicly readable logs that link each routed inflow to the instrument it came from

Assets and income sources that are not represented onchain are out of scope for this implementation.

## Shares & Issuance

The token owner defines an initial total share count at creation.

- share units are arbitrary
- no implied valuation exists at issuance
- additional shares may be issued at any time

Issuing new shares dilutes existing shareholders proportionally.

There are no pro‑rata rights. Existing shareholders have no automatic entitlement to future issuances.

## Control & Transfers

The token owner retains unilateral control over:

- who may hold shares
- who may receive newly issued shares
- whether secondary transfers are permitted

All secondary transfers require explicit token owner approval unless otherwise permitted through designated liquidity mechanisms.

There is no public or permissionless market.

## Capital Flow

personal token shares entitle holders to participate in capital gains realized by the token owner.

When capital gains are realized, they are routed according to the current onchain voting state.

Shareholders collectively determine one question only:

**Should newly realized capital gains be reinvested into the token owner, or distributed to shareholders?**

## Voting

Voting is continuous and onchain.

- each share represents one vote
- voting options are strictly binary: Reinvest or Distribute
- shareholders may change their vote at any time

At the moment capital gains are realized:

- if >50% of outstanding shares vote Reinvest, gains are routed back to the token owner
- otherwise, gains are distributed pro‑rata to shareholders

Voting does not evaluate intent, effort, behavior, or lifestyle. It exists solely to route capital.

## Liquidity

Shareholders primarily realize value through secondary sales.

At the token owner’s discretion, subsets of shares may be designated as transferable through permissioned liquidity pools.

Such pools:

- are optional
- may be programmatically defined
- may incorporate rule‑based or AI‑based gating
- may be modified or revoked at any time

Liquidity pools enable limited liquidity and price discovery without creating a public or permissionless market.

Secondary transfers may route a royalty back to the token owner, as defined by the pool rules.

## Safeguards

The token owner retains the unilateral right to repurchase shares from any shareholder.

This mechanism exists as an extraordinary safeguard to protect the integrity, safety, and freedom of the instrument.

Safeguards:

- buyback pricing must be fair‑market or formula‑based
- execution and rationale must be publicly recorded

Reputation and transparency are the primary constraints against abuse.

## Records & Transparency

The following onchain state is publicly readable:

- share ownership
- issuance events
- approved transfers
- voting state
- capital routing outcomes
- buybacks and justifications

Transparency is foundational to enforcement through reputation rather than coercion.

## Termination & Death

If a shareholder dies, shares are not inheritable. The estate holds a financial claim subject to settlement, not ownership.

At the death of the token owner:

- remaining equity holdings are liquidated over time if necessary
- net capital gains are distributed to shareholders
- the personal token is permanently closed

This ensures that all deferred value is ultimately realized and settled.

## Legal Notes

This implementation is expected to be treated as a security in many jurisdictions.

It is not designed to evade securities regulation. Real‑world deployments must comply with applicable laws, including registration, exemptions, disclosure, and transfer restrictions.

Holding personal token shares carries no guarantee of returns.

Tax treatment is jurisdiction‑dependent. Participants are responsible for obtaining independent legal and tax advice.

This document describes an early implementation. Execution details may evolve while preserving core economic intent.
