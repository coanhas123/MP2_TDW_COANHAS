# ⚠️ AÇÃO NECESSÁRIA: Configurar GitHub Pages

## 🚨 O erro 404 acontece porque o GitHub Pages não está configurado corretamente!

Você **PRECISA** fazer estas configurações manualmente no GitHub. Eu não consigo fazer isso por você.

---

## 📋 Passo a Passo OBRIGATÓRIO

### 1️⃣ Acesse as Configurações do Repositório

**Abra este link no seu navegador:**
```
https://github.com/coanhas123/MP2_TDW_COANHAS/settings/pages
```

### 2️⃣ Configure a Fonte (Source)

1. **Role a página até a seção "Build and deployment"**
2. **Procure por "Source"** (pode estar escrito "Fonte" em português)
3. **Clique no dropdown "Source"**

### 3️⃣ Selecione "GitHub Actions"

**IMPORTANTE:** Você deve ver estas opções:
- ❌ "Deploy from a branch" (NÃO ESCOLHA ESTA)
- ❌ "gh-pages" (NÃO ESCOLHA ESTA)
- ✅ **"GitHub Actions"** (ESCOLHA ESTA!)

### 4️⃣ Salve

1. Clique em **"Save"** (Salvar)
2. Aguarde a página recarregar

### 5️⃣ Verifique o Status

Após salvar, você deve ver:
- ✅ Uma mensagem verde dizendo que está usando GitHub Actions
- ✅ O nome do workflow: "Deploy to GitHub Pages"

---

## 🔍 Como Verificar se Está Correto

### ✅ Configuração CORRETA:

```
Source: GitHub Actions
```

Você deve ver isso na página de Settings > Pages.

### ❌ Configuração INCORRETA:

```
Source: Deploy from a branch
Branch: main (ou master)
```

Se você ver isso, está ERRADO e precisa mudar!

---

## 🎯 Depois de Configurar

1. **Aguarde 2-3 minutos**
2. **Vá para a aba Actions:**
   ```
   https://github.com/coanhas123/MP2_TDW_COANHAS/actions
   ```
3. **Você deve ver um workflow "Deploy to GitHub Pages" em execução**
4. **Aguarde ele completar (deve ficar verde ✅)**
5. **Teste o site:**
   ```
   https://coanhas123.github.io/MP2_TDW_COANHAS/
   ```

---

## 📸 Não Consegue Encontrar?

Se você não encontrar a opção "GitHub Actions":

1. **Verifique se você tem permissão de administrador** no repositório
2. **Verifique se o repositório não é privado** (pode ter limitações)
3. **Tente acessar direto:**
   - Vá para: https://github.com/coanhas123/MP2_TDW_COANHAS
   - Clique em "Settings" (configurações)
   - No menu lateral esquerdo, clique em "Pages"
   - Procure por "Source"

---

## ❓ Ainda Não Funciona?

Se após seguir TODOS os passos acima ainda não funcionar:

1. **Tire uma captura de tela** da página Settings > Pages
2. **Tire uma captura de tela** da aba Actions (mostrando os workflows)
3. **Me envie as imagens** para eu ver o que está acontecendo

---

## 🔗 Links Diretos

- **Settings > Pages:** https://github.com/coanhas123/MP2_TDW_COANHAS/settings/pages
- **Actions (Workflows):** https://github.com/coanhas123/MP2_TDW_COANHAS/actions
- **Site:** https://coanhas123.github.io/MP2_TDW_COANHAS/

---

## ⏰ Tempo Estimado

- **Configurar:** 2 minutos
- **Aguardar deploy:** 2-3 minutos
- **Total:** 5 minutos

**Após isso, o site deve funcionar!** 🎉

