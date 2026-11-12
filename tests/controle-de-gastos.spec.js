// tests/controle-de-gastos.spec.js
const { test, expect } = require('@playwright/test');

async function registrar(page, descricao, valor) {
  await page.getByLabel('Descrição').fill(descricao);
  await page.getByLabel('Valor (R$)').fill(valor);
  await page.getByRole('button', { name: 'Adicionar gasto' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/'); // usa o baseURL do playwright.config.js
});

// C1 · Caminho principal
test('C1: registra um gasto e ele aparece na lista com o total atualizado', async ({ page }) => {
  await page.getByLabel('Descrição').fill('Café');
  await page.getByLabel('Valor (R$)').fill('12,50');
  await page.getByRole('button', { name: 'Adicionar gasto' }).click();

  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByText('Total: R$ 12,50 · 1 gasto')).toBeVisible();
});

// C2 · Regra que barra erro
test('C2: recusa valor inválido e avisa o usuário', async ({ page }) => {
  await page.getByLabel('Descrição').fill('Café');
  await page.getByLabel('Valor (R$)').fill('0');
  await page.getByRole('button', { name: 'Adicionar gasto' }).click();

  await expect(page.getByRole('alert')).toHaveText('O valor precisa ser maior que zero.');
  await expect(page.getByRole('listitem')).toHaveCount(0); 
});

// C3 · Regra de estado

test('C3: soma os gastos e mantém tudo depois de recarregar', async ({ page }) => {
  await registrar(page, 'Café', '10');
  await registrar(page, 'Ônibus', '20');
  await registrar(page, 'Cinema', '30');

  // asserção de tela: a soma está certa
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByText('Total: R$ 60,00 · 3 gastos')).toBeVisible();

  // asserção de estado: tudo sobrevive ao reload
  await page.reload();
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByText('Total: R$ 60,00 · 3 gastos')).toBeVisible();
});