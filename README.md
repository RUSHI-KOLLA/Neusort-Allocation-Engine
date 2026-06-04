# QDC Mini Assignment

This repository contains a very small slice of **QDC (Quick Dry Cleaning Software)**, a B2B POS and business management app for retail laundry and dry-cleaning businesses. The goal is to simulate how you would work with an existing TypeScript/NestJS/React codebase, extend features, and reason about tradeoffs.

## Business Context

Dry-cleaning stores use QDC to manage orders, garments, and delivery. Each order contains multiple garments with statuses such as `received`, `in_cleaning`, `ready`, and `delivered`. Staff need quick visibility into what is in progress, what is ready for pickup, and what has already been delivered.

This mini app exposes a simple API to list orders and a React UI to display them.

## What Is Already Implemented

### Backend (NestJS)
- A NestJS application under `server/`.
- `OrdersService` with in-memory mock data representing a couple of orders and garments.
- `GET /api/orders` to list all orders.
- `GET /api/orders/:id` to fetch a single order by ID (throws a 404 NotFoundException if not found).
- `GET /api/orders/summary` to get a count of garments grouped by status (omits statuses with zero count).

### Frontend (React + TypeScript)
- A minimal React app under `client/`.
- `App.tsx` fetches orders and the status summary from the backend, and displays loading/error states.
- Summary cards at the top of the dashboard showing garment counts per status.
- A status filter dropdown to show only garments matching a selected status (`all`, `received`, `in_cleaning`, `ready`, `delivered`).
- `OrdersList.tsx` renders a card for each order and lists garments with a human-friendly status label. When filtered, it shows "X of Y garments" and a sensible empty state when no garments match.

## Your Tasks (High Level)

You do **not** need to build a full product. Focus on:

1. **Reading and understanding** the existing code and data flow (NestJS backend → REST API → React frontend).
2. **Completing the two implementation tasks** described separately (they will refer to specific files and function signatures).
3. **Answering the theory questions** about design, tradeoffs, and edge cases in this codebase and the broader QDC domain.

The implementation tasks are intentionally small (15–30 minutes each) and independent of each other.

## Running the Project

### Prerequisites
- Node.js 18+ (Node 20 recommended)

### Install dependencies

From the repository root:

```bash
npm run install-all
```

This uses npm workspaces to install dependencies for both `server` and `client`.

### Start the backend and frontend together

From the repository root:

```bash
npm run dev
```

This will:
- Start the NestJS server on **http://localhost:3001** (API under `/api`).
- Start the React app on **http://localhost:3000**.

### Run backend tests

```bash
npm run test --workspace server
```

### Useful URLs

- `GET http://localhost:3001/api/orders` — list all orders.
- `GET http://localhost:3001/api/orders/ORD-1001` — fetch a specific order.
- `GET http://localhost:3001/api/orders/summary` — garment count by status.
- `http://localhost:3000` — React UI showing the dashboard.

## Notes

- The data is in-memory only; restarting the server resets it.
- Error handling and validation are intentionally minimal to keep the code small.
- You are free to refactor small pieces if it helps you implement the tasks cleanly, but keep the overall structure recognizable.

When you work on the implementation tasks, please follow TypeScript types carefully and think about how this would scale to more complex workflows (e.g., billing, delivery, prepaid packages) in a real QDC environment.

