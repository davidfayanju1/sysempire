# Personal Fit (Custom Wear) Flow

The Personal Fit flow is the 8-step bespoke order journey at **`/custom-wear`**. A client picks an outfit type, shares inspiration, chooses how fabric is handled, customises the garment, provides measurements, sets a delivery timeline, reviews, and pays a deposit or the full amount through Flutterwave.

## Entry points

- Nav link **PERSONAL FIT** → `/custom-wear` ([Nav.tsx](../src/components/common/Nav.tsx))
- Home page "Three Ways to Order" card → `/custom-wear` ([ThreeWaysToOrder.tsx](../src/components/home/ThreeWaysToOrder.tsx))

## Files

| Concern | File |
| --- | --- |
| Page, state, step routing, progress persistence | [src/pages/custom-wear.tsx](../src/pages/custom-wear.tsx) |
| Step labels (trail + resume toast) | [src/lib/customWearSteps.ts](../src/lib/customWearSteps.ts) |
| Hero / step trail | [Hero.tsx](../src/components/custom-wear/Hero.tsx), [StepTrail.tsx](../src/components/custom-wear/StepTrail.tsx) |
| Step 1 – Outfit Type | [StepOutfitType.tsx](../src/components/custom-wear/StepOutfitType.tsx) |
| Step 2 – Inspiration | [StepInspiration.tsx](../src/components/custom-wear/StepInspiration.tsx), [style-inspiration](../src/lib/style-inspiration.tsx) |
| Step 3 – Fabric | [StepFabric.tsx](../src/components/custom-wear/StepFabric.tsx) |
| Step 4 – Details (customisation) | [StepCustomization.tsx](../src/components/custom-wear/StepCustomization.tsx) with [OptionSection](../src/components/custom-wear/OptionSection.tsx), [OptionCard](../src/components/custom-wear/OptionCard.tsx), [SwatchGroup](../src/components/custom-wear/SwatchGroup.tsx), [GarmentSummary](../src/components/custom-wear/GarmentSummary.tsx), [MobileSummary](../src/components/custom-wear/MobileSummary.tsx) |
| Step 4 field definitions and rules | [customizationFields.ts](../src/lib/customizationFields.ts) |
| Sketch lookup and artwork pipeline | [sketchRegistry.ts](../src/lib/sketchRegistry.ts), [build-sketches.mjs](../scripts/build-sketches.mjs), [assets/sketches](../src/assets/sketches/README.md) |
| Step 5 – Measurements | [StepMeasurement.tsx](../src/components/custom-wear/StepMeasurement.tsx), [BodyScanCapture.tsx](../src/components/measurement/BodyScanCapture.tsx), [bodyMeasurement.ts](../src/lib/bodyMeasurement.ts), [CroquisGuide.tsx](../src/components/measurement/CroquisGuide.tsx), [measurementGuides.ts](../src/lib/measurementGuides.ts) |
| Step 6 – Delivery | [StepDelivery.tsx](../src/components/custom-wear/StepDelivery.tsx) |
| Step 7 – Review | [StepReview.tsx](../src/components/custom-wear/StepReview.tsx) |
| Step 8 – Payment, order payload | [StepPayment.tsx](../src/components/custom-wear/StepPayment.tsx) |
| Pricing (shared by Steps 4 and 8) | [pricing.ts](../src/lib/pricing.ts), [outfitTypes.ts](../src/lib/outfitTypes.ts) (base prices) |
| API calls | [src/services/index.tsx](../src/services/index.tsx) (`uploadMedia`, `createOrder`, `initiateFlutterwavePayment`) |
| Payment return | [payment-success.tsx](../src/pages/payment-success.tsx), [payment-failure.tsx](../src/pages/payment-failure.tsx) |
| Target structured API contract (not yet sent) | [src/types/custom-order.ts](../src/types/custom-order.ts) |

## Overview

```mermaid
flowchart TD
  A[1. Outfit Type] --> B[2. Inspiration]
  B --> C[3. Fabric]
  C --> D[4. Details]
  D --> E[5. Measurements]
  E -->|camera + guest| E2[Save measurements? modal]
  E --> F[6. Delivery]
  E2 --> F
  F --> G[7. Review]
  G --> H[8. Payment]
  H -->|POST /orders| I[Order created]
  I -->|POST /payments/flutterwave/initiate| J[Redirect to Flutterwave]
  J -->|returnUrl| K[/payment/success]
  K -->|GET /payments/flutterwave/verify| L{Verified?}
  L -->|yes| M[/orders or /login?returnTo=/orders]
  L -->|no| N[Home after 5s]
```

