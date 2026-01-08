---
title: PERSONAL TOKEN v0.1
caption: A legal-financial instrument that enables people to incentivize help across their lives.
toc: true
---
## Context

Modern economic systems are excellent at allocating talent, attention, and capital toward **ideas** - primarily through companies. However, they provide no comparable mechanism to support **open-ended explorations** or a person’s life trajectory before a concrete idea exists, and across everything they ever work on.

As a result, many potentially world-changing explorations never happen, not due to lack of ability or conviction, but because individuals cannot incentivize the deep, long-term help such journeys require.

A **Personal Token** is designed to fix this. It allows an individual to share a portion of their future value creation in order to attract meaningful collaboration - without starting a company or constraining their freedom.

This document specifies the **mechanics** of the Personal Token. For the full motivation, philosophy, and broader vision - [read the story](/help).

---

## 1. What a Personal Token Is

A Personal Token is a **permissioned, upside-only instrument** that gives its holders a proportional claim on a defined pool of an individual’s **future capital gains from equity holdings**.

It enables a person (the _Owner_) to:
- Incentivize deep, long-term help
- Coordinate talent, signal, and capital before specific ideas exist
- Share success across their life, not just within a single company

One-line: **A Personal Token is a permissioned, upside-only claim on a person’s future capital gains, designed to incentivize help across their life without confining their freedom.**

---

## 2. What a Personal Token Is Not

A Personal Token is **not**:
- Equity in a person
- A claim on income, wages, or labor
- Debt or an obligation to repay
- A governance mechanism over life choices
- A public or permissionless market instrument

The token exists solely to share upside from value creation—not to impose control.

---

## 3. Parties & Roles

### Owner

The individual issuing the Personal Token.

### Shareholders

Approved holders of Personal Token shares.

### Token Entity (optional)

An entity or abstraction that sits between the Owner and Shareholders to administer the Personal Token.

The Token Entity may:
- receive and route capital gains
- reflect share ownership state and voting state
- maintain shared records for transparency

The Token Entity exists solely to support coordination and execution of the instrument, and does not confer control, ownership, or authority beyond what is explicitly specified in this document.

---

## 4. Economic Scope

Each Personal Token share represents a **proportional claim on a defined pool of future capital gains** earned by the Owner.

### 4.1 Included Gains

Capital gains realized by the Owner from:
- Sale of equity in companies
- Exit events (acquisition, IPO, secondary sales)
- **Sale of Personal Token shares issued by other individuals**
- **Sale of Network Token shares or similar higher-order instruments**
- Sale of equity-like assets explicitly designated by the Owner**

This includes gains from instruments that represent claims on future value creation, including personal, network, or other structurally similar tokens developed within this ecosystem.

For avoidance of doubt, an equity-like asset refers to any asset that represents an upside-only claim on future value creation, and that the Owner has publicly designated as included. Such designation may occur at any time, and must be disclosed transparently.

### 4.2 Excluded Gains

The token explicitly excludes:
- Salaries, wages, or consulting income
- Royalties, fees, tips, or grants
- Inheritance
- **Real estate and property assets (e.g., primary residences, land, rental properties)**
- Non-equity assets (unless explicitly opted in)
- Passive income unrelated to equity (e.g., rent, interest)

This ensures the token is grounded only in meaningful value creation, not personal consumption, shelter, or asset classes unrelated to compounding through ideas, networks, or enterprises.

---

## 5. Shares & Issuance

### 5.1 Initial Supply
- Initial share count defined by the Owner
- Arbitrary units (e.g., 10,000,000 shares)
- No implied valuation at issuance
### 5.2 Issuance
- The Owner may issue new shares at any time
- Issuance causes dilution of existing shareholders
- No pro-rata rights
- No automatic entitlement to future issuance

Dilution is intentional and reflects evolving alignment and contribution over time.

---

## 6. Control & Transfers

### 6.1 Cap Table Control

