# Feedback — pixel spec

Loading, Progress, Skeleton and BackTop communicate system state with semantic tokens and Lucide icons.

## EmptyState

- Use for a completed request with no content, such as no results or an empty collection; do not use it for loading or failed requests.
- Root is a labelled `section`; `title` defaults to `No data`, while `description` and `action` are optional.
- The default Inbox icon is neutral and decorative (`aria-hidden`); a custom icon should reinforce the message without being the only source of meaning.
- Sizes are `small`, `middle` (default) and `large`. The action slot accepts a Button, link or another platform-appropriate recovery action.
- Keep the message concise and explain the next step when one exists. Product-specific wallet copy belongs in the examples entry.
- The design-system demo shows no-results, create-entry, no-action and narrow-container wrapping scenarios. Use the size selector to review `small`, `middle` and `large`; keep empty and error examples as separate pages even though their anatomy is similar.

## ErrorState

- Use for a recoverable failure or unavailable result; do not use it for an empty collection or a loading request.
- Root exposes `role="alert"`; `title` defaults to `Something went wrong`, while `description` explains the failure or recovery path.
- The default CircleAlert icon uses failure semantics and is decorative; the message and action must carry the meaning.
- Sizes are `small`, `middle` (default) and `large`. The action slot is intended for retry, back or support actions.
- Do not expose raw provider errors as the only copy. Keep the message actionable and preserve the user's entered data when retrying.
- The design-system demo shows network failure, session recovery, no-action and narrow-container scenarios. Use the size selector to review all three sizes; keep `role="alert"` and failure semantics distinct from `EmptyState`.

## Loading

- Inline status container with 48px minimum height, 16px padding and 8px gap.
- Lucide `LoaderCircle`: 32px, stroke 2.25, primary color, 0.85s linear rotation.
- Label: 14px/500 using secondary text. Root exposes `role="status"` and `aria-live="polite"`.
- `active={false}` renders nothing. Reduced-motion mode slows the rotation.

## Progress

- Sizes: small 12px, middle 20px, large 28px; all tracks use a full pill radius.
- Track: `--Fresnica-surface-high`, semantic 1px border and no shadow.
- Fill: static primary-to-primary-hover gradient with no decorative texture.
- Fill width transition defaults to 0.6s; `duration={0}` and reduced-motion mode disable it.
- Inside text uses `--Fresnica-on-primary-color`; when progress is below 18%, information moves onto the track for legibility.
- Root exposes progressbar value attributes and a text equivalent.

## Skeleton

- Base surfaces use `--Fresnica-surface-high` and `--Fresnica-surface-highest`.
- Variants: text, circle, rectangle and paragraph. Text/lines use the 8px small-radius token and rectangles use the 16px base-radius token.
- Active shimmer mixes a restrained amount of the primary token into a transparent sweep over 1.6s.
- Paragraph rows use the 12px spacing token; the final row defaults to 60% width.
- Placeholder content is hidden from assistive technology.

## BackTop

- Fixed button: 44 by 44px, the 16px base-radius token, primary background, white foreground, subtle border and no shadow.
- Uses Lucide `ArrowUp` at 22px with stroke 2.25.
- Desktop offset: right 32px, bottom 48px. Mobile offset: right 16px, bottom 24px.
- Appears after the configured scroll threshold, supports Enter/Space, and uses the semantic focus ring.
- Scroll animation defaults to 300ms with ease-in-out quadratic interpolation.

## Notification density

`Notification` supports `variant="compact"` for short confirmations such as address-copied feedback. Compact notifications default to a simpler layout; use `closable` when manual dismissal is required.
