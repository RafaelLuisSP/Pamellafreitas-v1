# Manual da Marca · Pâmella Freitas — Psicologia Infantil

Site do **Brand Book v1.0** de Pâmella Freitas, psicóloga infantil. Um manual de
marca navegável, em português do Brasil, construído fielmente a partir do
documento oficial *Manual da Marca — Pâmella Freitas*.

> *“Toda criança merece ser compreendida antes de ser corrigida.”*
> Escuta acolhedora · Vínculo · Tempo da criança

## Sobre

Site estático (HTML + CSS + JavaScript, sem build) que apresenta os **14
capítulos** do manual, da essência da marca à governança do seu uso:

| | Capítulo | | Capítulo |
|---|---|---|---|
| 00 | Sumário e boas-vindas | 08 | Layout e composição |
| 01 | Fundamentos e estratégia | 09 | Movimento e som |
| 02 | Identidade verbal | 10 | Produto digital |
| 03 | Logo | 11 | Aplicações |
| 04 | Cor | 12 | Kit para parceiros |
| 05 | Tipografia | 13 | Governança |
| 06 | Elementos gráficos | 14 | Anexos e recursos |
| 07 | Imagem e fotografia | | |

## Identidade visual aplicada

- **Tipografia:** Spectral (display/títulos) + Mulish (corpo), via Google Fonts (OFL).
- **Paleta oficial:** Musgo `#2E3A2C`, Folha `#5F7B57`, Terracota `#C0805A`,
  Madeira `#7B5E47`, Broto `#AFC298`, Areia `#E7DCC6`, Linho `#F5EFE4`,
  Névoa `#BCB3A2`, Carvão `#38342B`.
- **Símbolo:** a árvore que cresce no seu tempo — raízes firmes, copa que
  respira, folhas ao vento e um pássaro que pousa (SVG inline).
- **Proporção de cor:** regra 60–30–10 (off-white domina, verdes estruturam,
  terracota/madeira como acento).

## Recursos do site

- Navegação lateral fixa por capítulos com destaque do capítulo ativo.
- Barra de progresso de leitura.
- Menu móvel responsivo e layout *mobile-first*.
- Animações de revelação suaves, respeitando `prefers-reduced-motion`.
- Acessibilidade: contraste AA, foco visível, HTML semântico, navegação por teclado.

## Estrutura

```
.
├── index.html              # Capa + 14 capítulos
├── assets/
│   ├── css/style.css       # Sistema de design (tokens, componentes)
│   └── js/script.js        # Navegação, progresso e revelação
├── docs/
│   └── manual-original-extraido.html  # Conteúdo oficial extraído (fonte da verdade)
└── README.md
```

## Como visualizar

Por ser um site estático, basta abrir `index.html` no navegador. Para servir
localmente:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

## Créditos

Conteúdo do *Manual da Marca — Pâmella Freitas* (v1.0, Junho de 2026). Fontes
Spectral e Mulish sob SIL Open Font License.
