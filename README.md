# Ecoyaan Checkout Flow

A multi-step checkout flow built with Next.js as part of a frontend engineering assignment.

## Tech Stack

- **Next.js** (Pages Router) with SSR
- **Tailwind CSS** for styling
- **React Context API** for state management
- **Next.js API Routes** as mock backend

## Flow

```
Cart → Shipping Address → Payment → Order Success
```

## Features

- Cart page loads data via `getServerSideProps` (SSR)
- Add/remove items and update quantity in cart
- Shipping form with validation (email, phone, PIN code)
- Payment confirmation screen with order summary
- Animated order success page

## Run Locally

```bash
# Clone the repo
git clone <your-repo-url>
cd ecoyaan-checkout

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

Deployed on Vercel: **<your-vercel-url>**
