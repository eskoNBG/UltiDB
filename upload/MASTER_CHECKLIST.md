# ✅ ULTIMATEDB - MASTER CHECKLIST
## Alle Schritte, Accounts, Links, Keys

---

## 🔗 ACCOUNTS (Erstelle diese HEUTE)

### GitHub
- [ ] Account erstellt: https://github.com/signup
- [ ] Email verifiziert
- [ ] SSH Keys generiert
- [ ] SSH Test bestanden: `ssh -T git@github.com`
- **Speichern:** GitHub Username: _______________

### Supabase
- [ ] Account erstellt: https://app.supabase.com
- [ ] Mit GitHub authorized
- [ ] Projekt "ultimatedb-production" erstellt
- [ ] Region: Frankfurt (oder nächst gelegen)
- [ ] Datenbank-Passwort gespeichert: _______________
- **Speichern:** Project URL: _______________
- **Speichern:** Anon Key: _______________
- **Speichern:** Service Role Key: _______________

### Vercel
- [ ] Account erstellt: https://vercel.com/signup
- [ ] Mit GitHub authorized
- [ ] Onboarding completed
- **Speichern:** Vercel URL: _______________

### GitHub Personal Access Token
- [ ] Token erstellt: https://github.com/settings/tokens
- [ ] Scope: "repo" + "read:user"
- [ ] Token kopiert (speichern sofort!)
- **Speichern:** GITHUB_TOKEN: _______________

---

## 💻 LOCAL SETUP

### System Check
- [ ] Node.js installiert (v18.17+)
  - Command: `node --version`
- [ ] npm installiert (v9+)
  - Command: `npm --version`
- [ ] Git installiert (v2+)
  - Command: `git --version`
- [ ] VS Code installiert (optional)

### Ordner Struktur
```
~/ultimatedb/
├── .env              (private keys!)
├── .git/
├── web/              (Next.js)
│   ├── app/
│   ├── lib/
│   ├── components/
│   ├── .env.local    (Supabase keys!)
│   └── package.json
├── cli/              (Node.js CLI)
│   ├── src/
│   ├── dist/
│   └── package.json
├── desktop/          (Electron)
│   ├── src/
│   ├── dist/
│   └── package.json
└── scripts/          (GitHub Scraper)
    └── scrape-awesome-lists.js
```

- [ ] Folder ~/ultimatedb created
- [ ] git init executed
- [ ] .gitignore created
- [ ] First commit done: "Initial commit"

---

## 📋 PHASE 1: DATABASE (Week 1, Days 1-2)

### Supabase Setup
- [ ] Dashboard accessed
- [ ] SQL Editor opened
- [ ] Table "categories" created
- [ ] Table "awesome_lists" created
- [ ] Table "awesome_items" created
- [ ] Indexes created (3x)
- [ ] Views created (1x)
- [ ] RLS policies enabled
- [ ] Initial data inserted (8 categories)
- [ ] Sample lists inserted (3x)

### Verification
- [ ] Dashboard shows 3 tables
- [ ] RLS icon shows in table list
- [ ] Can query tables via SQL

---

## 🎨 PHASE 2: FRONTEND (Week 1, Days 2-3)

### Next.js Project
- [ ] `npx create-next-app@latest web` executed
- [ ] TypeScript selected: YES
- [ ] Tailwind selected: YES
- [ ] ESLint selected: YES
- [ ] App Router selected: YES
- [ ] .env.local created with SUPABASE keys

### Dependencies
- [ ] `npm install @supabase/supabase-js` done
- [ ] `npm install axios zustand react-icons react-hot-toast clsx` done

### Code Files Created
- [ ] lib/supabase.ts (Supabase client)
- [ ] app/api/lists/route.ts (API endpoint)
- [ ] app/api/lists/[id]/items/route.ts (API endpoint)
- [ ] components/ListCard.tsx (UI component)
- [ ] components/SearchBar.tsx (UI component)
- [ ] app/page.tsx (Home page)
- [ ] app/lists/[id]/page.tsx (Detail page)

