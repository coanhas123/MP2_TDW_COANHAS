# Configuração DNS para Domínio Personalizado

## Instruções para Configurar o Domínio flourished.pt

### ⚠️ IMPORTANTE: Configurar no Seu Provedor DNS

Estas configurações devem ser feitas no painel de administração do seu provedor DNS (onde o domínio `flourished.pt` está registrado).

---

## Passo 1: Criar Registro TXT para Verificação

Configure um registro TXT no seu provedor DNS com os seguintes valores:

### Valores do Registro:

- **Nome/Host:** `_github-pages-challenge-coanhas123`
- **Tipo:** `TXT`
- **Valor:** `93dc1a11f31aa8040ac1366d3a0c5f`
- **TTL:** Use o padrão (geralmente 3600 segundos ou 1 hora)

### Como Adicionar:

1. Acesse o painel de administração do seu provedor DNS
2. Encontre a secção de gestão DNS ou "DNS Records"
3. Clique em "Adicionar Registro" ou "Add Record"
4. Preencha os valores acima
5. Salve as alterações

### Exemplos por Provedor:

**GoDaddy:**
- Vá para "DNS Management"
- Clique em "Add"
- Selecione tipo "TXT"
- Nome: `_github-pages-challenge-coanhas123`
- Valor: `93dc1a11f31aa8040ac1366d3a0c5f`
- TTL: 1 hora

**Namecheap:**
- Vá para "Advanced DNS"
- Clique em "Add New Record"
- Tipo: TXT Record
- Host: `_github-pages-challenge-coanhas123`
- Value: `93dc1a11f31aa8040ac1366d3a0c5f`

**Cloudflare:**
- Vá para "DNS"
- Clique em "Add record"
- Tipo: TXT
- Nome: `_github-pages-challenge-coanhas123`
- Conteúdo: `93dc1a11f31aa8040ac1366d3a0c5f`

---

## Passo 2: Aguardar Propagação DNS

- ⏰ **Tempo de propagação:** Até 24 horas (geralmente 1-4 horas)
- ✅ **Verificar propagação:** Use https://dnschecker.org
  - Digite: `_github-pages-challenge-coanhas123.flourished.pt`
  - Selecione tipo: TXT
  - Verifique se aparece o valor: `93dc1a11f31aa8040ac1366d3a0c5f`

---

## Passo 3: Adicionar Domínio no GitHub

Após o DNS propagar:

1. Acesse: https://github.com/coanhas123/MP2_TDW_COANHAS/settings/pages
2. Na secção **"Custom domain"**, digite: `flourished.pt`
3. Clique em **"Save"**
4. O GitHub verificará automaticamente o registro TXT

### ✅ Verificação Bem-Sucedida

Se a verificação for bem-sucedida:
- O GitHub mostrará uma mensagem de sucesso
- Um ícone de verificação aparecerá ao lado do domínio
- O GitHub fornecerá instruções para os registros DNS finais (A ou CNAME)

### ❌ Se a Verificação Falhar

- Aguarde mais tempo para a propagação DNS (pode levar até 24 horas)
- Verifique se o registro TXT foi criado corretamente
- Verifique se não há espaços extras no valor do registro
- Use dnschecker.org para confirmar a propagação global

---

## Passo 4: Configurar Registros DNS Finais (Após Verificação)

Após o GitHub verificar o domínio, você precisará configurar:

### Opção A: Registros A (Recomendado)

Apontar para os IPs do GitHub Pages:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### Opção B: Registro CNAME

Apontar para: `coanhas123.github.io`

**Nota:** O GitHub fornecerá as instruções específicas após a verificação bem-sucedida.

---

## Status Atual

- ✅ Arquivo `CNAME` criado no projeto
- ✅ Base path configurado no `vite.config.js`
- ✅ React Router configurado com basename
- ⏳ Aguardando configuração DNS (você precisa fazer isso)
- ⏳ Aguardando adicionar domínio no GitHub Pages

---

## Verificar Status

- **DNS Propagation:** https://dnschecker.org
- **GitHub Pages Settings:** https://github.com/coanhas123/MP2_TDW_COANHAS/settings/pages
- **Site atual:** https://coanhas123.github.io/MP2_TDW_COANHAS/

---

## Ajuda Adicional

Se encontrar problemas:
1. Verifique se o registro TXT está correto
2. Aguarde até 24 horas para propagação
3. Consulte a documentação do GitHub: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

