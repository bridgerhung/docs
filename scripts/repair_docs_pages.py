from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SITE_SCRIPT = '<script src="/assets/js/site.js" defer></script>'


def remove_cloudflare_artifacts(html: str) -> str:
    # Remove copied Cloudflare challenge snippets. They do not belong in source HTML.
    html = re.sub(
        r'<script\b[^>]*>[^<]*(?:__CF\$cv\$params|challenge-platform/scripts/jsd/main\.js).*?</script>',
        '',
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    html = re.sub(
        r'<script\s+src="/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader\.min\.js"[^>]*></script>',
        '',
        html,
        flags=re.IGNORECASE,
    )
    # Restore application scripts whose type was rewritten by Rocket Loader.
    html = re.sub(
        r'type="[0-9a-f]+-text/javascript"',
        'type="text/javascript"',
        html,
        flags=re.IGNORECASE,
    )
    return html


def remove_ad_hoc_navigation(path: Path, html: str) -> str:
    # The release detail page previously used pill buttons as page navigation.
    html = re.sub(
        r'\s*<nav\s+class="page-nav"[^>]*>.*?</nav>',
        '',
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )

    # The introduction page used a row of document buttons instead of the navbar.
    if path.as_posix().endswith('public/introduction/index.html'):
        html = re.sub(
            r'\s*<div\s+class="hero-actions">\s*'
            r'(?:<a\b[^>]*href="/(?:student-manual|admin-manual|release-notes)[^"]*"[^>]*>.*?</a>\s*)+'
            r'</div>',
            '',
            html,
            count=1,
            flags=re.IGNORECASE | re.DOTALL,
        )
    return html


def ensure_site_script(html: str) -> str:
    if '/assets/js/site.js' in html:
        return html
    if '</head>' not in html:
        raise ValueError('HTML document is missing </head>')
    return html.replace('</head>', f'  {SITE_SCRIPT}\n</head>', 1)


def repair(path: Path) -> bool:
    original = path.read_text(encoding='utf-8')
    updated = remove_cloudflare_artifacts(original)
    updated = remove_ad_hoc_navigation(path, updated)
    updated = ensure_site_script(updated)

    if updated == original:
        return False

    path.write_text(updated, encoding='utf-8', newline='\n')
    print(f'updated {path.relative_to(ROOT)}')
    return True


def main() -> None:
    changed = 0
    for path in sorted(PUBLIC.rglob('*.html')):
        changed += int(repair(path))
    print(f'repaired {changed} HTML file(s)')


if __name__ == '__main__':
    main()
