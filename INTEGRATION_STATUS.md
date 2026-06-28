# SYS EMPIRE — Integration Status & Production Checklist

> Last updated: 2026-06-27
> Stack: React 19 · TypeScript · TanStack Query · Zustand · Axios → `https://sysempire.onrender.com/api/v1` · Sonner

**Status legend:**
- ✅ DONE — fully integrated, production-ready
- 🔶 PARTIAL — page exists and works visually but some pieces are missing
- ❌ NOT DONE — mock/placeholder data or dead functionality, must be built before launch
- 🔲 STATIC — intentionally presentational, no API needed

---

## 1. AUTH FLOWS

| Page | Route | Status | What's Integrated | What's Missing |
|------|--------|--------|-------------------|----------------|
| Login | `/login` | ✅ DONE | `POST /auth/login` · Zustand user store · Sonner toasts · redirects to `/profile` | — |
| Sign Up | `/signup` | ✅ DONE | `POST /auth/register` with `{ firstName, lastName, email, phone, password, role: "client" }` · auto-login on token return | — |
| Forgot Password | `/forgot-password` | ✅ DONE | `POST /auth/forgot-password { email }` · sent-state UI · resend option | — |
| Reset Password | `/reset-password?token=` | ✅ DONE | `POST /auth/reset-password { token, password }` · reads token from URL · redirects to `/login` | — |
| Verify Email | `/verify-email?token=` | ✅ DONE | `POST /auth/verify-email { token }` · auto-fires on mount · `POST /auth/resend-verification` on failure | — |
| Terms of Service | `/terms` | ❌ NOT DONE | Route does not exist | Create static legal page — linked from signup |
| Privacy Policy | `/privacy` | ❌ NOT DONE | Route does not exist | Create static legal page — linked from signup |

---

## 2. HOME PAGE (`/`)

| Section | Status | What's Integrated | What's Missing |
|---------|--------|-------------------|----------------|
| Hero | 🔲 STATIC | Video + CTA links | — |
| Marquee | 🔲 STATIC | Scrolling brand text | — |
| Gender Clothes | 🔲 STATIC | Navigation cards | — |
| Three Ways to Order | 🔲 STATIC | Animated cards → correct routes | — |
| Founder | 🔲 STATIC | Presentational | — |
| Testimonials | 🔲 STATIC | Hardcoded quotes — acceptable for now | Could pull from API if reviews endpoint exists |
| Consultation / Appointments | ✅ DONE | `POST /appointments` · `GET /services` populates service dropdown · chevron selects · Sonner toasts | — |
| Feedback | ✅ DONE | `POST /contact` · Sonner toasts | Phone number `"08161525556"` is hardcoded in payload — remove or make user-provided |
| FAQ | 🔲 STATIC | Hardcoded Q&A — acceptable | — |

---

## 3. PRODUCT BROWSING

| Page | Route | Status | What's Integrated | What's Missing |
|------|--------|--------|-------------------|----------------|
| Wears / Category | `/wears/:name` | ❌ NOT DONE | Category hero and layout exist · products come from local `category-data.ts` file | Replace with `GET /api/v1/products?category=:slug` · product cards must link to real product IDs |
| Collections | `/collection` | 🔶 PARTIAL | Presentational layout done · `ApparelGrid` renders static images | Replace grid with `GET /api/v1/products` or `GET /api/v1/collections` |
| Product Details | `/product/:id` | ❌ NOT DONE | Add to Cart (localStorage) works · size/color selection works · gallery works | Product data comes from local `productsDatabase.ts` — replace with `GET /api/v1/products/:id` · Remove `console.log` debug calls |
| Similar Products | (component) | ❌ NOT DONE | Renders static items | Replace with `GET /api/v1/products?similar=:id` or similar endpoint |

---

## 4. CART & CHECKOUT

