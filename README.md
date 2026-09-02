# Glamour Jewellery — SPA Scaffold

A React + Tailwind e-commerce single-page app scaffold inspired by the general
structure of modern jewelry storefronts (announcement bar, slide-in nav, "shop
the look" hotspots, slide-over cart). All copy, imagery, and product data are
original placeholders — swap in real photography, copy, and a backend/CMS
before shipping.

## Stack

- **React 18** (Vite, functional components + hooks)
- **React Router v6** for SPA routing (`/`, `/collections/:slug`, `/products/:id`)
- **Tailwind CSS** for styling
- **Framer Motion** for the nav drawer, cart drawer, hero fades, and hotspot popup
- **Zustand** for lightweight global UI state (nav/search open state)
- **React Context + useReducer** for cart and wishlist state
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/       Reusable UI: header, drawers, hero, product card, footer...
  pages/             Home, Collection (filterable grid), ProductDetail
  context/           CartContext, WishlistContext
  store/             useUIStore (zustand) for nav/search open state
  data/              products.js — mock catalog + "Shop the Look" hotspot data
```

## Key features implemented

- Sticky header with search toggle, live search results, and cart badge
- Slide-in nav drawer with nested accordion categories
- Interactive "Shop the Look" hotspots that open a floating product popup
- Filterable/sortable collection grid (availability, price range, gold color)
- Product detail page with gallery, variant selectors, and accordion tabs
- Slide-over cart drawer with quantity controls and a free-shipping progress bar
- Mobile-collapsible footer accordions, newsletter form, payment badges
- Fixed WhatsApp / call floating action buttons

## Extending this scaffold

- Wire `data/products.js` up to a real product API or headless commerce backend
- Replace Unsplash placeholder imagery with real product photography
- Add a checkout flow (the "Proceed to Checkout" button is currently a stub)
- Add persisted cart/wishlist state (e.g. localStorage or a backend) if needed
- Add real authentication if you need accounts, order history, etc.
