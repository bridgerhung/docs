from __future__ import annotations

import base64
from pathlib import Path

PARTS_DIR = Path("tmp/release-note-restore")
TARGET = Path("public/release-notes/2026-07-19/index.html")

parts = sorted(PARTS_DIR.glob("part*.b64"))
if not parts:
    raise SystemExit("No release-note restoration parts were found.")

payload = "".join(part.read_text(encoding="utf-8").strip() for part in parts)
content = base64.b64decode(payload, validate=True)

required = [
    "祝名琮早日偏頭痛退散！點我鼓勵他一下",
    "近期開發大事記",
    "助教建議的採納狀態",
    "謹此再致謝忱",
    "showerFlowers",
]
text = content.decode("utf-8")
for marker in required:
    if marker not in text:
        raise SystemExit(f"Missing required marker: {marker}")

for forbidden in ["wish.brid.pw", "/cdn-cgi/", "<iframe"]:
    if forbidden in text:
        raise SystemExit(f"Forbidden saved-page artifact remains: {forbidden}")

TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_bytes(content)
print(f"Restored {TARGET} from {len(parts)} parts ({len(content)} bytes).")
