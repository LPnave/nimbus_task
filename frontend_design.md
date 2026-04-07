# Design Workflow

This project uses **Google Stitch** as the UI/UX design tool. All frontend screens are designed in Stitch first, then converted into React + shadcn/ui + Tailwind components via the Stitch MCP.

---

## Tools Required

| Tool | Purpose |
|---|---|
| [Google Stitch](https://stitch.withgoogle.com) | AI-powered UI design tool — source of truth for all screen designs |
| Stitch MCP | Bridges Stitch designs into your AI coding agent (Claude, Cursor, etc.) |
| Claude / Claude Code | Converts Stitch screen HTML + design tokens into React components |

---

## One-Time Setup

### 1. Get your Stitch API Key

1. Go to [stitch.withgoogle.com](https://stitch.withgoogle.com)
2. Click your profile picture → **Stitch Settings**
3. Navigate to **API key** → **Create key**
4. Copy and store the key securely — you won't be able to see it again

### 2. Connect Stitch MCP to your AI agent

Add the following to your MCP client config (e.g. `.mcp.json` in the project root, or your Claude Code / Cursor settings):

```json
{
  "mcpServers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "YOUR-API-KEY"
      }
    }
  }
}
```

> ⚠️ Never commit your API key. Add `.mcp.json` to `.gitignore` and use environment variable substitution if your client supports it.

---

## Adding or Updating a Screen

Follow this process any time a new screen is designed or an existing one is updated in Stitch.

### Step 1 — Design in Stitch

Create or update the screen in [stitch.withgoogle.com](https://stitch.withgoogle.com). Note the **Project ID** and **Screen ID** from the URL or Stitch's project panel — you'll need these in the next step.

### Step 2 — Pull the design via MCP

With the Stitch MCP connected, prompt your agent:

```
Use the Stitch MCP to fetch screen <SCREEN_ID> from project <PROJECT_ID>.
Extract the design DNA (colors, typography, spacing, layout) and generate
a DESIGN.md file summarising the tokens.
```

### Step 3 — Scaffold the React component

Once the design context is loaded, prompt your agent:

```
Using the Stitch design for <SCREEN_NAME>, create a React component at
src/components/<ComponentName>.tsx using shadcn/ui primitives and Tailwind CSS.
Include skeleton loader states for all async data, and match the layout,
colours, and typography exactly from the Stitch design.
```

### Step 4 — Verify

- Visually compare the rendered component against the Stitch screen
- Check dark/light mode renders correctly
- Confirm all skeleton loader states are present for async data areas
- Run `eslint` and `prettier` before committing

---

## Design Conventions

These conventions keep the Stitch designs and the React codebase in sync:

- **One Stitch screen = one route or one major feature component** — avoid designing partial UI in isolation
- **Naming** — Stitch screen names must match the React component filename exactly (e.g. Stitch screen `MapSidebar` → `src/components/map/MapSidebar.tsx`)
- **Design tokens** — colours, font sizes, and spacing defined in Stitch are mapped to Tailwind config values in `tailwind.config.ts`. Do not hardcode hex values in components
- **shadcn/ui first** — always use an existing shadcn/ui primitive before writing custom UI. Only create a custom component if no shadcn primitive covers the use case
- **Skeleton loaders are required** — every component that fetches async data must have a skeleton state. Design the skeleton in Stitch alongside the loaded state

---

## Project Screen Index

Keep this table updated as screens are added to the Stitch project.

| Screen Name | Stitch Screen ID | Route | React Component | Status |
|---|---|---|---|---|
| Landing Page | https://stitch.withgoogle.com/projects/9333582798582033167?node-id=66b21f2a46da4ea18c1868ffd83c8a1b | `/` | `src/pages/Landing.tsx` | ✅ Done |
| Login | https://stitch.withgoogle.com/projects/9333582798582033167?node-id=13d19291ac3543aaa61fc58a57044890 | `/login` | `src/pages/Login.tsx` | ✅ Done |
| Register | https://stitch.withgoogle.com/projects/9333582798582033167?node-id=08bd6645642c45599b7c4f0f8878b540 | `/register` | `src/pages/Register.tsx` | ✅ Done |
| Map View | https://stitch.withgoogle.com/projects/9333582798582033167?node-id=ef49f146a63f472b986fb6d4e3f4e067 | `/map` | `src/pages/Map.tsx` | ✅ Done |
| Location Detail Panel | https://stitch.withgoogle.com/projects/9333582798582033167?node-id=a3185fd24301473381f03cef885349c3 | `/map?id={}` | `src/components/map/LocationPanel.tsx` | ✅ Done |
| Add / Edit Location Form | — | (modal) | `src/components/map/LocationForm.tsx` | ✅ Done |
| Sidebar Location List | — | (panel) | `src/components/sidebar/LocationList.tsx` | ✅ Done |

> Fill in the Stitch Screen IDs once screens are created in the project.

---

## Troubleshooting

**MCP not connecting?**
Verify your API key is valid and the `X-Goog-Api-Key` header is being sent correctly. Re-generate the key in Stitch Settings if needed.

**Component doesn't match the design?**
Re-run the MCP fetch and pass `get_screen_image` to your agent alongside `get_screen_code` — the screenshot gives the agent a visual reference to compare against during generation.

**Design tokens drifting from Tailwind config?**
Re-run the design DNA extraction step and update `tailwind.config.ts` before scaffolding new components.