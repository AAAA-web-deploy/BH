# Bot HR — Complete Cursor Kit

Everything is in this one ZIP: the working starter, all 11 approved image designs, PNG originals, smaller website versions, final copy, configuration, full Cursor prompt, research notes, and build checks.

## Fastest use

1. Extract the ZIP and open the **Bot_HR_Cursor_Kit** folder in Cursor.
2. Open **CURSOR_PROMPT.md**, copy its complete contents, and paste them into Cursor Agent.
3. Let Cursor finish and verify the supplied starter. It does not need to generate images or reconstruct the website from scratch.

## Preview or build immediately

The site already runs. Open **index.html** directly, or use Node 18+:

```sh
npm run dev
```

Then open **http://127.0.0.1:4173**. No dependency installation is needed.

```sh
npm run check
npm run build
```

The static export is **dist/**. The ZIP omits generated dist copies to avoid duplicating all image bytes; this command recreates them quickly.

## Fill in launch details later

Edit only **site-config.js** for the final ticker, contract address, launch status, tokenomics, verified buy/DEX links, Telegram, X, and publication URL. Unknown values remain pending. No API key, database, wallet connection, font download, or image service is required.

## Verification status

JavaScript syntax, local asset references, image dimensions/transparency, the five-story/four-meme inventory, and the production export passed their checks. Live desktop/mobile visual and interaction checks remain for Cursor to run locally: this environment could not provide an accessible browser preview. See **docs/verification.md** for the precise status.

The fast-build and single-file delivery requirements are saved in the reusable workflow and applied to this kit.