### Testing
- [ ] `npm run dev` executed
- [ ] http://localhost:3000 opens
- [ ] Home page shows
- [ ] Search bar visible
- [ ] List cards rendering
- [ ] Click list → detail page works
- [ ] Mobile responsive

---

## 🚀 PHASE 3: DEPLOYMENT (Week 1, Days 3-5)

### GitHub
- [ ] Remote added: `git remote add origin ...`
- [ ] Branch renamed: `git branch -M main`
- [ ] Code pushed: `git push -u origin main`
- [ ] GitHub repo is PUBLIC
- [ ] README.md created
- [ ] .gitignore working (node_modules not included)

### Vercel
- [ ] Connected to GitHub repo
- [ ] Root Directory: "web"
- [ ] Build Command: `npm run build`
- [ ] Install Command: `npm install`
- [ ] Environment Variables set:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Deployment successful
- [ ] Live URL working: _______________
- [ ] Search functionality works on live

---

## 📊 PHASE 4: SCRAPER (Week 2, Days 1-3)

### Setup
- [ ] scripts/ folder created
- [ ] scrape-awesome-lists.js created
- [ ] .env file created with:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY (SECRET!)
  - [ ] GITHUB_TOKEN
- [ ] Dependencies: `npm install @supabase/supabase-js`

### Running
- [ ] `node scripts/scrape-awesome-lists.js` executed
- [ ] Script runs without errors
- [ ] Confirms: "Found 100+ awesome repositories"
- [ ] Confirms: "✅ Processed: awesome-react"
- [ ] Confirms: "✨ Scraper completed!"

### Verification
- [ ] Supabase dashboard shows 100+ lists
- [ ] Web app search finds results
- [ ] Trending lists sorted by stars
- [ ] Live on Vercel shows all lists

---

## 🖥️ PHASE 5: CLI TOOL (Week 2, Days 4-5 + Week 3)

### Project Setup
- [ ] cli/ folder created
- [ ] `npm init` executed
- [ ] Dependencies installed:
  - [ ] commander
  - [ ] axios
  - [ ] chalk
  - [ ] ora
- [ ] tsconfig.json created
- [ ] src/commands/ folder created

### Commands
- [ ] search command implemented
- [ ] trending command implemented
- [ ] list command implemented
- [ ] Local testing successful:
  - [ ] `ultimatedb search "react"` works
  - [ ] `ultimatedb trending` works
  - [ ] `ultimatedb list frontend` works

### Publishing (Optional)
- [ ] package.json updated with bin
- [ ] `npm link` executed
- [ ] Global command working
- [ ] README.md created for CLI

---

## 🖱️ PHASE 6: DESKTOP APP (Week 3)

### Electron Setup
- [ ] desktop/ folder created
- [ ] `npm init` executed
- [ ] Dependencies:
  - [ ] electron
  - [ ] electron-builder
  - [ ] electron-store

### Source Code
- [ ] src/main/index.ts created
- [ ] Window management working
- [ ] IPC handlers for data
- [ ] Build configuration ready

### Distribution
- [ ] Windows .exe builds
- [ ] Mac .dmg builds
- [ ] Linux .deb builds
- [ ] GitHub Releases published
- [ ] Auto-update system working

---

## 💰 PHASE 7: MONETARISIERUNG (Week 4)

### API Keys System
- [ ] api_keys table created in Supabase
- [ ] API key generation working
- [ ] Rate limiting implemented
- [ ] Tier system defined:
  - [ ] Free: 100 requests/day
  - [ ] Pro: 10k requests/day (€9/mo)
  - [ ] Enterprise: unlimited (€500+/mo)

### Documentation
- [ ] API docs written (OpenAPI/Swagger)
- [ ] Examples provided
- [ ] Pricing page created
- [ ] Signup form working

### B2B Outreach
- [ ] 5 VCs contacted
- [ ] 5 Recruiters contacted
- [ ] Interest measured
- [ ] Follow-ups scheduled

---

## 📊 METRICS TO TRACK

