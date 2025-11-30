# 📂 Estrutura de Arquivos do Projeto

Este documento explica brevemente a função de cada arquivo e pasta do projeto.

## 📁 Estrutura Principal

### `src/` - Código Fonte da Aplicação

#### `index.jsx`
**Função:** Ponto de entrada da aplicação React
**O que faz:** Renderiza o componente `App` no elemento HTML com id="root" e importa os estilos globais

#### `App.jsx`
**Função:** Componente principal que configura o roteamento
**O que faz:** 
- Define as rotas da aplicação (`/`, `/regions`, `/region/:region`)
- Gerencia o estado global (favoritos, coleção)
- Configura o base path para GitHub Pages

#### `index.css`
**Função:** Estilos globais da aplicação
**O que faz:** Define o design system (Swiss minimal), tipografia, cores e estilos base

---

## 📦 Componentes (`src/components/`)

### `Header.jsx` + `Header.css`
**Função:** Cabeçalho de navegação
**O que faz:** Exibe o logo "Flourished" e links de navegação (My Collection, Regions) com destaque para a página ativa

### `FlowerCard.jsx`
**Função:** Cartão individual de flor
**O que faz:** Exibe imagem, nome comum e científico de uma flor. Inclui botão de remoção e abre modal ao clicar

### `FlowerGrid.jsx`
**Função:** Grid responsivo para exibir múltiplos cartões
**O que faz:** 
- Organiza cartões em layout responsivo (1-4 colunas)
- Filtra automaticamente flores sem imagens
- Exibe mensagem quando não há flores

### `FlowerDetailModal.jsx`
**Função:** Modal com informações detalhadas da flor
**O que faz:**
- Exibe nome científico, comum, hierarquia taxonómica
- Mostra múltiplas imagens da espécie
- Integra com GBIF API para informações adicionais
- Exibe instruções de cuidados da planta
- Botões de ação (Like, Add to My Flowers)

### `AddPlantForm.jsx`
**Função:** Formulário para adicionar plantas pessoais
**O que faz:**
- Permite upload de imagem (converte para base64)
- Campos: nome, nome científico, imagem
- Validação de campos obrigatórios
- Integra com hook `useFlowers` para salvar

### `Loader.jsx` + `Loader.css`
**Função:** Componente de carregamento
**O que faz:** Exibe animação enquanto dados são obtidos da API

---

## 🎣 Hooks (`src/hooks/`)

### `useFlowers.js`
**Função:** Gestão da coleção pessoal de plantas
**O que faz:**
- Carrega plantas do localStorage
- Permite adicionar/remover plantas
- Busca flores aleatórias da API
- Substitui automaticamente plantas sem imagens
- Sincroniza entre componentes e abas

**Funções principais:**
- `addFlower()` - Adiciona nova planta
- `removeFlower()` - Remove planta
- `loadUserPlants()` - Carrega do localStorage
- `saveUserPlants()` - Salva no localStorage

### `useFavorites.js`
**Função:** Gestão de flores favoritas
**O que faz:**
- Gerencia lista de flores favoritas
- Persiste em localStorage
- Sincroniza entre páginas e abas do navegador
- Substitui automaticamente favoritos sem imagens
- Funciona independentemente da coleção pessoal

**Funções principais:**
- `addFavorite()` - Adiciona aos favoritos
- `removeFavorite()` - Remove dos favoritos
- `isFavorite()` - Verifica se está nos favoritos
- `reloadFavorites()` - Recarrega do localStorage

---

## 📚 Bibliotecas (`src/lib/`)

### `regions.js`
**Função:** Integração com iNaturalist API
**O que faz:**
- Busca flores por região geográfica (5 continentes)
- Busca flores aleatórias
- Sistema de cache para otimizar performance
- Normaliza dados da API para formato uniforme
- Agrupa por espécie (deduplica)

**Funções principais:**
- `fetchRegionPlants()` - Busca flores por região
- `fetchRandomFlowers()` - Busca flores aleatórias
- `readCache()` / `writeCache()` - Gerencia cache

### `gbif.js`
**Função:** Integração com GBIF API
**O que faz:**
- Busca informações detalhadas sobre espécies
- Obtém hierarquia taxonómica completa
- Busca status de conservação
- Obtém mídia adicional (imagens)

**Funções principais:**
- `enrichFlowerWithGBIF()` - Enriquece flor com dados GBIF