| Page | Route | Status | What's Integrated | What's Missing |
|------|--------|--------|-------------------|----------------|
| Cart / Order Tracking | `/cart` | ❌ NOT DONE | UI layout done (order tracking steps, status badges) | Entire order list is hardcoded mock data — replace with `GET /api/v1/orders` · "Write a Review", "View Details", "Need Help?", "Buy Again" buttons are all dead |
| Checkout | `/checkout` | ❌ NOT DONE | Multi-step form UI (personal info, shipping, payment) exists | Cart items are hardcoded mocks — must read from `useCart` localStorage · `POST /orders` API call not implemented · Uses `alert()` + `console.log` instead of Sonner + real API · Promo code is hardcoded `"WELCOME10"` — needs backend validation · Raw card fields collected but no payment gateway (Paystack / Flutterwave) wired up |
| Order Success | (missing) | ❌ NOT DONE | Route does not exist | Create `/order-success` or `/order/:id` confirmation page — shown after checkout completes |

---

## 5. CUSTOM WEAR FLOW (`/custom-wear`)

| Step | Status | What's Integrated | What's Missing |
|------|--------|-------------------|----------------|
| Step 1 — Outfit Type | 🔲 STATIC | Selections stored in local state | — |
| Step 2 — Inspiration | 🔲 STATIC | Image upload preview (not sent to backend) | Could `POST /media/upload` inspiration image |
| Step 3 — Fabric | 🔲 STATIC | Selections stored in local state | — |
| Step 4 — Customization | 🔲 STATIC | Selections stored in local state | — |
| Step 5 — Measurements | ✅ DONE | AI camera scan (MediaPipe) · manual entry · photo upload defaults · gender-aware formulas · saves to localStorage | `console.group` / `console.table` logs must be removed before production |
| Step 6 — Delivery | 🔲 STATIC | Date + delivery preference stored in local state | — |
| Step 7 — Review | 🔲 STATIC | Displays order summary from local state | — |
| Step 8 — Payment | ❌ NOT DONE | Payment method selection (full/deposit) UI exists | `onSubmit` only calls `console.log` — needs `POST /api/v1/custom-orders` (or equivalent) · No success/confirmation screen after submission · Price is hardcoded `₦250` — needs real pricing logic |

---

## 6. USER PROFILE (`/profile`)

| Tab | Status | What's Integrated | What's Missing |
|-----|--------|-------------------|----------------|
| Profile Info | ✅ DONE | Reads user from Zustand · `PATCH /auth/me { firstName, lastName, phone }` · `POST /auth/me/avatar` (multipart) · shows real avatar/initials · member-since date | — |
| Orders | ❌ NOT DONE | Layout done with status badges | Hardcoded mock orders (`#ORD-001` etc.) — replace with `GET /api/v1/orders` · "View Details" button is dead |
| Wishlist | ❌ NOT DONE | Layout done with items | Hardcoded mock items (Unsplash images, fake names) · "Add to Cart" button is dead · "Remove" (heart) button is dead · No `GET /api/v1/wishlist` call · No way to add items to wishlist from product pages |
| Addresses | ❌ NOT DONE | Layout done with address cards | Hardcoded NYC/LA fake addresses · "Edit" button is dead · "Set as Default" button is dead · "Add New Address" button is dead · No API for address CRUD |
| Take Measurement | ✅ DONE | AI camera scan · manual entry · gender toggle · saves to localStorage with date + gender metadata | `console.group` / `console.table` logs must be removed |
| Settings | ✅ DONE | `PATCH /auth/update-password { currentPassword, newPassword }` · `POST /auth/logout` · Zustand cleared on sign-out | — |

---

## 7. NAVIGATION & COMMON

| Component | Status | What's Integrated | What's Missing |
|-----------|--------|-------------------|----------------|
| Nav | ✅ DONE | Shows user initials or avatar when logged in · links to `/login` when not authenticated · cart count badge from localStorage | — |
| Cart Slide-out (in Nav) | ✅ DONE | Reads from `useCart` (localStorage) · add/remove/update quantity | Should read from `GET /api/v1/cart` if server-side cart is implemented |
| Footer | 🔲 STATIC | Links and brand info | `/shipping`, `/terms`, `/privacy`, `/returns` links point to non-existent routes |
| Not Found (`404`) | 🔶 PARTIAL | Page exists | "Back to Shop" link points to `/products` which doesn't exist — change to `/wears/new-arrivals` |

