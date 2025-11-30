# 🔍 Debug: Página Branca com Erros 404 nos Assets

## Problema
- Página carrega mas fica em branco
- Erro no console: "Failed to load resource: the server responded with a status of 404"

## Diagnóstico

### 1. Verificar no Console do Navegador

Abra o Developer Tools (F12) e vá para a aba "Console" ou "Network":

**Procure por erros como:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
/MP2_TDW_COANHAS/assets/index-XXXXX.js - 404
/MP2_TDW_COANHAS/assets/index-XXXXX.css - 404
```

**Ou:**
```
/assets/index-XXXXX.js - 404
/assets/index-XXXXX.css - 404
```

### 2. Verificar URLs dos Assets

Os assets devem estar em:
- ✅ **Correto:** `/MP2_TDW_COANHAS/assets/index-XXXXX.js`
- ❌ **Errado:** `/assets/index-XXXXX.js`

### 3. Possíveis Causas

#### A) Base Path Incorreto
- Os assets estão tentando carregar de `/assets/` em vez de `/MP2_TDW_COANHAS/assets/`

#### B) Arquivos Não Enviados
- Os arquivos não estão sendo enviados no deploy
- O workflow falhou silenciosamente

#### C) Cache do GitHub Pages
- O GitHub Pages está servindo uma versão antiga

#### D) Configuração do GitHub Pages
- O GitHub Pages não está configurado para usar GitHub Actions

## Soluções

### Solução 1: Verificar Workflow no GitHub

1. Acesse: https://github.com/coanhas123/MP2_TDW_COANHAS/actions
2. Clique no workflow mais recente
3. Verifique se todos os passos completaram com sucesso
4. Clique no passo "Verify build files" e veja se os arquivos estão listados

### Solução 2: Verificar Configuração do GitHub Pages

1. Acesse: https://github.com/coanhas123/MP2_TDW_COANHAS/settings/pages
2. Verifique se "Source" está como **"GitHub Actions"**
3. Se não estiver, mude e salve

### Solução 3: Limpar Cache

1. Abra uma janela anônima/privada
2. Acesse: https://coanhas123.github.io/MP2_TDW_COANHAS/
3. Abra o Developer Tools (F12)
4. Vá para a aba "Network"
5. Verifique quais arquivos estão dando 404

### Solução 4: Verificar Arquivos no Deploy

1. No workflow, expanda o passo "Verify build files"
2. Procure por:
   - `dist/index.html`
   - `dist/assets/index-XXXXX.js`
   - `dist/assets/index-XXXXX.css`
   - `dist/.nojekyll`

Se algum desses arquivos não aparecer, há um problema no build.

## Ações Imediatas

1. **Abrir o Console do Navegador** e ver qual URL está tentando carregar os assets
2. **Verificar o workflow** para ver se completou com sucesso
3. **Verificar Settings > Pages** para garantir que está usando GitHub Actions
4. **Testar em janela anônima** para descartar problemas de cache

## Informações para Enviar

Se ainda não funcionar, me envie:

1. **Screenshot do Console do Navegador** (mostrando os erros 404)
2. **Screenshot do workflow** (mostrando se completou ou não)
3. **Screenshot de Settings > Pages** (mostrando a configuração)
4. **URLs exatas** que estão dando 404 (copiar do console)

