"""Gera templates/assets/marca-dados.js (desenho do logo e da estrela para os templates)."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from geo import star_path, to_d

AQUI = os.path.dirname(os.path.abspath(__file__))
dados = json.load(open(os.path.join(AQUI, 'logo-data.json')))
# estrela normalizada (mesmas proporções da estrela do símbolo) numa caixa 100x100
k = 46 / 19
dados['estrela'] = {'viewBox': '0 0 100 100', 'd': to_d(star_path(50, 50, 46, 9.6 * k, 6.8 * k, soft=3.0 * k))}
saida = os.path.join(AQUI, '..', '..', 'templates', 'assets', 'marca-dados.js')
os.makedirs(os.path.dirname(saida), exist_ok=True)
with open(saida, 'w') as f:
    f.write('/* Gerado automaticamente por ferramentas/gerador-logo/marca_js.py — NÃO EDITE À MÃO.\n'
            '   Contém o desenho vetorial do logo e da estrela usado dentro dos templates. */\n')
    f.write('window.MARCA_DADOS = ' + json.dumps(dados, ensure_ascii=False) + ';\n')
print('ok', saida)
