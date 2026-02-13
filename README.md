# UltiDB

> A centralized hub for interacting with, searching, and tracking curated Awesome Lists from GitHub - including daily sync, categories, search function, and update tracker.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black)](https://nextjs.org/)

## ✨ Features

- 📊 **Centralized Overview**: Browse 672+ Awesome Lists organized in 35 categories
- 🔍 **Full-text Search**: Search across lists, frameworks, libraries, and themes
- 📂 **Smart Categories**: Lists auto-categorized (AI & ML, Back-End Development, Programming Languages, DevOps, Data Science, CLI Tools, Gaming, and more)
- 🔄 **Daily Sync**: Automatic sync with [sindresorhus/awesome](https://github.com/sindresorhus/awesome) - new lists added, outdated removed (6 months without updates)
- 📈 **Live Tracker**: Track updated lists with statistics card, "Updated Today" counter, and dropdown showing recently updated Awesome Lists (name, time, commit info)
- 📱 **Responsive UI**: Optimized card layout for mobile, tablet, and desktop (Next.js + shadcn/ui)

## 🎯 Core Functionality

### Categories & Lists
- 35 predefined categories covering all major tech domains
- Automatic list-to-category mapping based on README sections and fallback rules
- Card layout with optimized readability: name spans max 2 lines, truncated descriptions, no card overflow

### Tracker & Updates
- **ListUpdate Model**: Stores individual commits/changes per list
- **DailyStats Model**: Aggregated daily statistics (e.g., count of updated lists)
- **"Updated Today" Stat Card**: Shows number of lists updated today
- **Header Dropdown**: Displays recently updated Awesome Lists with name, time, and commit info

### Daily Sync with sindresorhus/awesome
- **API Endpoint `/api/sync`**: Fetches current structure from https://github.com/sindresorhus/awesome, updates existing entries, adds new ones, removes outdated (6 months without updates)
- **API Endpoint `/api/cron/daily`**: Runs complete daily workflow: Sync + Tracker Update
- Configurable for external cron services (e.g., cron-job.org) or manual execution via curl

### Examples (Manual Execution)

```bash
# Run complete daily cron
curl http://localhost:3000/api/cron/daily

# Sync lists only
curl -X POST http://localhost:3000/api/sync

# Update tracker only
curl -X POST http://localhost:3000/api/tracker
```

## 🛠️ Tech Stack

**Frontend**: Next.js (App Router), React, TypeScript, shadcn/ui

**Backend / API**: Next.js API Routes (REST), Cron/Sync endpoints

**Database**: Prisma ORM with models for AwesomeList, Category, ListUpdate, DailyStats

**Tracking & Sync**: GitHub Integration (commits, stars, forks, last update), daily sync from sindresorhus/awesome

## 🚀 Getting Started

### Prerequisites

- Node.js (recommended: LTS version)
- PostgreSQL, MySQL, or SQLite database (configurable via Prisma)
- GitHub Token (optional) for extended commit tracking

### Installation

```bash
# Clone repository
git clone https://github.com/eskoNBG/UltiDB.git
cd UltiDB

# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate deploy

# (Optional) Seed demo data
curl -X POST http://localhost:3000/api/seed
curl -X POST http://localhost:3000/api/tracker/seed
```

### Environment Configuration

Create a `.env` file in the project root:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/ultidb"

# Base URL for API endpoints
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# GitHub token for higher API rate limits (optional)
GITHUB_TOKEN="optional-github-token-fuer-api-rate-limits"

# Secret for cron endpoint authentication
CRON_SECRET="dein-cron-secret"
```

### Development & Start

```bash
# Start development server
npm run dev

# Run linting
npm run lint
```

The app will be available at http://localhost:3000

## 📖 API Reference

### Sync Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sync` | POST | Sync lists with sindresorhus/awesome |
| `/api/tracker` | POST | Update tracker data for all lists |
| `/api/cron/daily` | GET | Run complete daily workflow |

### Data Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/seed` | POST | Seed demo data |
| `/api/tracker/seed` | POST | Seed tracker demo data |

## 🗺️ Roadmap

- [ ] User-defined favorites / bookmarks for custom Awesome Collections
- [ ] Export/import lists as JSON/YAML
- [ ] Advanced filters (e.g., by language, stars, last update)
- [ ] Public API for querying categories, lists, and tracker data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License – Copyright (c) 2026 eskoNBG

## 🔗 Links

- [sindresorhus/awesome](https://github.com/sindresorhus/awesome) - The original Awesome Lists repository
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