### `plantCare.js`
**Função:** Informações sobre cuidados das plantas
**O que faz:**
- Retorna instruções de cuidados baseadas na família taxonómica
- Informações sobre: rega, luz, solo, temperatura, fertilização, poda

**Funções principais:**
- `getPlantCareInfo()` - Retorna cuidados por família

---

## 📄 Páginas (`src/pages/`)

### `Regions.jsx` + `Regions.css`
**Função:** Página de seleção de regiões
**O que faz:**
- Exibe mapa visual com 5 continentes
- Cada região é um link para `/region/:region`
- Design minimalista

### `RegionPlants.jsx` + `RegionPlants.css`
**Função:** Página de flores por região
**O que faz:**
- Lista flores da região selecionada
- Integra com iNaturalist API
- Botão "See More" para carregar mais flores
- Sistema de paginação
- Modal de detalhes integrado
- Botões para adicionar aos favoritos e à coleção

---

## 🌐 Arquivos Públicos (`public/`)

### `404.html`
**Função:** Redirecionamento para React Router
**O que faz:** Redireciona todas as rotas para `index.html` para funcionar com SPA no GitHub Pages

### `CNAME`
**Função:** Domínio personalizado
**O que faz:** Define o domínio `flourished.pt` para GitHub Pages

### `.nojekyll`
**Função:** Desabilita Jekyll
**O que faz:** Arquivo vazio que indica ao GitHub Pages para não processar com Jekyll

### `favicon.ico` e `vite.svg`
**Função:** Ícones do site
**O que faz:** Favicon e logo padrão

---

## ⚙️ Configuração

### `vite.config.js`
**Função:** Configuração do Vite
**O que faz:**
- Define base path para GitHub Pages (`/MP2_TDW_COANHAS/`)
- Configura proxies para APIs (se necessário)
- Define configurações de build

### `package.json`
**Função:** Metadados e dependências do projeto
**O que faz:**
- Lista dependências (React, React Router, etc.)
- Define scripts (dev, build, preview)

### `.gitignore`
**Função:** Arquivos a ignorar no Git
**O que faz:** Lista arquivos que não devem ser commitados (node_modules, dist, etc.)

### `index.html`
**Função:** Template HTML base
**O que faz:** HTML inicial que carrega o React

---

## 🔧 CI/CD (`.github/workflows/`)

### `deploy.yml`
**Função:** Workflow de deploy automático
**O que faz:**
- Executa automaticamente em push para master
- Instala dependências
- Faz build do projeto
- Faz deploy para GitHub Pages
- Verifica arquivos gerados

---

## 📝 Documentação

### `README.md`
**Função:** Documentação básica do projeto
**O que faz:** Visão geral, funcionalidades, como instalar e executar

### `PROJECT_DOCUMENTATION.md`
**Função:** Documentação técnica detalhada
**O que faz:** Explica estrutura, APIs, componentes, etc.

### `PROJECT_REPORT.md`
**Função:** Relatório passo a passo do desenvolvimento
**O que faz:** Documenta como o projeto foi desenvolvido fase por fase

---

## 🔑 localStorage Keys

O projeto usa as seguintes chaves no localStorage:

- `beFlourished_user_plants` - Coleção pessoal de plantas
- `beFlourished_favorites` - Flores favoritas
- `beFlourished_deleted_samples` - IDs de amostras deletadas
- `beFlourished_cache_*` - Cache de requisições API (TTL: 2 horas)

---

## 📊 Fluxo de Dados Resumido

1. **Inicialização:** `index.jsx` → `App.jsx` → Carrega dados do localStorage
2. **Adicionar Planta:** `AddPlantForm` → `useFlowers.addFlower()` → localStorage
3. **Explorar Regiões:** `Regions` → `RegionPlants` → `fetchRegionPlants()` → iNaturalist API
4. **Ver Detalhes:** `FlowerCard` → `FlowerDetailModal` → `enrichFlowerWithGBIF()` → GBIF API
5. **Adicionar Favorito:** `FlowerDetailModal` → `useFavorites.addFavorite()` → localStorage

---

## 🎯 Principais Dependências

- **React 19** - Biblioteca UI
- **React Router DOM 7** - Roteamento
- **Vite 7** - Build tool
- APIs externas (iNaturalist, GBIF) - Dados de flores