## Page state and orchestration

`CustomWear` in `pages/custom-wear.tsx` owns two pieces of state:

- `step` (1–8). Only one step component is mounted at a time.
- `orderData: OrderData`. Each step reports its result through `onNext(...)`, and the page merges it in with `updateOrderData` before calling `goToNextStep()`.

```ts
interface OrderData {
  outfitType: string | null;                                  // Step 1
  hasInspiration: boolean | null;                             // Step 2
  inspirationImages?: string[];
  inspirationDescription?: string;
  fabricOption: "have-fabric" | "source-fabric" | "not-sure" | null; // Step 3
  fabricDetails?: FabricDetails;
  fabricPreferences?: FabricPreferences;
  customizations: Record<string, string>;                     // Step 4
  wearer?: "men" | "women";
  measurements: Measurement[] | null;                         // Step 5
  measurementMethod: "camera" | "upload" | "manual" | null;
  measurementPhotos?: string[];
  eventDate?: string;                                         // Step 6
  deliveryPreference?: "pickup" | "delivery";
  isExpress?: boolean;
  shippingAddress?: { street; city; state; country; postalCode? };
  paymentMethod?: "full" | "deposit";                         // Step 8
}
```

Navigation behaviour:

- Moving forward or back smooth-scrolls to the step container, 100px below the top.
- A step's internal sub-screens (e.g. "Back to options") don't change `step`. Only the step's own Back button calls `goToPreviousStep()`.

### Progress persistence

- **Key:** `localStorage["customWearProgress"]`, holding `{ step, orderData, savedAt }`.
- **When saved:** on every change to `step` or `orderData`.
- **TTL:** 24 hours. Older progress is discarded on load.
- **On load:** the saved step and data are restored. If the saved step is past 1, a toast shows: *"Welcome back. You're picking up at Step N of 8: <Label>."*
- **Cleared:** only when the order is placed successfully, just before the redirect to Flutterwave.
- **Caveat:** a step component's own local state (e.g. half-filled fields) is not persisted. Only the values already submitted to `orderData` survive a reload.

Step labels: `Outfit Type, Inspiration, Fabric, Details, Measurements, Delivery, Review, Payment`.

---

## Step 1 – Outfit Type

Clicking a card immediately calls `onNext(id)` and sets `outfitType`. There is no separate Continue button. Picking a **different** type clears `customizations` and `wearer`, since the old answers no longer apply.

| id | Name | Examples | Base price (₦) |
| --- | --- | --- | --- |
| `native-wear` | Native Wear | Agbada, Kaftan, Dashiki, Buba, Iro ati Buba | 85,000 |
| `corporate` | Corporate Wear | Suits, Blazers, Corporate Dresses | 70,000 |
| `dresses` | Dresses | Evening, Cocktail, Day | 60,000 |
| `suits` | Suits | Two-piece, Three-piece, Tuxedos | 75,000 |
| `casual` | Casual Wear | Everyday, Weekend | 45,000 |
| `wedding` | Wedding Wear | Bridesmaids, Groom, Mother of the bride/groom | 120,000 |
| `uniforms` | Uniforms | Corporate, School, Team | 40,000 |
| `other` | Something Else | Free-form | 65,000 |

## Step 2 – Inspiration

The client picks one of three methods:

| Method | Input | Continue enabled when | Result sent to `onNext` |
| --- | --- | --- | --- |
| **Upload Image** | Up to **6** images. Previews are local data URLs. | at least 1 image | Each file goes through `uploadMedia()` (in parallel) → `onNext(true, cdnUrls)` |
| **Describe It** | Free text | text is not blank | `onNext(true, undefined, description)` |
| **Browse Styles** | Curated styles from `getBrowseStyles(outfitType)` | a style is selected | `onNext(true, [styleImageUrl])` |

- **Upload URLs:** read from `res.data.url ?? res.data.file.url ?? res.data.secure_url ?? res.data`.
- **Upload failure:** shows a toast and the client stays on the step.
- **Cancel / "Back to options":** returns to method selection.

