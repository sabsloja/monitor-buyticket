"""Gera os SVGs do logo em /logo (vetorizados, sem dependência de fonte)."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from geo import *

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

PAL = dict(anil='#1E1D4A', madrugada='#34327A', ouro='#F4AD24', urucum='#D1552E', areia='#F7EEE2')
VERSOES = {
    'colorido':     dict(tenda=PAL['anil'],  porta=PAL['urucum'], estrela=PAL['ouro'], l1=PAL['anil'],  l2=PAL['urucum'],
                         desc='Versão colorida — para fundos claros (Areia ou branco).'),
    'fundo-escuro': dict(tenda=PAL['areia'], porta=PAL['urucum'], estrela=PAL['ouro'], l1=PAL['areia'], l2=PAL['ouro'],
                         desc='Versão para fundo escuro (céu noturno / Anil).'),
    'preto':        dict(tenda='#000000', porta=None, estrela='#000000', l1='#000000', l2='#000000',
                         desc='Versão monocromática preta — impressão 1 cor, carimbo, documentos.'),
    'branco':       dict(tenda='#FFFFFF', porta=None, estrela='#FFFFFF', l1='#FFFFFF', l2='#FFFFFF',
                         desc='Versão negativa branca — sobre fotos escuras ou cores fortes da paleta.'),
}

P = symbol_parts()
SB = union(P['tent'], P['star']).bounds  # bounds do símbolo
SW, SH = SB[2] - SB[0], SB[3] - SB[1]

def place(path, s, tx, ty):
    return transform(path, s, s, tx, ty)

def symbol_at(x, y, h):
    s = h / SH
    tx, ty = x - SB[0] * s, y - SB[1] * s
    return {k: place(v, s, tx, ty) for k, v in P.items()}, SW * s

L1, W1 = text_path('A Promessa', ROMAN, V_LINE1, 100)
L2, W2 = text_path('de Abraão', ITALIC, V_LINE2, 100)

def svg_doc(title, desc, parts, cores, pad=0, bg=None, size=None):
    allp = [p for p in parts.values() if p is not None]
    b = allp[0].bounds
    for p in allp[1:]:
        q = p.bounds; b = (min(b[0], q[0]), min(b[1], q[1]), max(b[2], q[2]), max(b[3], q[3]))
    x0, y0, w, h = b[0] - pad, b[1] - pad, b[2] - b[0] + 2 * pad, b[3] - b[1] + 2 * pad
    if size:  # quadro fixo (ex.: perfil 1080x1080)
        x0, y0, w, h = 0, 0, size, size
    f = lambda v: ('%.2f' % v).rstrip('0').rstrip('.')
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(x0)} {f(y0)} {f(w)} {f(h)}" width="{f(w)}" height="{f(h)}">',
           f'  <title>{title}</title>',
           f'  <desc>{desc} Identidade visual “A Promessa de Abraão”. Texto já convertido em curvas (Fraunces). Não altere proporções nem cores — veja manual/manual-de-marca.html</desc>']
    if bg:
        out.append(f'  <rect id="fundo" x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" fill="{bg}"/>')
    sym = [k for k in ('porta', 'tenda', 'estrela') if k in parts]
    if sym:
        out.append('  <g id="simbolo">')
        for k in sym:
            if cores.get(k) and parts[k] is not None:
                ids = {'porta': 'porta-acesa', 'tenda': 'tenda', 'estrela': 'estrela-da-promessa'}[k]
                out.append(f'    <path id="{ids}" fill="{cores[k]}" d="{to_d(parts[k])}"/>')
        out.append('  </g>')
    if 'l1' in parts:
        out.append('  <g id="nome">')
        out.append(f'    <path id="a-promessa" fill="{cores["l1"]}" d="{to_d(parts["l1"])}"/>')
        out.append(f'    <path id="de-abraao" fill="{cores["l2"]}" d="{to_d(parts["l2"])}"/>')
        out.append('  </g>')
    out.append('</svg>\n')
    return '\n'.join(out)

def split_sym(sym):
    return {'porta': sym['door'], 'tenda': sym['tent'], 'estrela': sym['star']}

# ---- Vertical (principal) ----
def vertical():
    S1, S2 = 100, 78
    sym_h = 250
    width = W1
    sym, sw = symbol_at((width - SW * sym_h / SH) / 2 + 8, 0, sym_h)  # +8: compensação óptica (massa da tenda à esquerda)
    base1 = sym_h + 58 + 70
    l1 = place(L1, S1 / 100, 0, base1)
    base2 = base1 + 84
    w2 = W2 * S2 / 100
    l2 = place(L2, S2 / 100, (width - w2) / 2, base2)
    parts = split_sym(sym); parts.update(l1=l1, l2=l2)
    return parts

# ---- Horizontal ----
def horizontal():
    S1, S2 = 100, 78
    base1, base2 = 70, 70 + 82
    sym_h = (base2 + 1.5) * 1.12
    sym, sw = symbol_at(0, base2 + 1.5 - sym_h, sym_h)  # base da tenda alinhada à linha de base de “de Abraão”
    x = sw + 46
    l1 = place(L1, S1 / 100, x, base1)
    l2 = place(L2, S2 / 100, x + 2, base2)
    parts = split_sym(sym); parts.update(l1=l1, l2=l2)
    return parts

def simbolo():
    sym, _ = symbol_at(0, 0, 200)
    return split_sym(sym)

LAYOUTS = {'logo-vertical': ('Logo principal (vertical)', vertical()),
           'logo-horizontal': ('Logo horizontal', horizontal()),
           'simbolo': ('Símbolo', simbolo())}

for nome, (titulo, parts) in LAYOUTS.items():
    for v, cores in VERSOES.items():
        pp = dict(parts)
        if cores['porta'] is None:
            pp.pop('porta')
        open(f'{OUT}/{nome}-{v}.svg', 'w').write(
            svg_doc(f'A Promessa de Abraão — {titulo}, {v.replace("-", " ")}', cores['desc'], pp, cores, pad=1))

# ---- Perfil do Instagram (1080x1080, símbolo centralizado no círculo seguro) ----
def perfil(bg, cores, nome, desc):
    h = 520  # cabe no círculo de recorte do Instagram com folga
    s = h / SH; w = SW * s
    cx, cy = 540, 540
    # centro óptico: centraliza a caixa do símbolo, levemente abaixo (a estrela é leve)
    sym, _ = symbol_at(cx - w / 2, cy - h / 2 + 8, h)
    parts = split_sym(sym)
    open(f'{OUT}/{nome}.svg', 'w').write(svg_doc('A Promessa de Abraão — imagem de perfil', desc, parts, cores, bg=bg, size=1080))

perfil(PAL['anil'], VERSOES['fundo-escuro'], 'perfil-instagram', 'Imagem de perfil 1080×1080 (fundo Anil).')
perfil(PAL['areia'], VERSOES['colorido'], 'perfil-instagram-claro', 'Imagem de perfil 1080×1080 alternativa (fundo Areia).')

# exporta dados para outros geradores (templates usam o símbolo inline)
import json
def pack(parts):
    allp = list(parts.values()); b = allp[0].bounds
    for p in allp[1:]:
        q = p.bounds; b = (min(b[0], q[0]), min(b[1], q[1]), max(b[2], q[2]), max(b[3], q[3]))
    r = lambda v: round(v, 2)
    return {'viewBox': f'{r(b[0]-1)} {r(b[1]-1)} {r(b[2]-b[0]+2)} {r(b[3]-b[1]+2)}', 'parts': {k: to_d(v) for k, v in parts.items()}}
json.dump({k: pack(v[1]) for k, v in LAYOUTS.items()}, open(os.path.join(os.path.dirname(__file__), 'logo-data.json'), 'w'), ensure_ascii=False)
print('ok', SW, SH)
