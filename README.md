# Arzy 2.0

A tiny AI buddy with big glasses: chat, wardrobe, a customizable room, a care system, and a Claude-powered brain.

## Deploy to Vercel
1. Push this folder to GitHub (or run `vercel` in it). Framework preset: **Other**. No build command.
2. **Project Settings → Environment Variables**, add:
   - **Free (OpenRouter):** `OPENROUTER_API_KEY` from https://openrouter.ai/keys. Optional `OPENROUTER_MODEL`: one model id, or several separated by commas as fallbacks (default `openrouter/free`, which picks a random free model each time). Pick `:free` models from https://openrouter.ai/models?pricing=free
   - **Free (Gemini):** `GEMINI_API_KEY` from https://aistudio.google.com (optional `GEMINI_MODEL`, default `gemini-3.5-flash`; if you hit limits, pick a lighter model that AI Studio lists as free)
   - **Or Claude:** `ANTHROPIC_API_KEY` (paid or credits). Priority if several keys are set: OpenRouter, then Gemini, then Claude; force one with `AI_PROVIDER=gemini` or `anthropic`
   - `ANTHROPIC_MODEL` (optional, default `claude-sonnet-5-5`; use `claude-haiku-5-5` for cheaper, faster replies)
   - `ARZY_WEB_SEARCH=1` (optional, lets him look up recent pop culture; extra cost)
3. Redeploy. Without the key, Arzy still works using his built-in keyword brain.

## Local dev
```
npm i -g vercel
cp .env.example .env     # put your key in .env
vercel dev
```

## Notes
- Anyone with the URL can chat and spend your API credits. Add a spending limit in the Anthropic console, or put the site behind Vercel Password Protection.
- Room, outfit and stats are saved in each visitor's browser (localStorage).
- Edit `api/chat.js` to change his personality. Sprites live in `assets/sprites/` (keep the filenames).

## Memory
Arzy keeps a long-term memory (the 🧠 Mind tab) in each visitor's browser. Claude adds facts with `[mem:...]` tags as you chat, and you can add, delete or clear them. It is sent with every message so he remembers across sessions.

## Cloud sync (optional)
Memory, outfit, room and stats sync across devices through Upstash Redis.
1. Vercel project → **Storage** tab → **Create Database** → **Upstash for Redis** → connect it to this project (it adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically).
2. Redeploy.
3. In Arzy: **🧠 Mind → Sync across devices**, enter the same secret phrase (8+ chars) on every device.
Optional: set `ARZY_SALT` to any random string for extra privacy. Data is stored under a hash of the phrase; whoever knows the phrase can read it.

## v2.1
- Pin `OPENROUTER_MODEL` to specific models: the random free router can return safety-classifier output ("User Safety: safe"). The server now rejects such replies and tries the next model/provider.
- Images: up to 10 MB are accepted, then shrunk in the browser (Vercel functions accept ~4.5 MB requests).
- Web search: Gemini (Google Search grounding) and Claude by default; OpenRouter needs `OPENROUTER_WEB=1`. Disable all with `ARZY_WEB=0`.

## Music
Say "play aria math c418", "pause", "resume", "stop", "louder", "quieter". Without extra setup Arzy plays 30-second previews (looping) with cover art via the iTunes Search API. For full songs, add `YOUTUBE_API_KEY` (YouTube Data API v3 enabled in Google Cloud); the song plays in a visible 200x200 YouTube player, as YouTube requires.

## Playlists & full songs
- Paste a YouTube or Spotify link in chat (or in the 🎧 Music tab) to save and play it. Say "time for music" or "pull up my playlist" to bring up the toolbar.
- YouTube playlists/videos play in full through YouTube's embedded player (it must stay visible, per YouTube rules). Spotify embeds play full songs only when you are logged in to Spotify in that browser; otherwise 30s previews.
- For song requests to play in full, set `YOUTUBE_API_KEY` or `SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET`.

## v3: audit release
- **Diagnostics:** open `/api/chat?test=1` (or 🧠 Mind → *Check AI connection*) to see which AI keys work, their latency, music keys and cloud sync status. Never shows secret values.
- **Protection:** all `/api/*` routes block cross-site calls and rate-limit per IP (best effort on serverless). Security headers are set in `vercel.json`. Saved/synced data is sanitized on load.
- **Settings (🧠 Mind):** talkativeness (quiet/normal/chatty), language (Taglish/English/Tagalog), backup export/import, clear chat.
- **Installable app (PWA):** manifest, icons and a service worker; "Add to Home Screen" works on phones.
- **Tests:** `npm test` (static checks) and `python3 tests/smoke.py` (headless browser; needs `pip install playwright && playwright install chromium`).
