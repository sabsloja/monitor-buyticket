# Gerador do logo (para designers/desenvolvedores)

Scripts que geram todos os SVGs da pasta `/logo` com o texto já convertido em curvas.
Quem só vai usar a marca **não precisa disto** — use os arquivos prontos em `/logo`.

## Como rodar

```bash
pip install fonttools uharfbuzz skia-pathops
mkdir -p fontes && cd fontes
curl -sSL -o Fraunces-VF.ttf        "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf"
curl -sSL -o Fraunces-Italic-VF.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces-Italic%5BSOFT,WONK,opsz,wght%5D.ttf"
cd ..
python3 logos.py ../../logo
```

- `geo.py` — geometria do símbolo (tenda, porta acesa, estrela) e vetorização do texto.
- `logos.py` — monta as versões vertical, horizontal, símbolo e perfil, nas cores da paleta.
