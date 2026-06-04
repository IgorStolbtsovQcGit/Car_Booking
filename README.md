# Car_Booking

# Booking.com Car Rental — Playwright Automation

End-to-end test for the car rental flow on [booking.com/cars](https://www.booking.com/cars/index.html), written in TypeScript + Playwright.

## What the test covers

1. Opens the car rental page and accepts cookies
2. Searches for a car pickup in **New York**
3. Selects pickup date: 2026 June 20 and return date: 2026 June 23
4. Sets pickup time 12:00 PM and drop-off time 09:00 AM
5. Filters results by supplier **Budget**
6. Opens the first available deal
7. Proceeds through the booking flow (extras → package → checkout)
8. Fills in driver details and billing address
9. Enters payment card data inside an iframe
10. Submits the checkout form

## Prerequisites

- Node.js - 24.13.1
- npm - 11.8.0

## Installation

git clone https://github.com/YOUR_USERNAME/booking-cars-playwright.git
cd booking-cars-playwright
npm install
npx playwright install chromium

## Run the test

npx playwright test

With verbose output:

npx playwright test --reporter=html

## Notes

- The test uses a fake card number (4111...) — no real payment is made
- `pressSequentially` with delays is used to mimic human input and avoid bot detection
- The payment form runs inside an iframe, accessed via `frameLocator`
- A sign-in modal is dismissed automatically during search results