> There is no "no inspiration" option, so `hasInspiration` is always `true` after this step. The Review screen's "Need inspiration" label can't currently appear.

## Step 3 – Fabric

The client picks one of three branches. Each maps to the stored `fabricOption` value.

### "I already have fabric" → `have-fabric`

- **Fabric Type** (required, free text).
- **Quantity Available** (free text, e.g. "2 yards").
- **Fabric photos** (optional). Each photo uploads immediately through `uploadMedia()` and can be previewed or removed.
- **Handover:** `pickup` (the default; SYS EMPIRE collects it) or `dropoff`.
  - Pickup needs a **pickup date**, no earlier than tomorrow.
  - Scheduled pickup is **Lagos only**.
- **Continue is disabled** until there's a type, plus a date if pickup is selected.
- **Result:** `onNext("have-fabric", fabricDetails)`.

### "Help me source fabric" → `source-fabric`

- **Colour count:** `single` or `multiple`. Switching to single keeps only the first colour.
- **Colours:** Black, White, Navy, Burgundy, Emerald, Gold, Silver, Other. Single mode replaces the choice; multiple mode toggles each colour.
- **Material:** cotton, linen, silk, wool, lace, ankara, other.
- **Quality:** `standard` (default) or `premium`.
- **Disclaimer:** sourced fabric is priced at market rate, and the stylist confirms before buying.
- **No required fields.** Continue is always enabled.
- **Result:** `onNext("source-fabric", undefined, fabricPreferences)`.

### "I'm not sure yet" → `not-sure`

This is an information screen: a stylist will reach out. **Result:** `onNext("not-sure")`.

## Step 4 – Details (customisation)

Every question is answered by picking a card. Each card carries a sketch of that
option, drawn as the tailor would cut it, and falls back to a
[TailoringIcon](../src/components/custom-wear/TailoringIcons.tsx) line glyph
until its artwork is delivered. Colour fields use swatches instead of sketches.
Picking an option shows its note underneath, and stores the exact label, e.g.
`{ fit: "Slim" }`.

Alongside the questions is a **live garment summary**: a preview sketch, every
answer so far, and a running price estimate from the same `calculatePrice()` the
final total uses, so the two can never disagree. It's a sticky panel on desktop
and a compact strip above the questions on mobile.

The field set, the order of questions and the rules live in
[customizationFields.ts](../src/lib/customizationFields.ts), not in the
component: so they can be tested without rendering.

### Who it's for

Every outfit type except dresses now asks **who the garment is for** before
anything else:

- `suits` asks `suitFor`: *Men's Tailoring* or *Women's Tailoring*.
- `dresses` skips the question and assumes womenswear.
- Everything else asks `wearer`: *Menswear* or *Womenswear*.

The answer is saved to `orderData.wearer`, which preselects the Step 5
measurement profile, appears on the Step 7 review card, and is written into the
order notes.

### Fields

**Common to every type:** `fit` = Regular | Slim | Relaxed | Tailored

| Outfit type | Fields after the wearer question (`name`: options) |
| --- | --- |
| `native-wear` | `fit` · `neckStyle`: Round, V-Neck, Mandarin, Traditional · `sleeveType`: Short, Long, 3/4, Sleeveless · `embroidery`: None, Minimal, Traditional, Premium · `trouserStyle`: Straight, Tapered, Flared, Drawstring · `capStyle` *(optional)*: None, Fila, Okpu Agu, Songhai, Kofia, Other |
| `dresses` | `fit` · `neckline`: Sweetheart, V-Neck, High Neck, Off-Shoulder, Halter · `sleeveType`: Sleeveless, Short, Long, Puff, Bell · `length`: Mini, Knee, Midi, Maxi · `silhouette`: A-Line, Sheath, Mermaid, Ball Gown, Empire |
| `corporate` | `fit` · `jacketStyle`: Single-Breasted, Double-Breasted · `skirtOrTrousers`: Skirt, Trousers, Both · `color` *(swatch)*: Black, Navy, Charcoal, Beige, Burgundy |
| `wedding` | `fit` · `role`: Bride, Groom, Bridesmaid, Groomsman, Mother, Guest · `formality`: Formal, Semi-Formal, Casual · `colorScheme` *(swatch)*: White/Ivory, Pastel, Bold, Traditional |
| `suits` | See below |
| `casual`, `uniforms`, `other` | `fit` only |

