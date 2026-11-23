# -*- coding: utf-8 -*-
"""
Automated Pipeline for Wahet Nour Clickable Links Directory PDF
================================================================
Rule:
Any new page, route modification, or platform addition MUST be reflected
in the clickable PDF directory. All logo download links are strictly excluded.
"""

import sys
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

import os
import shutil
from playwright.sync_api import sync_playwright

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_TEMPLATE = r"C:\Users\Admin\Desktop\final app\New folder\واحة-نور\pdf_template.html"
OUT_PDF_REPO = os.path.join(WORKSPACE_DIR, "Wahet_Nour_Complete_Clickable_Links_Directory.pdf")
OUT_PDF_ARCHIVE_1 = r"C:\Users\Admin\Desktop\final app\New folder\واحة-نور\00_أرشيف_ملفات_المشروع\Wahet_Nour_Complete_Clickable_Links_Directory.pdf"
OUT_PDF_ARCHIVE_2 = r"C:\Users\Admin\Desktop\final app\New folder\سليم---د.-أحمد-الخطيب-_-saliim\00_أرشيف_ملفات_المشروع\Wahet_Nour_Complete_Clickable_Links_Directory.pdf"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def build_pdf():
    print("Building Wahet Nour Clickable Links Directory PDF...")
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        page = browser.new_page()
        page.goto("file:///" + HTML_TEMPLATE.replace("\\", "/"))
        page.wait_for_timeout(1500)
        
        page.pdf(
            path=OUT_PDF_REPO,
            format="A4",
            print_background=True,
            margin={
                "top": "10mm",
                "bottom": "10mm",
                "left": "10mm",
                "right": "10mm"
            }
        )
        browser.close()

    for archive_path in [OUT_PDF_ARCHIVE_1, OUT_PDF_ARCHIVE_2]:
        os.makedirs(os.path.dirname(archive_path), exist_ok=True)
        shutil.copy2(OUT_PDF_REPO, archive_path)
        print(f"-> Synced to: {archive_path}")

    print(f"[SUCCESS] PDF generated and synced successfully: {os.path.getsize(OUT_PDF_REPO):,} bytes")

if __name__ == "__main__":
    build_pdf()