---

## 8. OTHER PAGES

| Page | Route | Status | What's Integrated | What's Missing |
|------|--------|--------|-------------------|----------------|
| About | `/about` | 🔲 STATIC | Fully presentational · no API needed | `console.error` on video autoplay can be removed |
| Contact Us | `/contact` | ✅ DONE | `POST /contact { firstName, lastName, email, phone, service, message }` · Sonner toasts | — |
| Lookbook | `/lookbook` | 🔲 STATIC | Memorial/editorial page · intentionally static | — |
| Birthday | `/birthday` | 🔲 STATIC | Memorial page · intentionally static | Name hardcoded in JSX — acceptable if permanent |
| We Are Back | `/we-are-back` | 🔲 STATIC | Store re-open announcement · intentionally static | Address + phone hardcoded in JSX |

---

## 9. GLOBAL CODE QUALITY (must fix before production)

| Issue | Where | Action |
|-------|-------|--------|
| `console.log` debug calls | `useCart.tsx` lines 33–37, 66, 84, 90 | Remove all |
| `console.log` debug calls | `product-details.tsx` lines 44–46, 55–56 | Remove all |
| `console.group` / `console.table` | `MeasurementTab.tsx`, `StepMeasurement.tsx` | Remove all |
| `console.warn` | `wears.tsx`, `StepMeasurement.tsx` | Remove all |
| `console.error` (video) | `about/VideoStory.tsx`, `home/Hero.tsx`, `home/AboutUs.tsx` | Remove or replace with silent error handling |
| `alert()` | `checkout.tsx` | Replace with Sonner toast |
| `console.log("Order submitted...")` | `custom-wear.tsx` line 224 | Replace with real API call |
| Hardcoded phone `"08161525556"` | `home/Feedback.tsx` line 20 | Remove — feedback doesn't need a phone field |
| Hardcoded promo `"WELCOME10"` | `checkout.tsx` | Replace with `POST /api/v1/promo/validate` |

---

## 10. MISSING ROUTES (links that lead to 404)

| Linked From | Broken Link | Fix |
|-------------|-------------|-----|
| Signup page | `/terms` | Create `/terms` page |
| Signup page | `/privacy` | Create `/privacy` page |
| Footer | `/shipping`, `/returns` | Create pages or remove links |
| Cart page | `/shop` | Change to `/wears/new-arrivals` |
| Checkout page | `/products` | Change to `/wears/new-arrivals` |
| Not Found page | `/products` | Change to `/wears/new-arrivals` |

---

## LAUNCH PRIORITY ORDER

### Must-have before any real user touches the app
1. ❌ Wire checkout to real `POST /orders` API — read from `useCart`, Sonner on success, navigate to `/order-success`
2. ❌ Replace `productsDatabase.ts` with `GET /api/v1/products/:id` in product details
3. ❌ Replace category local data with `GET /api/v1/products?category=:slug` in wears page
4. ❌ Replace order history mock in `/cart` with `GET /api/v1/orders`
5. ❌ Wire custom wear Step 8 to `POST /api/v1/custom-orders` + success page
6. ❌ Fix all broken nav links (404s listed above)
7. ❌ Remove all `console.log` / `alert()` from production code

### Should have (core profile completeness)
8. ❌ Wishlist — `GET/POST/DELETE /api/v1/wishlist`, wire heart button on product pages
9. ❌ Address book — `GET/POST/PATCH/DELETE /api/v1/addresses`
10. ❌ Order details — "View Details" per order linking to `/order/:id`
11. ❌ Payment gateway — Paystack or Flutterwave in checkout + custom wear

### Nice to have (polish)
12. ❌ Create `/terms` and `/privacy` static pages
13. ❌ Real promo code validation via API
14. ❌ Similar products from real API
15. ❌ Pull testimonials from API if endpoint exists