The Owner retains unilateral control over:
- Who may receive shares
- Who may acquire additional shares
- Whether transfers are permitted

### 6.2 Secondary Transfers
- All secondary transfers require Owner approval
- No public market or IPO
- All approved transfers are recorded transparently

The cap table remains permissioned and treated as sacred.

### 6.3 Liquidity Pools (Optional)

At the Owner’s discretion, a defined subset of shares may be designated as transferable without case-by-case approval.

Such designation may be subject to explicit rules, limits, venues, or automated, programmatic, or artificial intelligence–based mechanisms that reflect the Owner’s intent, and may be modified or revoked at any time.

Liquidity pools exist to enable limited liquidity and price discovery. They do not create a public or permissionless market, and do not confer governance rights or influence over the Owner.

---

## 7. Capital Flow

### Reinvesting Dividends

Personal Token shares represent claims on future capital gains generated by the Owner.

Capital gains are not automatically distributed to shareholders when they are realized. During periods of growth, capital gains are typically **reinvested into the Owner** rather than paid out. Reinvesting dividends allows capital to continue compounding through the Owner’s future activities, increasing the total value available to shareholders over time.

Distribution of capital gains becomes appropriate when reinvestment is no longer expected to compound meaningfully.

The purpose of shareholder voting in this section is to determine **whether newly realized capital gains should continue to be reinvested, or be distributed instead**.

### Reinvestment vs. Distribution

Personal Token shareholders can influence **exactly one decision**:

**Whether newly realized capital gains should be reinvested into the Owner, or distributed to shareholders.**

This vote exists to answer a single economic question:

**Is capital retained by the Owner expected to compound more than capital distributed to shareholders now?**

When shareholders believe reinvestment will increase future total value, they vote to reinvest capital gains into the Owner.

When shareholders believe reinvestment no longer compounds meaningfully relative to distribution, they vote to distribute capital gains instead.

In this context:
- **Growth** refers to periods where reinvested capital is expected to compound future value.
- **Decay** refers to periods where reinvestment no longer offers meaningful compounding relative to distribution.

The vote does **not** evaluate intent, effort, lifestyle, or spending. It does not constrain the Owner’s actions.

It exists solely to determine whether new capital should continue compounding through the Owner, or be realized by shareholders.

This enables a natural, non-coercive transition from growth to decay based on economic expectations rather than moral judgment or control.

### Capital Routing

Voting is continuous. Each share always expresses one of two positions:
- **Reinvest**
- **Distribute**

Shareholders may change their vote at any time. Voting power is strictly proportional to share ownership (one share, one vote).

At the moment capital gains are realized:

- if more than 50% of outstanding shares vote **Reinvest**, the gains are reinvested into the Owner
- otherwise, the gains are distributed pro-rata to shareholders

The current voting state is evaluated only at the moment capital gains are realized, for the sole purpose of routing those gains.

### Voting Execution

This specification defines shareholder voting at the level of economic intent and outcome.

The canonical execution assumes that **share ownership state, voting state, and capital flows** are represented onchain. In this scenario, voting state is evaluated at the moment capital gains are realized, and routing is enforced mechanically.

For scenarios involving offchain assets, an appropriate execution mechanism will be defined to preserve the same economic behavior. The intent is to progressively bring assets onchain where feasible, particularly during onboarding, so that execution can converge on the onchain reference model.

## 8. How Shareholders Profit

Personal Token shareholders may profit in **two ways**:

### 1. Capital Gain Distributions:

When capital gains are realized by the Owner, shareholders determine whether those gains are reinvested or distributed. During periods of growth, gains are typically reinvested to compound future value. When reinvestment is no longer expected to compound meaningfully, gains may be distributed pro-rata to shareholders. Distributions may occur multiple times over the Owner’s lifetime and are not limited to terminal events.

### 2. Secondary Share Sales:

Shareholders may realize value by selling their shares to new approved participants. Transfers may occur through Owner-approved secondary sales or, where enabled, through designated liquidity pools. Pricing is determined through bilateral negotiation or the applicable liquidity mechanism. There is no public or permissionless market.

Shareholders do not receive income, wages, or guaranteed payouts. All returns are contingent on the Owner’s future value creation and the evolving assessment of that value by the network.

---

## 9. Safeguards

### Buybacks ("Divorcing Shareholders")

The Owner retains the unilateral right to repurchase shares from any Shareholder.

This power exists to protect the long-term health, integrity, and freedom of the Personal Token. It is intended as an **extraordinary safeguard**, not a routine mechanism.

In practice, the Owner expects to exercise this power rarely, and typically only in situations involving misalignment, harm, coercion, or behavior that materially undermines trust or reputation.

Safeguards:
- Buyback pricing must be fair-market or formula-based
- The rationale and execution must be public

This mechanism prioritizes the Owner’s freedom while relying on transparency and reputation to prevent abuse.

---

## 10. Transparency & Records

The following are public record:
- Cap table changes
- Share issuance rationale
- Approved secondary transfers
- Buybacks and justifications
- Votes on reinvestment vs. distribution

The system relies on long-term reputation rather than enforcement alone.

---

## 11. Termination & Death

### 11.1 Death of a Shareholder

Personal Token shares represent a permissioned relationship. Shareholder status is not inheritable. Upon the death of a Shareholder, their shares become subject to repurchase by the Owner. The deceased Shareholder’s estate is entitled to an economic settlement, but does not acquire shareholder status, voting rights, or transfer rights.

The Owner will seek to resolve settlement as soon as reasonably practicable. Payment may occur over time or upon future liquidity events, and is not required to be immediate. During any settlement period, the estate holds only a financial claim, not shares.

### 11.2 At Death of the Owner

- All remaining equity holdings are liquidated (over time if necessary)
- Net capital gains are distributed to shareholders
- The Personal Token is permanently closed

This ensures the instrument remains grounded in reality.

### 11.3 Voluntary Shutdown

- The Owner may stop issuing new shares
- Existing shareholder rights remain intact

## 12. Legal Notes

This section exists to clarify legal intent and boundaries. It is informational and non-exhaustive.

### 12.1 Nature of the Instrument

The Personal Token is a contractual instrument designed to grant holders a proportional right to participate in a defined pool of future capital gains generated by the Owner.

It does **not** confer:

- Ownership over the Owner as a person
- Rights to the Owner’s labor, time, or decision-making
- Any employment, partnership, or fiduciary relationship

### 12.2 Securities Posture

In substance, a Personal Token is expected to be treated as a **security in many jurisdictions**, given that it involves an investment with the expectation of upside tied to future value creation.

This instrument is **not designed to evade securities regulation**. Any real-world implementation is expected to comply with applicable securities laws, including registration, exemption, disclosure, and transfer restrictions as required by jurisdiction.

Final legal classification and compliance obligations depend on:

- Jurisdiction
- Issuance structure
- Eligible participants
- Transferability rules
- The legal form of the Token Entity

### 12.3 No Guarantees or Obligations

Holding a Personal Token carries no guarantee of returns. The Owner has no obligation to pursue any specific career path, investment strategy, or value-creation activity.

There is no promise of profit, liquidity, or appreciation.

### 12.4 Tax Treatment

Tax treatment of Personal Tokens and any associated gains is jurisdiction-dependent and may vary based on implementation. Tax consequences may arise at the level of the Owner, the Token Entity, or the Shareholders.

Participants are responsible for seeking independent tax and legal advice.

### 12.5 Jurisdictional Variability

This document is not jurisdiction-specific. Enforceability and legal interpretation of Personal Tokens are governed by applicable local laws.

### 12.6 Evolution

This specification reflects an early-stage instrument. While core economic promises are intended to be upheld, details of implementation and legal structure may evolve as the instrument is tested in the real world.