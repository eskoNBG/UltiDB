UltiDB

UltiDB ist ein zentraler Hub zum Entdecken, Durchsuchen und Tracken von kuratierten Awesome Lists von GitHub
– inklusive täglichem Sync, Kategorien, Suchfunktion und Update-Tracker.
​

Features
Zentralisierte Übersicht über aktuell 672 Awesome Lists in 35 Kategorien.
​
Volltextsuche nach Listen, Frameworks, Libraries und Themen.
​
Kategoriesystem inspiriert von sindresorhus/awesome und awesomelists.top.
​
Täglicher Sync mit sindresorhus/awesome: neue Listen werden hinzugefügt, veraltete (6+ Monate ohne Updates) entfernt.
​
Tracker für aktualisierte Listen mit eigener Statistik-Card „Updated Today“ und Dropdown für zuletzt aktualisierte Listen.
​
Voll responsive UI mit zentriertem Layout, optimiert für Mobile, Tablet und Desktop (Next.js + shadcn/ui).
​
Tech-Stack
Frontend: Next.js (App Router), React, TypeScript, shadcn/ui.
​
Backend / API: Next.js API Routes (REST), Cron-/Sync-Endpunkte.
​
Datenbank: Prisma ORM mit Modellen für AwesomeList, Category, ListUpdate, DailyStats.
​
Tracking & Sync: GitHub-Integration (Commits, Stars, Forks, Last Update), täglicher Sync von sindresorhus/awesome.
​
Kernfunktionen im Detail
Kategorien & Listen
35 vordefinierte Kategorien wie AI & ML, Back-End Development, Programming Languages, DevOps, Data Science, CLI Tools, Gaming und mehr.
​
Automatische Zuordnung von Listen zu Kategorien anhand von README-Abschnitten und Fallback-Regeln.
​
Kachel-Layout mit optimierter Lesbarkeit: Name über maximal zwei Zeilen, Beschreibung gekürzt, kein Overflow über Kartenränder.
​
Tracker & Updates
ListUpdate-Model zum Speichern einzelner Commits/Änderungen pro Liste.
​
DailyStats-Model für aggregierte Tagesstatistiken (z. B. Anzahl aktualisierter Listen).
​
„Updated Today“-Stat-Kachel zeigt die Anzahl der heute geupdateten Listen.
​
Dropdown im Header mit einer Liste der zuletzt aktualisierten Awesome Lists (Name, Zeit, Commit-Info).
​
Täglicher Sync mit sindresorhus/awesome
API-Endpunkt /api/sync holt die aktuelle Struktur von https://github.com/sindresorhus/awesome, aktualisiert bestehende Einträge, fügt neue hinzu und entfernt veraltete (6 Monate ohne Update).
​
API-Endpunkt /api/cron/daily führt den kompletten Tageslauf aus: Sync + Tracker-Update.
​
Konfigurierbar für externe Cron-Services (z. B. cron-job.org) oder manuelle Ausführung via curl.
​
Beispiel (manuell):
# Kompletten Daily-Cron ausführen
curl http://localhost:3000/api/cron/daily

# Nur Listen synchronisieren
curl -X POST http://localhost:3000/api/sync

# Nur Tracker aktualisieren
curl -X POST http://localhost:3000/api/tracker
Getting Started
Voraussetzungen
Node.js (empfohlen: LTS-Version)

Eine PostgreSQL-, MySQL- oder SQLite-Datenbank (konfigurierbar via Prisma)

GitHub Token (optional) für erweitertes Commit-Tracking

Installation

# Repository klonen
git clone https://github.com/eskoNBG/UltiDB.git
cd UltiDB

# Abhängigkeiten installieren
npm install

# Prisma-Migrationen ausführen
npx prisma migrate deploy

# (Optional) Seed-Daten für Demo
curl -X POST http://localhost:3000/api/seed
curl -X POST http://localhost:3000/api/tracker/seed
Environment konfigurieren
Lege eine .env Datei im Projektroot an (Beispiel):


DATABASE_URL="postgresql://user:password@localhost:5432/ultidb"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
GITHUB_TOKEN="optional-github-token-fuer-api-rate-limits"
CRON_SECRET="dein-cron-secret"
Entwicklung & Start

# Development-Server starten
npm run dev

# Linting
npm run lint
Die App ist anschließend unter http://localhost:3000 erreichbar.
​

Geplante Erweiterungen (Ideas)
Benutzerdefinierte Favoriten / Bookmarks für eigene Awesome-Collections.

Export/Import von Listen als JSON/YAML.

Erweiterte Filter (z. B. nach Sprache, Stars, letztem Update).

Öffentliche API zum Abfragen von Kategorien, Listen und Tracker-Daten.

Lizenz
Füge hier deine gewünschte Lizenz ein, z. B.:


MIT License – Copyright (c) 2026 eskoNBG
