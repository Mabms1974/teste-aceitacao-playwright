# Testes de aceitação: Controle de Gastos

**Dupla:** Paulo Campos Bezerra e Marco Antonio Barbosa
**Disciplina:** Teste de Software · Exercício 04 (Playwright · aceitação)

## O app

**Controle de Gastos** é uma página em HTML, CSS e JavaScript puro (`public/index.html`), servida por `server.js` sem dependências. O usuário registra um gasto informando descrição, valor e categoria. O app mostra a lista de gastos, um resumo com o total e a quantidade (por exemplo, "Total: R$ 12,50 · 1 gasto"), permite remover gastos e guarda tudo no `localStorage`. Gastos com descrição vazia ou valor menor ou igual a zero são recusados com um aviso.

## Como rodar

```bash
npm i
npx playwright install chromium
npx playwright test
```

O `playwright.config.js` sobe o app sozinho (`node server.js` em http://127.0.0.1:5173), roda os testes e desliga tudo.

## Critérios de aceite (Dado / Quando / Então)

| # | Critério | Dado que… quando… então… |
|---|----------|--------------------------|
| C1 | Registrar gasto | Dado que estou no app · quando preencho "Café" com valor 12,50 e clico em "Adicionar gasto" · então vejo 1 item na lista e o resumo mostra "Total: R$ 12,50 · 1 gasto" |
| C2 | Recusar valor inválido | Dado que estou no app · quando tento registrar "Café" com valor 0 · então vejo o aviso "O valor precisa ser maior que zero." e a lista continua vazia |
| C3 | Somar e persistir | Dado que registro 3 gastos (R$ 10, R$ 20 e R$ 30) · quando olho o resumo e recarrego a página · então o resumo mostra "Total: R$ 60,00 · 3 gastos" e os 3 gastos continuam na lista depois do *reload* |

## Critério → teste → evidência

Arquivo de testes: `tests/controle-de-gastos.spec.js`

| Cenário | Critério | Teste (arquivo:linha) | O que ele prova | Evidência |
|---------|----------|-----------------------|-----------------|-----------|
| 1 · Caminho principal | C1 | `tests/controle-de-gastos.spec.js:15`: *C1: registra um gasto e ele aparece na lista com o total atualizado* | O fluxo do primeiro clique até a tela: o gasto entra na lista (1 item) e o resumo é atualizado com o total e a quantidade. | Verde: `playwright-report/` e `evidencias/relatorio-3-testes-verdes.png`. Vermelho: `evidencias/anti-teste-1-caminho-principal.txt` |
| 2 · Regra que barra erro | C2 | `tests/controle-de-gastos.spec.js:25`: *C2: recusa valor inválido e avisa o usuário* | O app recusa um valor impossível (0), mostra a mensagem exata no `alert` e não adiciona nada na lista. | Verde: `playwright-report/` e `evidencias/relatorio-3-testes-verdes.png`. Vermelho: `evidencias/anti-teste-2-regra-de-erro.txt` |
| 3 · Regra de estado | C3 | `tests/controle-de-gastos.spec.js:36`: *C3: soma os gastos e mantém tudo depois de recarregar* | Duas asserções de naturezas diferentes: de tela (a lista tem 3 itens e o resumo soma R$ 60,00) e de estado (depois do `reload`, os 3 gastos e o total continuam). | Verde: `playwright-report/` e `evidencias/relatorio-3-testes-verdes.png`. Vermelho: `evidencias/anti-teste-3-regra-de-estado.txt` |

## Anti-teste: quebramos o app de propósito

Para cada teste, comentamos uma linha do `public/index.html` que implementa a regra, rodamos só aquele teste (`npx playwright test -g "Cx"`) e ele ficou **vermelho**. Depois desfizemos a mudança e os 3 testes voltaram ao **verde**.

| Teste | Linha comentada no app | Falha observada |
|-------|------------------------|-----------------|
| C1 · Caminho principal | `renderizar();` dentro do `submit`, depois de adicionar o gasto | `toHaveCount(1)` (linha 20 do teste) recebeu 0 itens na lista |
| C2 · Regra de erro | o `if (!Number.isFinite(valor) \|\| valor <= 0)` da função `validar` | `toHaveText` (linha 30 do teste): o `alert` veio vazio, nenhum aviso apareceu |
| C3 · Regra de estado | `salvar();` dentro do `submit` (gravação no `localStorage`) | A parte da tela passou, mas depois do `page.reload()` o `toHaveCount(3)` (linha 47 do teste) recebeu 0 itens |

Os arquivos `evidencias/anti-teste-*.txt` trazem a saída do Playwright com cada teste falhando.

## Regras seguidas

- Seletores só por papel, rótulo ou texto (`getByRole`, `getByLabel`, `getByText`). Nenhum XPath, `nth-child` ou classe de estilo.
- Nenhum `waitForTimeout` ou espera fixa: o `expect` espera o app reagir.
- Cada teste tem pelo menos dois `expect` com asserções diferentes e roda sozinho (`npx playwright test -g "nome"`).
- O app sobe sozinho pelo `webServer` do `playwright.config.js`.