# ProtoHive3D Web Platform

This is a production-grade [Next.js](https://nextjs.org) application built to support quoting, ordering, and administrative workflows for ProtoHive3D. It includes customer-facing flows, admin tools, audit logging, and email integration.

## Milestone Status

- ✅ Build: Stable as of 2025-09-06 19:55 CDT
- ✅ All pages compile and pass lint/type checks
- ✅ Quote flow, webhook handling, and admin export validated
- ✅ ESLint compliance and suspense boundaries resolved

## Tech Stack

- [Next.js 15.5.0](https://nextjs.org)
- [SQLite](https://www.sqlite.org/index.html) for lightweight persistence
- [Resend](https://resend.com) for transactional email delivery
- [Vercel](https://vercel.com) for deployment
- Custom hooks, audit systems, and CLI/GUI workflows

## Getting Started

To run locally:

```bash
npm install
npm run dev

Then open http://localhost:3000 in your browser.

Directory Highlights
src/app/ – App Router pages and layouts

src/components/ – Reusable UI components

src/hooks/ – Custom React hooks

src/utils/ – DB access, logging, and server utilities

src/app/api/ – API routes for quote, order, and admin flows

Credits
This project uses and respects the following open-source tools:

Next.js and create-next-app

React

next/font (Geist font)

Resend for transactional email delivery

SQLite for local data persistence

Deployment
This app is optimized for deployment on Vercel. See Next.js deployment docs for details.

© 2025 ProtoHive3D. All rights reserved.