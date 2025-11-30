# ✅ Checklist para Corrigir 404 no GitHub Pages

## 🔍 Verificação Rápida (Faça Agora)

### 1. Configuração do GitHub Pages
- [ ] Acesse: https://github.com/coanhas123/MP2_TDW_COANHAS/settings/pages
- [ ] Em **"Source"**, verifique se está selecionado: **"GitHub Actions"**
- [ ] Se estiver como "Deploy from a branch", **ALTERE para "GitHub Actions"**
- [ ] Clique em **"Save"**

### 2. Status do Deploy
- [ ] Acesse: https://github.com/coanhas123/MP2_TDW_COANHAS/actions
- [ ] Procure pelo workflow mais recente: **"Deploy to GitHub Pages"**
- [ ] Verifique o status:
  - ✅ **Verde** = Deploy bem-sucedido
  - ❌ **Vermelho** = Erro (clique para ver detalhes)
  - 🟡 **Amarelo** = Em execução (aguarde)

### 3. Se o Deploy Falhou
Se o workflow estiver vermelho:
1. Clique no workflow com erro
2. Expanda os passos que falharam
3. Leia as mensagens de erro
4. Envie-me os erros para eu ajudar a corrigir

### 4. Se o Deploy Funcionou mas Ainda Dá 404

**Limpar Cache:**
1. Abra uma janela anônima/privada
2. Acesse: https://coanhas123.github.io/MP2_TDW_COANHAS/
3. Se funcionar na janela anônima, é problema de cache

**Aguardar:**
- Às vezes o GitHub Pages leva 5-10 minutos para atualizar após o deploy
- Aguarde e tente novamente

### 5. Forçar Novo Deploy (Se Necessário)

Se precisar forçar um novo deploy:
1. Faço um commit vazio
2. Push para o GitHub
3. Aguarda 2-3 minutos
4. Testa novamente

---

## 📋 Configuração Esperada

✅ **Correto:**
- Source: GitHub Actions
- Workflow: "Deploy to GitHub Pages" completo e verde
- Arquivos: `dist/index.html`, `dist/assets/`, etc.

❌ **Incorreto:**
- Source: Deploy from a branch
- Source: gh-pages branch
- Workflow falhou ou não existe

---

## 🔗 Links Úteis

- **Settings:** https://github.com/coanhas123/MP2_TDW_COANHAS/settings/pages
- **Actions:** https://github.com/coanhas123/MP2_TDW_COANHAS/actions
- **Site:** https://coanhas123.github.io/MP2_TDW_COANHAS/

---

## ⚠️ Problema Mais Comum

O erro 404 geralmente acontece porque o GitHub Pages está configurado para usar **"Deploy from a branch"** em vez de **"GitHub Actions"**.

**Solução:**
1. Vá para Settings > Pages
2. Mude Source para "GitHub Actions"
3. Salve
4. Aguarde 2-3 minutos
5. Teste novamente

