"""Build USER_MANUAL.pdf from USER_MANUAL.md.

The Markdown is turned into a print-ready HTML page (A4, Segoe UI), which a
headless Chrome or Edge then prints to PDF.

Requirements: Python 3, the `markdown` package (pip install markdown) and
Google Chrome or Microsoft Edge.

Usage (from the project folder):
    python tools/build-manual.py              # writes USER_MANUAL.pdf
    python tools/build-manual.py --html       # also keeps USER_MANUAL.html for a quick look
    python tools/build-manual.py --browser "C:/path/to/chrome.exe"
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import markdown
    from markdown.extensions.toc import TocExtension
except ImportError:
    sys.exit('The "markdown" package is missing. Install it with: pip install markdown')

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'USER_MANUAL.md'
TARGET = ROOT / 'USER_MANUAL.pdf'

CSS = """
@page { size: A4; margin: 16mm 15mm 16mm 15mm; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Segoe UI', sans-serif; font-size: 10.5pt; line-height: 1.45; color: #1f2333; }
h1 { font-size: 22pt; color: #3a0ca3; margin: 0 0 6pt; }
h2 { font-size: 15pt; color: #3a0ca3; border-bottom: 2px solid #e0d7ff; padding-bottom: 3pt; margin: 18pt 0 8pt; break-after: avoid; }
h3 { font-size: 12pt; color: #5a189a; margin: 12pt 0 6pt; break-after: avoid; }
p, li { margin: 4pt 0; }
ul, ol { padding-left: 18pt; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt; font-size: 9.5pt; break-inside: auto; }
tr { break-inside: avoid; }
th { background: #efeaff; text-align: left; }
th, td { border: 1px solid #d5cdf5; padding: 4pt 6pt; vertical-align: top; }
code { font-family: Consolas, monospace; font-size: 9.5pt; background: #f3f1fb; padding: 0 3pt; border-radius: 3px; }
blockquote { margin: 8pt 0; padding: 6pt 10pt; background: #fff6e0; border-left: 4px solid #ffb703; }
blockquote p { margin: 0; }
hr { border: 0; border-top: 1px solid #e0d7ff; margin: 12pt 0; }
a { color: #3a0ca3; text-decoration: none; }
"""

BROWSERS = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
]
BROWSER_COMMANDS = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge', 'chrome', 'msedge']


def github_slug(value, separator='-'):
    """Heading ids as GitHub makes them, so links like #6-planets-and-the-boss work in the PDF too."""
    value = value.strip().lower()
    value = re.sub(r'[^\w\- ]', '', value, flags=re.UNICODE)
    return value.replace(' ', separator)


def github_to_python_markdown(src):
    """Adjust GitHub-flavoured list syntax for python-markdown.

    GitHub nests lists with 2 spaces and lets a list start right after a line of text;
    python-markdown needs 4 spaces and a blank line before the list.
    """
    is_item = re.compile(r'\s*([-*]|\d+\.) ')
    lines = [(' ' * (2 * (len(l) - len(l.lstrip(' ')))) + l.lstrip(' ')) if l.startswith('  ') else l
             for l in src.split('\n')]
    out = []
    for i, line in enumerate(lines):
        prev = lines[i - 1] if i else ''
        if is_item.match(line) and prev.strip() and not is_item.match(prev):
            out.append('')
        out.append(line)
    return '\n'.join(out)


def build_html(src):
    body = markdown.markdown(github_to_python_markdown(src),
                             extensions=['tables', 'sane_lists', TocExtension(slugify=github_slug)])
    # Every link inside the manual must point at a heading that exists.
    ids = set(re.findall(r'id="([^"]+)"', body))
    broken = sorted(set(re.findall(r'href="#([^"]+)"', body)) - ids)
    if broken:
        sys.exit('Broken links inside the manual: ' + ', '.join('#' + b for b in broken))
    title = re.search(r'^# (.+)$', src, re.M).group(1)
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>' + title +
            '</title><style>' + CSS + '</style></head><body>' + body + '</body></html>')


def find_browser(explicit):
    if explicit:
        return explicit
    for path in BROWSERS:
        if os.path.exists(path):
            return path
    for cmd in BROWSER_COMMANDS:
        found = shutil.which(cmd)
        if found:
            return found
    sys.exit('Chrome or Edge was not found. Pass its path with --browser.')


def main():
    ap = argparse.ArgumentParser(description='Build USER_MANUAL.pdf from USER_MANUAL.md.')
    ap.add_argument('--browser', help='path to Chrome or Edge (found automatically if omitted)')
    ap.add_argument('--html', action='store_true', help='also keep USER_MANUAL.html next to the PDF')
    args = ap.parse_args()

    html = build_html(SOURCE.read_text(encoding='utf-8'))
    browser = find_browser(args.browser)

    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / 'USER_MANUAL.html'
        page.write_text(html, encoding='utf-8')
        out = Path(tmp) / 'USER_MANUAL.pdf'
        try:
            subprocess.run([browser, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
                            '--user-data-dir=' + str(Path(tmp) / 'profile'),
                            '--print-to-pdf=' + str(out), page.as_uri()],
                           check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
        except FileNotFoundError:
            sys.exit('Cannot start the browser: ' + browser)
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
            sys.exit('The browser failed to print the PDF: ' + str(e))
        if not out.exists() or out.stat().st_size == 0:
            sys.exit('The browser did not produce a PDF.')
        shutil.copyfile(out, TARGET)
        if args.html:
            shutil.copyfile(page, ROOT / 'USER_MANUAL.html')

    pages = len(re.findall(rb'/Type\s*/Page[^s]', TARGET.read_bytes()))
    print('Wrote %s (%d pages, %d KB)' % (TARGET.name, pages, TARGET.stat().st_size // 1024))


if __name__ == '__main__':
    main()