### Suits

Suits show **only** the `suitFor` question until it is answered; the rest appear
once the tailoring is known. Changing `suitFor` clears `composition`,
`lapelStyle`, `buttons`, `vents`, `pockets` and `silhouette`, since their option
values differ between the two sets.

| Field | Men's options | Women's options |
| --- | --- | --- |
| `composition` | Blazer Only, Two-Piece, Three-Piece, Tuxedo | Blazer Only, Pantsuit, Skirt Suit, Three-Piece |
| `silhouette` |: | Fitted Waist, Boxy, Peplum, Cropped |
| `lapelStyle` | Notch, Peak, Shawl | Notch, Peak, Shawl, Collarless |
| `buttons` | Two-Button, Three-Button, Double-Breasted | Single-Breasted, Double-Breasted, Open Front |
| `vents` | Single Vent, Double Vent, No Vent |: |
| `pockets` | Flap, Jetted, Patch, Ticket | Flap, Jetted, Patch, No Pockets |

**Validation:** Continue unlocks when every field without `required: false` has a
value. `capStyle` is the only optional field, and tapping its chosen option again
clears it. Answers to fields that are no longer shown are dropped before the step
hands over, so a stale value can never reach the order.

**Result:** `onNext(customizations, wearer)`.

## Step 5 – Measurements

### 5.0 Profile

The client chooses **Female** or **Male**, which sets which fields are measured. When Step 4 recorded a wearer, that choice is **preselected** and this screen is skipped: the method screen's *Change* link goes back to it. The profile is still local to the step and is not sent to the API; `orderData.wearer` is what travels with the order.

| Group | Female fields (* = required) | Male fields (* = required) |
| --- | --- | --- |
| General | Height* | Height* |
| Top | Bust*, Under Bust*, Shoulder Width*, Arm Length*, Wrist | Chest*, Shoulder Width*, Sleeve Length*, Neck, Shirt / Buba Length, Wrist |
| Bottom | Waist*, Hips*, Thigh, Calf, Dress Length | Waist*, Hips*, Thigh, Inseam |

Each measurement is stored as `{ name, value, unit, description }`.

### 5.1 Method

There are three methods. The method selection screen shows "<gender> profile · N measurements" and a **Change** link back to 5.0.

#### Camera (`camera`): "Most accurate"

This opens `BodyScanCapture`, a full-screen guided scan using MediaPipe `PoseLandmarker` and `ImageSegmenter` (deeplab_v3):

1. **front:** the camera starts with a standing-guide overlay and framing/pose-quality checks. The client **raises a hand above shoulder level** to capture. Height and front widths come from the pose landmarks.
2. **side-prompt:** the client turns sideways, or skips the side scan.
3. **side:** the client captures again. Person segmentation measures body depth at the chest, waist and hips.
4. **processing → results:** `buildMeasurements(frontGeometry, sideDepths, gender)` combines width and depth into circumferences. If the side scan fails or is skipped, it falls back to a front-only estimate.
5. **Save:** `onNext(measurements, "camera")`.

If the client is **not signed in**, the page shows a **"Save these measurements?"** modal after this step: *Sign In* (→ `/login`) or *Continue as Guest*. Progress is already saved to local storage, so signing in doesn't repeat steps.

#### Upload photos (`upload`): "Estimated, our team verifies by email"

- The client selects **Front** and **Side** photos. Both are required.
- **On confirm:**
  - Both photos upload through `uploadMedia()`.
  - Every field is filled with **fixed gender defaults in cm**, not values derived from the photos. For example, female defaults include Height 163, Bust 88 and Waist 70; male defaults include Height 172, Chest 97 and Waist 84.
  - A toast explains that the team will review the photos.
  - `onNext(measurements, "upload", [frontUrl, sideUrl])`.

#### Manual (`manual`): "Recommended if measured by a tailor"

