// Servidor mínimo, sem dependências: serve a pasta public/ em http://127.0.0.1:5173
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTA = 5173;
const HOST = '127.0.0.1';
const PASTA = path.join(__dirname, 'public');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const arquivo = path.join(PASTA, url === '/' ? 'index.html' : url);

  if (!arquivo.startsWith(PASTA)) {
    res.writeHead(403).end();
    return;
  }

  fs.readFile(arquivo, (err, conteudo) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    res.end(conteudo);
  });
}).listen(PORTA, HOST, () => {
  console.log(`Controle de Gastos rodando em http://${HOST}:${PORTA}`);
});
