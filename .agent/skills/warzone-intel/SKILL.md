# Skill: Warzone Intel Scraper

Guidelines for fetching and processing real-time Warzone data from official and community sources, specifically for the **Black Ops 7 (BO7)** era.

## 📥 Sources
- Official Blog: `https://blog.activision.com/call-of-duty`
- Warzone Main Page: `https://www.callofduty.com/br/pt/warzone`
- Patch Notes: `https://www.callofduty.com/patchnotes`
- Community Feeds: `https://charlieintel.com/feed/`

## 🧠 AI Processing Logic (Gemini 2.5 Flash)
- **Role:** Warzone BO7 Meta Analyst.
- **Task:** Convert complex English patch notes into concise Portuguese summaries.
- **Priority:** 
  1. Black Ops 7 Weapon Buffs/Nerfs.
  2. New Map POIs (Avalon, Launch Pad Verdansk).
  3. Seasonal Events (Season 3, etc.).
- **Era Control:** Ignore all results related to MW3 or older titles unless they specifically impact the current Warzone ecosystem.

## 🖼️ Media Guidelines
- Always extract the `og:image` or `thumbnail` from the RSS feed.
- Era-specific Fallback: `https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchpoints/blog/2026/03/BO7-S03-KEY-ART.jpg`.

## 🛠️ Implementation Pattern
Use `src/services/news/newsProvider.ts` as the primary entry point for fetching data.
Ensure caching via `AsyncStorage` (min 6h) to respect API quotas.