- A form grouped General / Top / Bottom, with a **cm / inches** toggle. Switching units converts any values already entered.
- Beside the form is a **croquis figure** ([CroquisGuide](../src/components/measurement/CroquisGuide.tsx)) with a numbered line for each measurement. Focusing a field highlights its line and shows how to take that measurement. Coordinates are placeholders until the croquis artwork lands.
- The browser's `required` attribute enforces the required fields.
- **Empty optional fields are sent as `0`.**
- **Result:** `onNext(measurements, "manual")`.

## Step 6 – Delivery

- **Event date** (required). It is a plain date input with no minimum date.
- **Delivery preference:**
  - **Deliver to me** (default): needs street, city and state. Country defaults to Nigeria; postal code is optional.
  - **Pick up from studio:** shows the studio address and phone from `pages/contact-us`.
- **Express Tailoring** toggle:
  - Express: 7–10 business days.
  - Standard: 14–21 business days.
- **Continue is disabled** until there's an event date, plus a complete address if delivery is selected.
- **Result:** `onNext(eventDate, deliveryPreference, isExpress, deliveryPreference === "delivery" ? address : undefined)`.

## Step 7 – Review

This is a read-only summary in cards:

- **Outfit type.**
- **Inspiration:** text and a thumbnail gallery.
- **Fabric:** option, type, pickup date note, colours and fabric photos.
- **Customisations:** each camelCase key shown as words.
- **Measurements:**
  - Method label.
  - Upload photos with an "estimated starting point" note.
  - The **first 6** measurements, each also converted to the other unit.
- **Timeline / delivery.**

Images open in a lightbox. **Result:** `onNext()` → Step 8.

> Every card's **Edit** button calls `onBack`, so it only returns to Step 6, not to the step the card describes.

## Step 8 – Payment

### Contact details

The client enters **name, email and phone**, all required. They are prefilled from `authStore.user` when signed in. If any are blank, the mutation throws *"Please fill in your contact details."*

### Pricing (`calculatePrice`)

All amounts are client-side estimates in ₦.

| Line | Rule |
| --- | --- |
| Base | `BASE_PRICES[outfitType]` (see Step 1). Unknown types cost 65,000. |
| Fabric fee | `source-fabric` + premium quality: 35,000 · `source-fabric` + standard quality: 15,000 · `not-sure`: 15,000 · `have-fabric`: 0 |
| Embroidery | None 0 · Minimal 8,000 · Traditional 15,000 · Premium 25,000 |
| Wedding role | Bride 30,000 · Groom 10,000 · other roles 0 |
| Wedding formality | Formal: 20,000 |
| Corporate bottoms | `skirtOrTrousers === "Both"`: 15,000 |
| Double-breasted | `buttons` or `jacketStyle` is "Double-Breasted": 5,000 |
| **Subtotal** | sum of the lines above |
| Express | `isExpress`: `round(subtotal × 0.30)` |
| Delivery | `deliveryPreference === "delivery"`: 5,000 |
| **Total** | subtotal + express + delivery |

**Payment plan:**

- **Deposit (70%)**, the default: `round(total × 0.7)` is charged now, with the balance due before delivery.
- **Pay in Full:** the total is charged now.

The UI notes that the final price is confirmed after the stylist consultation.

### Placing the order

When the client clicks **Complete Order**, the `placeOrder` mutation runs these steps.

**1. Build the payload**

- `measurementsObj`: measurements flattened into a map like `{ "Bust": "88cm", ... }`.
- `primaryColor`: `fabricPreferences.colors[0]`, else `customizations.color`, else `"custom"`.
- `shippingAddress`:
  - Delivery: the address collected in Step 6.
  - Pickup: a studio placeholder, `{ street: "Studio Pickup", city: "Lagos", state: "Lagos", country: "Nigeria" }`.
- `chargeAmount`: the deposit or the full total, depending on the plan.

**2. `POST /orders`** via `createOrder(payload: CreateOrderPayload)`:

```jsonc
{
  "items": [{
    "product": "<outfitType>",
    "quantity": 1,
    "size": "custom",
    "color": "<primaryColor>",
    "price": <estimated total>,
    "measurements": { "Bust": "88cm", ... }
  }],
  "shippingAddress": { ... },
  "billingAddress": { ...same as shipping },
  "shippingFee": 0, "tax": 0, "discount": 0,
  "totalAmount": <chargeAmount>,
  "shippingMethod": "express" | "standard",
  "paymentMethod": "flutterwave",
  "guestName": "...", "guestEmail": "...", "guestPhone": "...",
  "notes": "<buildOrderNotes()>"
}
```

