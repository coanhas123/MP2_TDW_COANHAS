# 📋 Relatório do Projeto: Flourished

## 🌸 Visão Geral

**Flourished** é uma aplicação web React para explorar e gerir uma coleção pessoal de plantas com flores. O projeto permite aos utilizadores descobrir flores de diferentes regiões geográficas, adicionar as suas próprias plantas e guardar as suas favoritas.

**URL do Projeto:** https://coanhas123.github.io/MP2_TDW_COANHAS/

---

## 🎯 Funcionalidades Principais

1. **Coleção Pessoal** - Adicionar plantas com fotos e informações personalizadas
2. **Exploração Regional** - Descobrir flores de 5 continentes (Europa, Ásia, África, América do Sul, América Central)
3. **Sistema de Favoritos** - Guardar flores preferidas das coleções regionais
4. **Informações Detalhadas** - Visualizar dados taxonómicos, status de conservação e instruções de cuidados
5. **Design Responsivo** - Interface adaptável para dispositivos móveis, tablets e desktops

---

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **React Router DOM 7** - Roteamento client-side para navegação entre páginas
- **Vite 7** - Ferramenta de build moderna e rápida
- **iNaturalist API** - Dados de flores (gratuito, sem necessidade de API key)
- **GBIF API** - Informações detalhadas sobre espécies
- **GitHub Pages** - Hospedagem gratuita do site

---

## 📁 Estrutura do Projeto

```
mp2-coanhas/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── AddPlantForm.jsx # Formulário para adicionar plantas
│   │   ├── FlowerCard.jsx   # Cartão individual de flor
│   │   ├── FlowerGrid.jsx   # Grid responsivo de cartões
│   │   ├── FlowerDetailModal.jsx # Modal com detalhes da flor
│   │   ├── Header.jsx       # Cabeçalho de navegação
│   │   └── Loader.jsx       # Componente de carregamento
│   ├── hooks/               # Custom hooks React
│   │   ├── useFlowers.js    # Gestão da coleção pessoal
│   │   └── useFavorites.js  # Gestão dos favoritos
│   ├── lib/                 # Bibliotecas e utilitários
│   │   ├── regions.js       # Integração com iNaturalist API
│   │   ├── gbif.js          # Integração com GBIF API
│   │   └── plantCare.js     # Informações sobre cuidados
│   ├── pages/               # Páginas da aplicação
│   │   ├── Regions.jsx      # Página de seleção de regiões
│   │   └── RegionPlants.jsx # Página de flores por região
│   ├── App.jsx              # Componente principal e roteamento
│   ├── index.jsx            # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais
├── public/                  # Arquivos estáticos
│   ├── 404.html            # Redirecionamento para SPA
│   ├── CNAME               # Domínio personalizado
│   └── .nojekyll           # Desabilita Jekyll no GitHub Pages
├── .github/workflows/       # CI/CD
│   └── deploy.yml          # Workflow de deploy automático
└── vite.config.js          # Configuração do Vite
```

---

## 🚀 Desenvolvimento Passo a Passo

### Fase 1: Estrutura Base do Projeto

**1.1. Inicialização do Projeto**
- Criação do projeto React usando Vite
- Configuração das dependências base (React, React Router)
- Estruturação de pastas (components, pages, hooks, lib)

**1.2. Configuração de Roteamento**
- Implementação de `BrowserRouter` no `App.jsx`
- Criação de rotas principais:
  - `/` - Página inicial (My Collection)
  - `/regions` - Seleção de regiões
  - `/region/:region` - Flores por região

**1.3. Sistema de Design**
- Implementação de design Swiss minimal
- Estilos globais em `index.css`
- Componentes base (Header, Loader)

### Fase 2: Integração com APIs

**2.1. Integração com iNaturalist API**
- Criação de `src/lib/regions.js`
- Função `fetchRegionPlants()` - Busca flores por região
- Função `fetchRandomFlowers()` - Busca flores aleatórias
- Sistema de cache em localStorage para otimizar performance

**2.2. Integração com GBIF API**
- Criação de `src/lib/gbif.js`
- Função `enrichFlowerWithGBIF()` - Adiciona informações detalhadas
- Dados taxonómicos completos (família, ordem, gênero)
- Status de conservação das espécies

**2.3. Sistema de Informações de Cuidados**
- Criação de `src/lib/plantCare.js`
- Função `getPlantCareInfo()` - Retorna cuidados por família
- Informações sobre rega, luz, solo, temperatura

### Fase 3: Componentes Principais

**3.1. Componente FlowerCard**
- Exibição de imagem da flor
- Nome comum e científico
- Botão de remoção
- Integração com modal de detalhes

**3.2. Componente FlowerGrid**
- Layout responsivo (1-4 colunas conforme tamanho de tela)
- Filtragem automática de flores sem imagens
- Mensagem quando vazio
- Integração com sistema de loading

**3.3. Componente FlowerDetailModal**
- Modal com informações completas da flor
- Hierarquia taxonómica completa
- Múltiplas imagens da espécie
- Informações de cuidados da planta
- Botões de ação (Like, Add to My Flowers)

**3.4. Componente AddPlantForm**
- Formulário para adicionar plantas pessoais
- Upload de imagem (conversão para base64)
- Validação de campos
- Integração com hook `useFlowers`

### Fase 4: Gestão de Estado

**4.1. Hook useFlowers**
- Gestão da coleção pessoal de plantas
- Persistência em localStorage
- Funções: `addFlower()`, `removeFlower()`, `fetchRandomFlowers()`
- Sincronização entre componentes

