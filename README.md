# Swimart Robotic Cleaner Selector (draft for review)

Standalone copy of the selector for demonstrating to colleagues who don't use Claude. The original stays in Claude, where it can still be edited.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | Start page linking the three tools |
| `counter.html` | Counter selector for store staff (desktop) |
| `technician.html` | Technician app for phones on site |
| `range.html` | FY27 range chart |
| `runtime.js` | Small script that runs the pages (keep it next to the HTML files) |
| `images/` | Product photos and Swimart logo |

No server, login or database is needed. Each store's brand selection is saved in that person's browser.

## Option A: open it locally (private, quickest)

1. Unzip the folder.
2. Double-click `index.html`. It opens in your web browser.

To share, email or Teams the zip; colleagues unzip it and open `index.html` the same way.

## Option B: GitHub Pages (a web link)

**Before you publish:** on a free GitHub account, a GitHub Pages site is public. Anyone with the link can open it, and it shows Swimart branding, RRPs and the FY27 range. The pages tell search engines not to list them, but that isn't access control. Private Pages sites need GitHub Enterprise Cloud.

1. Sign in at github.com and click **New repository**. Give it a name, e.g. `cleaner-selector-demo`.
2. Open the new repository, click **Add file → Upload files**, and drag in everything in this folder, including the `images` folder. Click **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or two the page shows your site's address, e.g. `https://your-name.github.io/cleaner-selector-demo/`.

To take it down later: **Settings → Pages → Unpublish site**, or delete the repository.

## Updating

Make changes in the Claude version first, then ask for a fresh standalone export and replace these files, so the two copies don't drift apart.

## Handing over to Swimart (Swim Central)

These are plain static files: HTML, one JavaScript file and images. Swimart IT can host them behind the Swim Central login as-is, or use them as the specification for a rebuild in their platform. The robot data and selection logic sit near the top of the script inside each HTML file.
