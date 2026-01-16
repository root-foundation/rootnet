---
title: personal token issuance & compliance (US, v0.1)
toc: true
---

## Scope

This document describes the practical steps and considerations involved in issuing a personal token in the United States.

It is written to be readable end-to-end by non-lawyers, using plain language and concrete descriptions, while remaining precise enough for experienced legal practitioners to evaluate and adapt.

This document focuses on **minimum viable compliance**: the simplest legally defensible way to issue a personal token today under U.S. law.

### What this document is

- A practical orientation to the regulatory reality of issuing a personal token in the U.S.
- A bridge between the Personal Token Specification, the Legal Instrument, and real-world legal execution.
- A description of common structures, tradeoffs, and sources of friction.

### What this document is not

- Legal advice.
- A guarantee of compliance.
- Jurisdiction-agnostic.
- A substitute for working with qualified legal counsel.

Nothing in this document should be relied on as a complete or sufficient basis for issuing securities without professional advice.

---

## Assumptions and Constraints

This document assumes the following baseline conditions:

- The token owner is a natural person.
- The personal token is issued in the United States.
- Participants are known in advance and limited in number.
- Consideration is primarily cash or cash equivalents.
- The personal token is treated as a security.

If these assumptions do not hold, the analysis and pathways described here may not apply.

---

## What It Means to Issue a Personal Token

Issuing a personal token is not a conceptual act. It is a legal one.

From a regulatory perspective, issuing a personal token involves:

- Creating a legal instrument that defines economic rights and obligations.
- Selling or issuing securities to other parties.
- Accepting money or other consideration in exchange for those securities.
- Creating ongoing disclosure and compliance obligations.

In U.S. law, selling a security is a regulated activity by default. The fact that the security represents participation in a person’s future upside, rather than a company’s equity, does not change this.

As a result, issuing a personal token requires either:

- Registering the offering with the U.S. Securities and Exchange Commission (SEC), or
- Qualifying for an exemption from registration.

For early-stage personal tokens, registration is generally impractical. This document therefore focuses on exemption-based issuance.

---

## Regulatory Strategy

Under U.S. law, the sale of securities must either be registered with the SEC or qualify for an exemption from registration.

For personal tokens at an early stage, registration is typically impractical. It is expensive, slow, and designed for large public offerings. As a result, most viable paths rely on **exemptions** that allow securities to be sold without full registration, subject to specific conditions.

The practical question is therefore not whether regulation applies, but which exemption framework best fits the intended issuance.

At a high level, exemption-based strategies generally involve:

- Limiting who can participate in the offering.
- Restricting how the offering is marketed.
- Making specific disclosures to participants.
- Filing limited notices with regulators after issuance.

These constraints are not incidental. They shape how personal tokens can be issued, how many people can participate, and how issuance evolves over time.

---

## Likely Exemptions for v0

For an initial personal token issuance involving a small number of known participants, the most commonly relevant exemptions fall under **Regulation D**.

Regulation D provides several safe harbors that allow private placements of securities without SEC registration, provided certain conditions are met.

In practice, early personal token issuances most often resemble one of the following:

- **Rule 506(b)**: Allows sales to a limited number of non-accredited investors and accredited investors, with strict limits on general solicitation.
- **Rule 506(c)**: Allows general solicitation, but limits participation to accredited investors only and requires verification of accredited status.

Which path is appropriate depends on:

- Who the participants are.
- Whether any public marketing occurs.
- The issuer’s tolerance for verification and disclosure overhead.

This document does not recommend a specific exemption. It describes common patterns so that tradeoffs are visible.

Public offerings, crowdfunding exemptions, and retail-facing issuance models are out of scope for v0.

---

## Document Stack

Issuing a personal token typically involves more than a single document.

At a minimum, the document stack usually includes:

- The **Personal Token Legal Instrument**, which defines economic rights and obligations.
- A **purchase or subscription agreement**, under which participants acquire shares.
- **Representations and warranties** by participants regarding eligibility, understanding of risk, and intent.
- **Risk disclosures**, acknowledging the speculative nature of the instrument.
- **Acknowledgements** related to transfer restrictions and lack of liquidity.

These documents work together. The legal instrument defines the asset. The surrounding agreements govern the act of issuance.

---

## Filings and Notices

Even when relying on an exemption, most private placements require limited regulatory filings.

Common examples include:

- **Form D** filings with the SEC, typically made after the first sale of securities.
- State-level “blue sky” notices, depending on where participants are located.

These filings are generally notice-based rather than approval-based. They do not require the SEC to review or endorse the offering.

Timing and requirements vary, and failure to file required notices can create compliance risk even if an exemption otherwise applies.

---

## Fees and Friction

Issuing a personal token carries real costs, even at a small scale.

Common sources of friction include:

- Legal fees for structuring, drafting, and review.
- Filing fees associated with regulatory notices.
- Time spent coordinating documentation, disclosures, and signatures.

Costs vary widely based on jurisdiction, counsel, and complexity. This document intentionally avoids specific dollar estimates.

The important point is behavioral: compliance costs influence how often issuance occurs and how it is structured.

---

## Rolling vs. Discrete Issuance

From a legal perspective, issuing shares on a rolling basis is often possible.

From a practical perspective, repeated issuances can compound friction:

- Each issuance may trigger additional disclosures or filings.
- Legal review may be required repeatedly.
- Administrative overhead grows over time.

As a result, many issuers choose to batch issuances into informal “rounds,” even when not legally required.

This document does not prescribe an approach. It surfaces the tradeoff so that behavior emerges from reality rather than assumption.

---

## Ongoing Compliance

Issuance creates ongoing obligations.

At a minimum, token owners should expect to:

- Maintain accurate records of issuances, ownership, and transfers.
- Comply with disclosure obligations defined in the Legal Instrument.
- Update agreements or disclosures when material facts change.

Compliance is not a one-time event. It is a continuing cost of operating the instrument.

---

## Tax Considerations

The tax treatment of personal tokens is highly jurisdiction- and fact-dependent.

Relevant considerations may include:

- Taxation of proceeds received by the token owner.
- Tax treatment of distributions to shareholders.
- Timing differences between realization and taxation.

This document does not attempt to analyze tax outcomes. Participants are responsible for obtaining appropriate tax advice.

---

## What This Document Does Not Cover

This document intentionally does not address:

- Non-U.S. jurisdictions.
- Technical or onchain execution.
- Custody or asset management.
- Secondary market infrastructure.
- Liquidity systems or trading venues.

These topics may be addressed in future documents as the system evolves.