**4.2. Hook useFavorites**
- Gestão de flores favoritas
- Persistência em localStorage
- Funções: `addFavorite()`, `removeFavorite()`, `isFavorite()`
- Sistema de sincronização entre páginas e abas
- Substituição automática de favoritos sem imagens

### Fase 5: Páginas da Aplicação

**5.1. Página Home (My Collection)**
- Exibição de plantas pessoais e favoritos
- Sistema de filtros (All Plants / Liked)
- Integração com formulário de adição
- Contadores dinâmicos

**5.2. Página Regions**
- Mapa visual de seleção de regiões
- 5 continentes disponíveis
- Design minimalista e intuitivo

**5.3. Página RegionPlants**
- Listagem de flores por região
- Integração com iNaturalist API
- Botão "See More" para carregar mais flores
- Sistema de paginação e cache
- Modal de detalhes integrado

### Fase 6: Otimizações e Melhorias

**6.1. Performance**
- Sistema de cache para requisições API
- Lazy loading de imagens
- Filtragem de flores sem imagens
- Otimização de re-renderizações

**6.2. Experiência do Utilizador**
- Mensagens de estado vazio personalizadas
- Loading states durante carregamento
- Validação de imagens
- Tratamento de erros

**6.3. Funcionalidades Extras**
- Sistema de favoritos sincronizado
- Adicionar flores das regiões à coleção
- Informações de cuidados baseadas em família
- Múltiplas imagens por espécie

### Fase 7: Deploy e Configuração

**7.1. Configuração para GitHub Pages**
- Ajuste do base path no `vite.config.js`
- Configuração do `BrowserRouter` com basename
- Criação de `404.html` para SPA routing
- Arquivo `.nojekyll` para desabilitar Jekyll

**7.2. CI/CD com GitHub Actions**
- Workflow automático de deploy
- Build e deploy em cada push para master
- Verificação de arquivos gerados
- Deploy automático para GitHub Pages

**7.3. Domínio Personalizado**
- Configuração de CNAME
- Preparação para domínio `flourished.pt`

---

## 🔄 Fluxo de Dados

### 1. Carregamento Inicial
```
App.jsx → Home → useFlowers → localStorage → Exibe plantas
         → useFavorites → localStorage → Exibe favoritos
```

### 2. Adicionar Planta
```
AddPlantForm → useFlowers.addFlower() → localStorage → Atualiza UI
```

### 3. Explorar Regiões
```
Regions → RegionPlants → fetchRegionPlants() → iNaturalist API → Exibe flores
```

### 4. Ver Detalhes
```
FlowerCard → FlowerDetailModal → enrichFlowerWithGBIF() → GBIF API → Exibe detalhes
```

### 5. Adicionar Favorito
```
FlowerDetailModal → useFavorites.addFavorite() → localStorage → Sincroniza → Atualiza UI
```

---

## 💾 Persistência de Dados

**localStorage Keys:**
- `beFlourished_user_plants` - Coleção pessoal de plantas
- `beFlourished_favorites` - Flores favoritas
- `beFlourished_cache_*` - Cache de requisições API (TTL: 2 horas)

**Estrutura dos Dados:**
```javascript
{
  id: "user-1234567890" | "favorite-1234567890",
  name: "Rosa",
  common_name: "Rosa",
  scientific_name: "Rosa rubiginosa",
  image: "data:image/jpeg;base64,..." | "https://...",
  family: "Rosaceae",
  // ... outras propriedades
}
```

---

## 🎨 Design System

**Estilo:** Swiss Minimal Design
- Tipografia: IBM Plex Sans
- Cores: Preto, branco, acentos vermelhos
- Layout: Grid responsivo
- Espaçamento: Sistema de margens consistente
- Animações: Transições suaves

---

## 📊 APIs Utilizadas

### iNaturalist API
- **Endpoint:** `https://api.inaturalist.org/v1/observations`
- **Uso:** Busca de flores por região geográfica
- **Dados retornados:** Nome científico, nome comum, imagens, localização
- **Limitações:** Não requer API key, rate limit implícito

### GBIF API
- **Endpoint:** `https://api.gbif.org/v1/species`
- **Uso:** Informações detalhadas sobre espécies
- **Dados retornados:** Hierarquia taxonómica, status de conservação, mídia adicional
- **Limitações:** Pode ser lento, requer tratamento de erros

---

## 🐛 Desafios Enfrentados

1. **Problema:** Assets não carregando no GitHub Pages (404)
   - **Solução:** Configuração correta do base path e arquivo `.nojekyll`

2. **Problema:** Favoritos não aparecendo quando lista estava vazia
   - **Solução:** Correção da lógica de salvamento no localStorage

3. **Problema:** Imagens quebradas ou faltando
   - **Solução:** Sistema de validação e filtragem de imagens

4. **Problema:** Performance com muitas requisições API
   - **Solução:** Sistema de cache em localStorage com TTL

---

## ✨ Funcionalidades Finais

✅ Sistema completo de coleção pessoal
✅ Exploração de flores por região
✅ Sistema de favoritos sincronizado
✅ Informações detalhadas de espécies
✅ Instruções de cuidados
✅ Design responsivo
✅ Deploy automático
✅ Performance otimizada

---

## 📝 Notas Finais

O projeto foi desenvolvido com foco em:
- **Simplicidade:** Código limpo e organizado
- **Performance:** Cache e otimizações
- **Experiência:** Interface intuitiva e responsiva
- **Manutenibilidade:** Estrutura clara e documentada

Todas as funcionalidades estão operacionais e o projeto está pronto para produção.

