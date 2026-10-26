# Fresnica website pre-release fact audit — 2026-10-26

## Scope

This audit covers the deployed Fresnica website preview in `public/fresnica-website-preview/index.html`.
It checks product-positioning claims, release/download status, security language, legal/contact placeholders, and legacy-route behavior.
The visual baseline remains **Geometric Light V2.4**.

## Approved / grounded positioning

The current preview is aligned with the agreed product direction:

- Fresnica is presented as a wallet focused on the **Stellar** ecosystem, not a multi-chain wallet.
- The product direction covers **XLM**, supported Stellar-issued assets, payments/send & receive, swaps, and compatible Stellar apps.
- iOS and Android are described as **planned**.
- The product is clearly labeled **In development**.
- The website is informational only; wallet activities are described as taking place in the mobile app.
- Product UI shown on the website is identified as illustrative/demo content.

## Claims intentionally not made

The preview does not claim any of the following without verification:

- non-custodial / self-custody status;
- encryption or key-storage implementation details;
- open-source status;
- current App Store or Google Play availability;
- a confirmed release date;
- formal Stellar endorsement or partnership;
- verified contact/community channels;
- published Privacy Policy or Terms of Service.

## Download guardrails

- No active App Store, Google Play, or other official distribution URL is present.
- iOS and Android are marked as not yet available.
- The Download section states that verified distribution links will be added only after confirmation.
- FAQ item 4 was tightened in this audit to answer the current state directly: **Fresnica is not available for download yet.**

## Security-language guardrails

The website currently limits security copy to review-oriented guidance:

- review payment details;
- understand app requests;
- use verified downloads only;
- do not enter secret recovery information on a download website.

Specific key-management, recovery, custody, and security-control implementation details remain deferred until verified product/security documentation exists.

## Legal and contact status

The footer and Help section deliberately state that verified official channels and policies will appear when available.
No placeholder email address, social account, Privacy Policy URL, or Terms URL is presented as active.

## Legacy-route behavior

Legacy hash routes are normalized into the current one-page website:

- `#features`
- `#download`
- `#about`
- `#help`
- `#help/security`
- Chinese equivalents under `#zh/...`

Old multi-page prototype content is not rendered by the current `render()` path.

## Release-blocking facts still pending

Before a real public release, the following must be supplied and independently verified:

1. official iOS distribution URL;
2. official Android distribution URL;
3. confirmed release timing/status;
4. Privacy Policy;
5. Terms of Service, if required for the release;
6. verified project contact/community channels;
7. approved product-security wording for key management/recovery/custody controls;
8. any formal Stellar partnership or endorsement statement, only if applicable.

Until those facts exist, the current pre-release wording should remain in place.
