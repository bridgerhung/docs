from pathlib import Path

path = Path("public/release-notes/2026-07-19/index.html")
text = path.read_text(encoding="utf-8")
text = text.replace("<!DOCTYPE html>\n<!DOCTYPE html>", "<!DOCTYPE html>", 1)

if text.count("<!DOCTYPE html>") != 1:
    raise SystemExit("Expected exactly one HTML doctype.")
if "wish.brid.pw" in text:
    raise SystemExit("Unexpected wish.brid.pw request remains.")
if "showerFlowers" not in text:
    raise SystemExit("Flower effect is missing.")

path.write_text(text, encoding="utf-8")