- **Order id:** read from `res.data._id ?? res.data.id`. If neither is present, the mutation throws "Order creation failed".

**3. `POST /payments/flutterwave/initiate`** via `initiateFlutterwavePayment(orderId, chargeAmount)`:

- **Body:** `{ orderId, amount, returnUrl: "<VITE_APP_URL or origin>/payment/success" }`.
- **Header:** `Idempotency-Key: crypto.randomUUID()`.
- **Link:** read from `data.paymentLink ?? link ?? url ?? payment_link`. If none is present, the mutation throws.

**4. On success:**

- `onSubmit(plan)` stores `paymentMethod` and **clears the saved progress**.
- `window.location.href = paymentLink` sends the client to Flutterwave.

**5. On error:** a toast shows `getApiErrorMessage(err)`, and the client stays on Step 8.

### `notes` field (`buildOrderNotes`)

Everything outside the commerce fields travels to the backend as one human-readable `notes` string:

```
=== BESPOKE ORDER ===
Outfit Type: suits
Inspiration (text): ...
Inspiration (image 1/2): https://...
Wearer: Menswear
Fabric Option: have-fabric
Fabric Type: Aso-oke
Fabric Quantity: 5 yards
Fabric Handover: pickup
Preferred Pickup Day: 2026-09-20 (Lagos only: final quote and pickup details confirmed via email after order processing)
Preferred Colors: Navy, Gold
Preferred Material: silk
Fabric Quality: premium
Customizations: {"suitFor":"Men's Tailoring","fit":"Slim",...}
Measurement Method: upload
Measurement photos: estimates applied, verify before cutting:
  Front: https://...
  Side: https://...
Event Date: 2026-10-01
Delivery: delivery (Express)
Payment Plan: deposit
```

`notes` leaves out:

- Fabric photos.
- `occasion`, `budget` and `colorCount` (collected in state but not in the UI).
- Measurement units beyond the flattened map.
- The price breakdown.

## After payment

Flutterwave redirects to `returnUrl` → **`/payment/success`** (`PaymentSuccess`):

1. **Read the query:** `transaction_id`, `tx_ref` and `status`. If either ID is missing, it shows "Invalid payment response" and redirects home.
2. **Verify:** `GET /payments/flutterwave/verify?transaction_id&tx_ref&status`.
3. **Success:** a toast shows, then after 3s:
   - Signed-in clients go to `/orders`.
   - Guests go to `/login?returnTo=/orders`.
4. **Failure:** an error message shows, then after 5s the client goes to `/`.

`/payment/failed` (`PaymentFailed`) shows an error toast and redirects to **`/checkout`** after 5s.

---

## Known gaps and quirks

1. **`/orders` has no route.** After a verified payment, clients are sent to `/orders`, which currently renders the Not Found page. Order history lives under `/profile`.
2. **The failure page sends clients to the cart checkout** (`/checkout`), not back to `/custom-wear`. By then the Personal Fit progress has already been cleared.
3. **`/payment/success` is declared twice** in `App.tsx` (`PaymentSuccess` and `OrderConfirmation`).
4. **Structured contract not in use.** `types/custom-order.ts` defines `CreateCustomOrderPayload`, a full structured body with `priceBreakdown`, `paymentPlan`, `balanceDue`, `measurementsAreEstimates` and more. The flow still sends the flattened `CreateOrderPayload` plus the `notes` string.
5. **Estimates aren't flagged.** Photo-upload measurements are fixed defaults, not derived from the photos. The only signal is the text in `notes`.
6. **Pricing is only client-side.** `totalAmount` and `price` come from the browser, and no breakdown is sent for the server to verify.
7. ~~**Profile gender isn't saved.**~~ Closed: Step 4 records `wearer`, which preselects the Step 5 profile and travels with the order.
8. **Review Edit buttons** all go back just one step, to Step 6.
9. **Inspiration always reads "I have a design in mind"** because the step has no skip option.
10. **Manual entry sends `0`** for blank optional measurements.
11. **Event date has no minimum**, so past dates are accepted.
12. **Debug logs:** `StepPayment` logs the full order data and payload with `console.log`.
