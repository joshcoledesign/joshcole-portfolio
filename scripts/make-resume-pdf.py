"""Restyle the approved résumé, preserving its existing PDF-only contact line."""
import argparse
import html
import json
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

parser = argparse.ArgumentParser()
parser.add_argument('--data', required=True)
parser.add_argument('--source', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args()
data = json.loads(Path(args.data).read_text(encoding='utf-8'))
root = Path(__file__).resolve().parent.parent
pdfmetrics.registerFont(TTFont('Geist', str(root / 'public/portfolio/media/ccce59465ae5c61930ad.ttf')))
pdfmetrics.registerFont(TTFont('GeistMedium', str(root / 'public/portfolio/media/a8eefb873ba9c9020665.ttf')))
pdfmetrics.registerFontFamily('Geist', normal='Geist', bold='GeistMedium', italic='Geist', boldItalic='GeistMedium')
ink, muted, accent, rule = map(colors.HexColor, ['#141916', '#515b54', '#166874', '#bbc3bd'])
styles = {
    'name': ParagraphStyle('name', fontName='GeistMedium', fontSize=24, leading=26, textColor=ink, spaceAfter=5),
    'discipline': ParagraphStyle('discipline', fontName='Geist', fontSize=10, leading=13, textColor=ink),
    'contact': ParagraphStyle('contact', fontName='Geist', fontSize=8.7, leading=11, textColor=muted, spaceAfter=5),
    'body': ParagraphStyle('body', fontName='Geist', fontSize=10, leading=11, textColor=ink, spaceAfter=3),
    'heading': ParagraphStyle('heading', fontName='GeistMedium', fontSize=9.5, leading=12, textColor=accent, spaceBefore=6, spaceAfter=2, keepWithNext=True),
    'role': ParagraphStyle('role', fontName='GeistMedium', fontSize=11, leading=12.6, textColor=ink),
    'date': ParagraphStyle('date', fontName='Geist', fontSize=9.5, leading=12.6, textColor=muted, alignment=TA_RIGHT),
    'summary': ParagraphStyle('summary', fontName='Geist', fontSize=10, leading=11.3, textColor=muted),
    'bullet': ParagraphStyle('bullet', fontName='Geist', fontSize=10, leading=11, textColor=ink, leftIndent=10, firstLineIndent=-8, spaceAfter=0),
    'skill': ParagraphStyle('skill', fontName='Geist', fontSize=10, leading=11, textColor=ink, spaceAfter=1),
}

def escaped(text):
    return html.escape(text)

def p(text, style='body'):
    return Paragraph(text, styles[style])

def heading(title):
    return [p(escaped(title.upper()), 'heading'), HRFlowable(width='100%', thickness=.45, color=rule, spaceAfter=2)]

def role_head(role):
    title = escaped(role['title'])
    if role.get('qual'):
        title += ' <font name="Geist" size="10">' + escaped(role['qual']) + '</font>'
    if role.get('org'):
        title += ' <font name="Geist">— ' + escaped(role['org']) + '</font>'
    table = Table([[p(title, 'role'), p(escaped(role['date']), 'date')]], colWidths=[410, 130])
    table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 1)]))
    return table

def role_blocks(role):
    blocks = [Spacer(1, 3), role_head(role)]
    if role.get('summary'):
        blocks.append(p(escaped(role['summary']), 'summary'))
    blocks += [p('• ' + escaped(text), 'bullet') for text in role.get('bullets', [])]
    return blocks

# Read the already-published contact line rather than widening the public HTML data.
original = PdfReader(args.source)
first = original.pages[0].extract_text()
start = first.index(data['contact']['location'])
end = first.index('SUMMARY', start)
contact = ' '.join(first[start:end].split())
if not contact or '@' not in contact:
    raise ValueError('The approved PDF contact line could not be preserved.')

flow = [p(escaped(data['name']), 'name'), p(escaped(data['discipline']), 'discipline'), HRFlowable(width='100%', thickness=1, color=accent, spaceBefore=8, spaceAfter=6), p(escaped(contact), 'contact')]
flow += heading('Summary')
flow += [p(escaped(text)) for text in data['summary']]
flow += heading('Selected AI Work')
flow += [KeepTogether(role_blocks(role)) for role in data['selectedWork']]
flow += heading('Skills & Tools')
flow += [p('<b>' + escaped(skill['label']) + ':</b> ' + escaped(skill['items']), 'skill') for skill in data['skills']]
flow += heading('Experience')
for entry in data['experience']:
    if entry.get('kind') == 'group':
        flow += [Spacer(1, 3), role_head(entry), p(escaped(entry['summary']), 'summary'), PageBreak()]
        flow += [KeepTogether(role_blocks(role)) for role in entry['roles']]
    else:
        flow.append(KeepTogether(role_blocks(entry)))
flow += heading('Independent Experience')
flow += [KeepTogether(role_blocks(role)) for role in data['independent']]
flow += heading('Selected Earlier Experience')
flow += [KeepTogether(role_blocks(role)) for role in data['earlier']]

def footer(canvas, _doc):
    canvas.saveState()
    canvas.setStrokeColor(rule)
    canvas.setLineWidth(.4)
    canvas.line(36, 22, 576, 22)
    canvas.setFillColor(muted)
    canvas.setFont('Geist', 7)
    canvas.drawString(36, 11, data['contact']['site']['label'])
    canvas.drawRightString(576, 11, str(canvas.getPageNumber()).zfill(2))
    canvas.restoreState()

out = Path(args.output)
out.parent.mkdir(parents=True, exist_ok=True)
document = SimpleDocTemplate(str(out), pagesize=letter, leftMargin=36, rightMargin=36, topMargin=28.8, bottomMargin=31, title='Josh Cole Resume', author='Josh Cole', pageCompression=1)
document.build(flow, onFirstPage=footer, onLaterPages=footer)
result = PdfReader(out)
print(json.dumps({'pages': len(result.pages), 'bytes': out.stat().st_size, 'textLayer': all(page.extract_text() for page in result.pages)}))
