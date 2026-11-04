"""Verify the redesigned download against the approved PDF's full text."""
import json
import re
import unicodedata

from pypdf import PdfReader

old = PdfReader('public/files/josh-cole-resume-2026-09-22.1.pdf')
new = PdfReader('public/files/josh-cole-resume-2026-09-22.1-culture.pdf')
assert len(new.pages) == 2

def normalized(reader, strip_footer=False):
    text = '\n'.join(page.extract_text() for page in reader.pages)
    if strip_footer:
        text = re.sub(r'(?m)^\s*(?:joshcolecreative\.com|0[12])\s*$', '', text)
    return re.sub(r'[\W_]', '', unicodedata.normalize('NFKC', text)).lower()

assert normalized(old) == normalized(new, True), 'Approved résumé copy or PDF-only contact changed'
fonts = set()
for page in new.pages:
    assert '/Shading' not in page['/Resources'], 'Unexpected gradient in redesigned PDF'
    for font in page['/Resources']['/Font'].values():
        fonts.add(str(font.get_object()['/BaseFont']))
assert any('Geist' in font for font in fonts)
assert not any(re.search(r'Syne|Inter|JetBrains', font) for font in fonts)
print(json.dumps({'result':'passed','pages':2,'approvedTextAndContactPreserved':True,'fonts':sorted(fonts)}))
