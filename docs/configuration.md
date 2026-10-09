# Configuration Guide

Edit site-config.js. Keep the identity Bot HR and its approved story; fill project facts only when confirmed.

| Field | Current value | Supply later |
| --- | --- | --- |
| name | Bot HR | Keep the approved name |
| ticker | Empty / Pending | Final ticker; BOTHR was proposed |
| network / chainId | Ethereum / 1 | Intended Ethereum mainnet |
| contractAddress | Empty | Confirmed 42-character Ethereum token address |
| launchStatus | Launch details pending | Accurate current status |
| supply | Empty | Confirmed supply as display text |
| buyTax / sellTax | Empty | Confirmed percentages as display text, including a percent sign if desired |
| liquidityStatus | Empty | Confirmed status; never assume burning/locking |
| ownershipStatus | Empty | Confirmed status; never assume renouncement |
| links.buy | Empty | Verified owner-provided HTTPS trading URL |
| links.dexscreener / links.dextools | Empty | Verified project pair/token URLs |
| links.telegram / links.x | Empty | Actual project community URLs |
| siteUrl | Empty | Actual HTTPS publication URL, used for static Open Graph metadata on build |

No fake addresses or links are embedded. Empty fields show pending states; absent external links are hidden. Copy address is disabled until the address matches 0x plus 40 hexadecimal characters. That format check does not independently verify token identity or checksum. The full configured string, including its case, is copied without shortening or modification.

After editing, run npm run check and npm run build. Publishing is a separate owner decision; this kit does not deploy anything.
