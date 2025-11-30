# GitHub Pages Deployment Guide

## Deploy usando GitHub Actions (Recomendado)

### Passo 1: Atualizar o base path no vite.config.js

Se o seu repositório é `username/flower-explorer`, o base path já está configurado como `/flower-explorer/`.

**Se o nome do seu repositório for diferente:**
1. Abra `vite.config.js`
2. Altere a linha `base: '/flower-explorer/'` para o nome do seu repositório
   - Exemplo: se o repo é `meu-usuario/meu-projeto`, use `base: '/meu-projeto/'`

**Para páginas de usuário/organização** (repo nomeado como `username.github.io`):
- Use `base: '/'`

### Passo 2: Ativar GitHub Pages no repositório

1. Vá para o repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione **GitHub Actions**
5. O workflow será executado automaticamente quando você fizer push para a branch `main` ou `master`

### Passo 3: Fazer push do código

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Passo 4: Verificar o deploy

1. Vá para a aba **Actions** no GitHub
2. Aguarde o workflow "Deploy to GitHub Pages" completar
3. Vá para **Settings > Pages** para ver o URL do seu site
4. O site estará disponível em: `https://username.github.io/flower-explorer/`

---

## Deploy Manual (Alternativa)

### Pré-requisitos

Instale o pacote `gh-pages`:
```bash
npm install --save-dev gh-pages
```

### Deploy

```bash
npm run deploy
```

**Nota:** O script `deploy` está configurado no `package.json` para:
1. Fazer o build do projeto
2. Fazer deploy da pasta `dist` para a branch `gh-pages`

Depois do deploy:
1. Vá para **Settings > Pages** no GitHub
2. Selecione a branch `gh-pages` como source
3. O site estará disponível em alguns minutos

---

## Troubleshooting

### O site não carrega / Erro 404

**Problema:** O base path está incorreto.

**Solução:**
1. Verifique o nome do seu repositório
2. Atualize `base` no `vite.config.js` para corresponder ao nome do repo
3. Faça o build novamente e faça deploy

### As rotas não funcionam (404 em rotas como /regions)

**Problema:** GitHub Pages não suporta SPA routing nativamente.

**Solução:** Já configurado! O Vite está configurado para funcionar com GitHub Pages. Se ainda houver problemas:

1. Certifique-se de que o `base` path está correto no `vite.config.js`
2. Adicione um arquivo `404.html` que redireciona para `index.html`:

Crie `public/404.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 1; // Change this to match your base path depth
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

### Build falha

**Solução:**
1. Verifique se todas as dependências estão instaladas: `npm install`
2. Teste o build localmente: `npm run build`
3. Verifique os logs na aba **Actions** do GitHub para erros específicos

### Assets não carregam (CSS/JS)

**Problema:** Os caminhos dos assets estão incorretos.

**Solução:**
1. Verifique se o `base` path no `vite.config.js` corresponde ao nome do repositório
2. Refaça o build: `npm run build`
3. Verifique a pasta `dist` - os assets devem estar em caminhos relativos ao base path

---

## URLs Comuns

- **Site publicado:** `https://username.github.io/flower-explorer/`
- **Actions (workflows):** `https://github.com/username/flower-explorer/actions`
- **Settings > Pages:** `https://github.com/username/flower-explorer/settings/pages`

---

## Atualizações Futuras

Para atualizar o site:
1. Faça suas alterações no código
2. Commit e push para a branch `main`
3. O GitHub Actions fará o deploy automaticamente
4. Aguarde alguns minutos e o site estará atualizado

---

## Notas Importantes

- ⚠️ **Não commite a pasta `dist`** - ela é gerada automaticamente no build
- ✅ **O workflow GitHub Actions cuida do deploy automaticamente**
- 🔄 **Cada push para `main` atualiza o site automaticamente**
- 📝 **Certifique-se de atualizar o `base` path se renomear o repositório**