### Web App
- [ ] Users visiting: _______________
- [ ] Daily active users: _______________
- [ ] Searches per day: _______________
- [ ] List views: _______________
- [ ] Load time: < 500ms

### CLI
- [ ] NPM downloads: _______________
- [ ] Daily active users: _______________
- [ ] Command usage breakdown: _______________

### Desktop
- [ ] Windows downloads: _______________
- [ ] Mac downloads: _______________
- [ ] Linux downloads: _______________
- [ ] Daily active users: _______________

### API/Monetarisierung
- [ ] API key signups: _______________
- [ ] Free tier users: _______________
- [ ] Pro tier users: _______________
- [ ] Monthly recurring revenue: € _______________
- [ ] B2B conversations: _______________

---

## 🔐 IMPORTANT: Keep These Secure!

```
NEVER commit to GitHub:
❌ .env files
❌ .env.local files
❌ API Keys
❌ Passwords
❌ Tokens
❌ Secrets

.gitignore should include:
✅ .env
✅ .env.local
✅ node_modules/
✅ .DS_Store
✅ /build
✅ /dist
```

**Store these somewhere safe (password manager):**
- [ ] GitHub Token: _________________
- [ ] Supabase Service Role Key: _________________
- [ ] Database Password: _________________

---

## 🚨 BACKUP CHECKLIST

Every week, backup:
- [ ] GitHub repo (auto-backed up)
- [ ] .env files (password manager)
- [ ] Database exports:
  - Go to Supabase → Backups → Export
  - Save to: ~/backups/ultimatedb-backup-YYYY-MM-DD.sql

---

## 🎓 LEARNING RESOURCES

### TypeScript
- https://www.typescriptlang.org/docs/
- https://www.typescripttutorial.net/

### React/Next.js
- https://react.dev
- https://nextjs.org/docs
- https://www.youtube.com/watch?v=SqcY0GlETPk (Next.js 14 Full Course)

### Supabase
- https://supabase.com/docs
- https://supabase.com/docs/guides/getting-started
- Discord: https://discord.supabase.io

### Tailwind CSS
- https://tailwindcss.com/docs
- https://tailwindui.com/ (components)

### Electron
- https://www.electronjs.org/docs

### CLI Tools
- https://github.com/oclif/oclif (better than commander)
- https://www.npmjs.com/package/commander

---

## 💬 COMMUNITIES TO JOIN

- [ ] Supabase Discord: https://discord.supabase.io
- [ ] Next.js Discord: https://discord.gg/bUG2bVNFn2
- [ ] Developer communities: https://www.indiehackers.com
- [ ] German Dev Community: https://dev.to
- [ ] Twitter/X Dev Community: #100DaysOfCode

---

## 📝 WEEKLY RECAP TEMPLATE

**Every Friday evening, fill this out:**

```
Week: ___ (Jan 24-30)

✅ What went well:
- _______________
- _______________
- _______________

❌ What was hard:
- _______________
- _______________

🎯 Next week goals:
- _______________
- _______________
- _______________

📊 Metrics:
- Users: _______________
- API calls: _______________
- Code commits: _______________
- Lines of code: _______________
```

---

## 🎉 FINAL SUBMISSION

**When all done (end of Week 4), you have:**

- [ ] Web app live on Vercel
- [ ] CLI tool published (or ready)
- [ ] Desktop app distributed
- [ ] GitHub repo public (1000+ stars aspirational!)
- [ ] Documentation complete
- [ ] API monetarisierung live
- [ ] 5+ B2B conversations started
- [ ] Revenue: €0-5000 (first month)

**Portfolio pieces:**
- [ ] GitHub profile updated
- [ ] LinkedIn updated with project
- [ ] Twitter/X sharing progress
- [ ] Dev.to article written
- [ ] Personal website showcasing it

---

## 🚀 YOU GOT THIS!

Print this checklist. Check off boxes as you go. Feel the dopamine hit with each completed task! 💪

**Start time: TODAY**
**End time: February 21, 2026**

**Let's gooooo!** 🎉
