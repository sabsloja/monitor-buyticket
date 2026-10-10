# A Promessa de Abraão: Identidade Visual

Marca completa da igreja, na direção **“Tenda Aberta”**: logo, paleta, tipografia, manual e templates editáveis.

**Comece por aqui:** abra o arquivo `index.html` no navegador (de preferência o **Google Chrome**). Ele mostra tudo numa tela só e tem os links para editar cada peça.

```
index.html                 → visão geral (logo, cores, fontes, aplicações)
manual/manual-de-marca.html → manual de marca em 1 página
logo/                      → logos em SVG (vetor, para gráfica)
logo/png/                  → os mesmos logos em PNG transparente (celular, Canva, WhatsApp)
templates/                 → stories, banner, perfil e capas de destaque (editáveis)
templates/fotos/           → coloque aqui fotos que quiser usar pelo código
ferramentas/               → só para designers (gera os SVGs do logo)
```

---

## 1. Como trocar foto e texto

### Jeito fácil: no navegador (recomendado)
1. Abra o template no Chrome, por exemplo `templates/story-culto-terca.html`.
2. **Texto:** clique em qualquer texto da arte (aparece um contorno tracejado) e digite.
   Nomes longos diminuem sozinhos para caber.
3. **Foto:** clique na área tracejada escrita *“Foto do pregador”* e escolha a foto.
   No painel da esquerda, ajuste **Zoom** e **Posição** até o rosto ficar bem enquadrado.
4. Clique em **Baixar PNG**. A imagem sai no tamanho certo.

> Os textos que você digita ficam guardados no navegador. Para recomeçar, clique em **Restaurar textos originais**.

### Pelo código (opcional)
1. Abra o arquivo `.html` num editor de texto (Bloco de Notas, TextEdit ou VS Code).
2. Procure por **`TROQUE AQUI`**. Logo abaixo de cada comentário está o texto que aparece na arte.
   Troque só o que está entre `>` e `<`, por exemplo:
   `<h2 ...>Pr. Nome do Pregador</h2>` → `<h2 ...>Pr. João Silva</h2>`
3. Para a foto: copie a imagem para `templates/fotos/` e escreva o nome dela no `src`:
   `<img src="" alt="Foto do pregador">` → `<img src="fotos/joao.jpg" alt="Foto do pregador">`

> ⚠️ Foto colocada **pelo código** não entra no botão *Baixar PNG* quando o arquivo é aberto direto do computador (é uma trava de segurança do navegador). Nesse caso use o **método 2** abaixo, ou coloque a foto pelo navegador.

---

## 2. Como exportar cada peça como imagem

| Peça | Arquivo | Tamanho |
|---|---|---|
| Story culto de terça | `templates/story-culto-terca.html` | 1080 × 1920 |
| Story culto de sexta | `templates/story-culto-sexta.html` | 1080 × 1920 |
| Story versículo | `templates/story-versiculo.html` | 1080 × 1920 |
| Story aviso | `templates/story-aviso.html` | 1080 × 1920 |
| Story ação social | `templates/story-acao-social.html` | 1080 × 1920 |
| Banner de eventos | `templates/banner-evento.html` | 1920 × 1080 |
| Imagem de perfil | `templates/perfil-instagram.html` | 1080 × 1080 |
| Capas de destaque (6) | `templates/capas-destaque.html` | 1080 × 1080 cada |

**Método 1: botão “Baixar PNG” (o mais fácil).** Já sai no tamanho exato da tabela. Nas capas de destaque há um botão por capa e um “Baixar todas”.

**Método 2: print exato pelo Chrome.** Funciona sempre, inclusive com foto colocada pelo código.
1. Abra o template com `?preview` no fim do endereço, por exemplo `.../story-culto-terca.html?preview`.
2. Aperte **F12** e depois **Ctrl+Shift+M** (no Mac, Cmd+Shift+M) para ativar o modo dispositivo.
3. No topo, escolha *Dimensões: Responsivo* e digite **1080 × 1920** (banner: 1920 × 1080; perfil e capas: 1080 × 1080).
4. No menu **⋮** dessa barra, clique em **Capturar captura de tela**. O PNG sai no tamanho exato.

**Método 3: print da tela (rápido).** Clique em **Tela cheia (para tirar print)**, tire o print e recorte. A qualidade depende da sua tela, então use só em emergência.

**Para gráfica (banner impresso, cartaz):** clique em **Salvar PDF para gráfica** (ou Ctrl+P) →
*Destino: Salvar como PDF* → *Margens: Nenhuma* → em *Mais definições*, marque **Gráficos de plano de fundo**.
O PDF sai em vetor e pode ser ampliado sem perder qualidade. Para os logos, mande os arquivos `.svg` da pasta `logo/`.

**Instagram:** em *Mostrar áreas cobertas pelo Instagram*, o painel mostra as faixas de cima e de baixo do story onde ficam o nome do perfil e a caixa de mensagem. Os templates já deixam essas áreas livres.

---

## 3. Qual logo usar

| Situação | Arquivo |
|---|---|
| Fundo claro (Areia, branco) | `logo-*-colorido` |
| Fundo escuro (Anil, foto escura) | `logo-*-fundo-escuro` |
| Fundo Urucum | `logo-*-fundo-urucum` ou `logo-*-branco` |
| Impressão em 1 cor, carimbo, xerox | `logo-*-preto` |
| Sobre foto | `logo-*-branco` (foto escura e tranquila) |
| Foto de perfil | `perfil-instagram.svg` / `png/perfil-instagram.png` |

`vertical` = principal · `horizontal` = rodapés e banners largos · `simbolo` = ícone sozinho.
SVG para gráfica e designers. PNG para celular, Canva, Word e WhatsApp.

## 4. Cores e fontes

- **Anil** `#1E1D4A` · **Madrugada** `#34327A` · **Ouro** `#F4AD24` · **Urucum** `#D1552E` · **Areia** `#F7EEE2`
- Títulos: **Fraunces** (https://fonts.google.com/specimen/Fraunces), peso 600, “Soft” no máximo.
- Textos: **Figtree** (https://fonts.google.com/specimen/Figtree).
- Os templates carregam as fontes da internet sozinhos. Para usar no Word ou no Canva, baixe as duas no Google Fonts e instale (no Canva, procure pelo nome).

## 5. Para designers

Os SVGs do logo são gerados por `ferramentas/gerador-logo/` (Python + fontTools). Veja o README de lá.
Os templates usam `templates/assets/marca.css` (cores, fontes, peças), `marca.js` (desenha logo, céu de estrelas e cobogó) e `editor.js` (edição e exportação; usa a biblioteca html-to-image, licença MIT, incluída localmente).
