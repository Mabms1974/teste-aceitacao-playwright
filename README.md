# Controle de Gastos: testes de aceitação com Playwright

Dupla: **Paulo Campos Bezerra** e **Marco Antonio Barbosa**

## Como rodar (do zero)

Requisito: Node.js 18 ou mais novo.

```bash
npm i
npx playwright install chromium
npx playwright test
```

O `playwright.config.js` sobe o app sozinho (`node server.js` em http://127.0.0.1:5173), roda os testes e desliga tudo.

No Linux/WSL, se o Chrome reclamar de biblioteca faltando: `npx playwright install --with-deps chromium`.

## Outros comandos

```bash
npx playwright show-report   # relatório HTML (evidência)
npx playwright test --ui     # modo assistido
npm start                    # só abre o app em http://127.0.0.1:5173
```
