"""Geometria do símbolo e do logotipo — A Promessa de Abraão."""
import math, pathops
import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONTS = __import__('os').path.join(__import__('os').path.dirname(__file__), 'fontes')
J = pathops.LineJoin.ROUND_JOIN
CAP = pathops.LineCap.ROUND_CAP

def to_d(path, nd=2):
    pen = SVGPathPen(None, ntos=lambda v: ('%.*f' % (nd, v)).rstrip('0').rstrip('.') if '.' in ('%.*f' % (nd, v)) else '%d' % v)
    path.draw(pen)
    return pen.getCommands()

def union(*ps):
    out = ps[0]
    for p in ps[1:]:
        out = pathops.op(out, p, pathops.PathOp.UNION)
    return out

def diff(a, b):
    return pathops.op(a, b, pathops.PathOp.DIFFERENCE)

def thicken(p, w):
    s = pathops.Path(); p.draw(s.getPen())
    s.stroke(w, CAP, J, 4)
    s.convertConicsToQuads()
    return union(p, s)

def star_path(cx, cy, R, r, ri, soft=1.6):
    p = pathops.Path()
    for k in range(16):
        a = math.radians(-90 + k * 22.5)
        rad = ri if k % 2 else (R if k % 4 == 0 else r)
        x, y = cx + rad * math.cos(a), cy + rad * math.sin(a)
        (p.lineTo if k else p.moveTo)(x, y)
    p.close()
    return thicken(p, soft)

def transform(p, sx=1, sy=None, tx=0, ty=0):
    sy = sx if sy is None else sy
    q = pathops.Path()
    p.draw(TransformPen(q.getPen(), (sx, 0, 0, sy, tx, ty)))
    return q

# ---------- Símbolo: Tenda Aberta + Estrela da Promessa ----------
BASE_Y = 100

def tent_outer():
    p = pathops.Path()
    p.moveTo(40, 26)
    p.quadTo(27, 66, 0, BASE_Y)
    p.lineTo(82, BASE_Y)
    p.quadTo(54, 66, 40, 26)
    p.close()
    return thicken(p, 3.2)

def tent_door():
    p = pathops.Path()
    p.moveTo(41.5, 54)
    p.cubicTo(38, 68, 32, 86, 28, BASE_Y)
    p.lineTo(28, 120); p.lineTo(56, 120); p.lineTo(56, BASE_Y)
    p.cubicTo(50, 86, 44, 68, 41.5, 54)
    p.close()
    return thicken(p, 1.0)

def tent_door_visible():
    """Porta só até a base da tenda (área pintada como 'luz acesa')."""
    box = pathops.Path(); box.moveTo(-10, 0); box.lineTo(130, 0); box.lineTo(130, BASE_Y + 1.6); box.lineTo(-10, BASE_Y + 1.6); box.close()
    return pathops.op(tent_door(), box, pathops.PathOp.INTERSECTION)

def star():
    return star_path(86, 24, 19, 9.6, 6.8, soft=3.0)

def symbol_parts():
    tent = diff(tent_outer(), tent_door())
    return {'tent': tent, 'door': tent_door_visible(), 'star': star()}

# ---------- Texto (glifos vetorizados) ----------
def text_path(txt, font_file, variations, size, x=0, y=0, tracking=0):
    blob = hb.Blob.from_file_path(font_file)
    face = hb.Face(blob)
    font = hb.Font(face)
    font.set_variations(variations)
    upem = face.upem
    buf = hb.Buffer(); buf.add_str(txt); buf.guess_segment_properties()
    hb.shape(font, buf, {'kern': True, 'liga': True})
    sc = size / upem
    out = pathops.Path()
    pen_x = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        g = pathops.Path()
        tp = TransformPen(g.getPen(), (sc, 0, 0, -sc, x + (pen_x + pos.x_offset) * sc, y - pos.y_offset * sc))
        font.draw_glyph_with_pen(info.codepoint, tp)
        out = union(out, g) if list(out.segments) else g
        pen_x += pos.x_advance + tracking * upem
    return out, pen_x * sc

ROMAN = FONTS + '/Fraunces-VF.ttf'
ITALIC = FONTS + '/Fraunces-Italic-VF.ttf'
V_LINE1 = {'opsz': 144, 'wght': 600, 'SOFT': 100, 'WONK': 0}
V_LINE2 = {'opsz': 144, 'wght': 500, 'SOFT': 100, 'WONK': 0}
