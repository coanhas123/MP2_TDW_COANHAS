# 📋 Relatório: Requisitos do Projeto

Este documento explica como o projeto **Flourished** atende aos requisitos específicos do relatório.

---

## ✅ 1. Development of a Single Page Application in React

### O que é uma Single Page Application (SPA)?

Uma SPA é uma aplicação web que carrega uma única página HTML e atualiza dinamicamente o conteúdo sem recarregar a página completa.

### Como o projeto implementa SPA:

#### 1.1. **React Router DOM para Navegação Client-Side**

**Arquivo:** `src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  const basename = import.meta.env.PROD ? '/MP2_TDW_COANHAS' : '';
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/region/:region" element={<RegionPlants />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Explicação:**
- O `BrowserRouter` gerencia o histórico de navegação sem recarregar a página
- As rotas são definidas com componentes React, não arquivos HTML separados
- A navegação entre páginas é instantânea, sem recarregar a página completa
- O estado da aplicação é mantido durante a navegação

#### 1.2. **Arquivo HTML Único**

**Arquivo:** `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Flourished</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

**Explicação:**
- Apenas um arquivo HTML serve como base
- Todo o conteúdo é renderizado dinamicamente pelo React no elemento `#root`
- Não há múltiplas páginas HTML - tudo é gerenciado pelo JavaScript

#### 1.3. **Renderização Dinâmica**

**Arquivo:** `src/index.jsx`

```javascript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Explicação:**
- React renderiza toda a aplicação no elemento `#root`
- Componentes são atualizados dinamicamente quando o estado muda
- Não há recarregamento de página - apenas atualização de componentes

---

## ✅ 2. Dynamic data structure, obtained through the use of an external API

### Como o projeto obtém dados dinâmicos de APIs externas:

#### 2.1. **Integração com iNaturalist API**

**Arquivo:** `src/lib/regions.js`

```javascript
// Endpoint da API
const INATURALIST_BASE = 'https://api.inaturalist.org/v1';

// Função que busca flores por região
export async function fetchRegionPlants(region, apiKey, type = 'all', page = 1) {
  const placeId = INATURALIST_PLACES[region];
  
  const url = `${INATURALIST_BASE}/observations`;
  const params = new URLSearchParams({
    place_id: placeId,
    taxon_id: 12, // Apenas plantas com flores
    per_page: 30,
    page: page,
    quality_grade: 'research',
    photos: true, // Apenas observações com fotos
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();
  
  // Transforma dados da API em estrutura uniforme
  return data.results.map(observation => ({
    scientific_name: observation.taxon?.name,
    common_name: observation.taxon?.preferred_common_name,
    image: observation.photos[0]?.url,
    // ... mais campos
  }));
}
```

**Explicação:**
- **API Externa:** iNaturalist (https://api.inaturalist.org/v1)
- **Dados Dinâmicos:** Busca dados em tempo real quando o usuário explora regiões
- **Estrutura Dinâmica:** Dados são transformados em formato uniforme para uso na aplicação
- **Sem API Key:** API gratuita, não requer autenticação

#### 2.2. **Integração com GBIF API**

**Arquivo:** `src/lib/gbif.js`

```javascript
// Endpoint da API
const GBIF_BASE = 'https://api.gbif.org/v1';

// Enriquece flor com dados detalhados
export async function enrichFlowerWithGBIF(flower) {
  const scientificName = flower.scientific_name;
  
  // Busca informações da espécie
  const speciesUrl = `${GBIF_BASE}/species/search?q=${encodeURIComponent(scientificName)}`;
  const speciesResponse = await fetch(speciesUrl);
  const speciesData = await speciesResponse.json();
  
  if (speciesData.results && speciesData.results.length > 0) {
    const species = speciesData.results[0];
    
    return {
      ...flower,
      kingdom: species.kingdom,
      phylum: species.phylum,
      class: species.class,
      order: species.order,
      family: species.family,
      genus: species.genus,
      conservationStatus: species.threatStatuses?.[0],
      // ... mais dados
    };
  }
  
  return flower;
}
```

**Explicação:**
- **API Externa:** GBIF (https://api.gbif.org/v1)
- **Dados Enriquecidos:** Adiciona informações taxonómicas detalhadas
- **Estrutura Dinâmica:** Dados são mesclados com os dados existentes da flor
- **Opcional:** Funciona mesmo se a API falhar (graceful degradation)

#### 2.3. **Estrutura de Dados Dinâmica**

**Estrutura resultante:**

```javascript
{
  // Dados da API iNaturalist
  scientific_name: "Rosa rubiginosa",
  common_name: "Rose",
  image: "https://...",
  
  // Dados enriquecidos da GBIF
  kingdom: "Plantae",
  phylum: "Tracheophyta",
  class: "Magnoliopsida",
  order: "Rosales",
  family: "Rosaceae",
  genus: "Rosa",
  conservationStatus: "LC",
  
  // Múltiplas imagens
  images: ["url1", "url2", "url3"],
  
  // Dados do usuário
  id: "user-1234567890",
  notes: "Planted in 2024"
}
```

**Explicação:**
- Estrutura adaptável conforme dados disponíveis
- Mescla dados de múltiplas APIs
- Suporta dados adicionados pelo usuário
- Validação de campos obrigatórios

---

## ✅ 3. Include dynamic listings of elements obtained through the API

### Como o projeto exibe listagens dinâmicas:

#### 3.1. **Listagem de Flores por Região**

**Arquivo:** `src/pages/RegionPlants.jsx`

```javascript
// Estado para armazenar flores da API
const [flowers, setFlowers] = useState([]);
const [loading, setLoading] = useState(true);

// Busca flores da API ao carregar a página
useEffect(() => {
  async function loadFlowers() {
    setLoading(true);
    const data = await fetchRegionPlants(region, null, 'all', 1);
    setFlowers(data);
    setLoading(false);
  }
  loadFlowers();
}, [region]);

// Renderiza listagem dinâmica
<FlowerGrid
  flowers={flowers}
  loading={loading}
  onCardClick={handleCardClick}
/>
```

**Explicação:**
- **Dinâmico:** Lista é preenchida com dados da API em tempo real
- **Atualização:** Lista muda conforme região selecionada
- **Paginação:** Botão "See More" carrega mais elementos
- **Loading State:** Mostra animação enquanto carrega

#### 3.2. **Componente de Grid Dinâmico**

**Arquivo:** `src/components/FlowerGrid.jsx`

```javascript
export default function FlowerGrid({ flowers, loading, onRemove, onCardClick }) {
  // Filtra flores sem imagens
  const visibleFlowers = flowers.filter(flower => {
    return hasValidImage(flower);
  });

  // Renderiza lista dinâmica
  return (
    <div className="flower-grid">
      {visibleFlowers.map((flower) => (
        <FlowerCard
          key={flower.id}
          flower={flower}
          onRemove={onRemove}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
```

**Explicação:**
- **Listagem Dinâmica:** Usa `.map()` para criar elementos dinamicamente
- **Filtragem:** Remove elementos sem dados válidos
- **Chave Única:** Cada elemento tem `key` para otimização do React
- **Adaptável:** Tamanho da lista varia conforme dados da API

#### 3.3. **Exemplos de Listagens Dinâmicas:**

**3.3.1. Coleção Pessoal (My Collection)**
```javascript
// Lista plantas do usuário
const userPlants = flowers.filter(flower => {
  return flower.id.startsWith('user-');
});

// Renderiza dinamicamente
<FlowerGrid flowers={userPlants} />
```

**3.3.2. Favoritos (Liked)**
```javascript
// Lista favoritos
const favorites = useFavorites();

// Renderiza dinamicamente
<FlowerGrid flowers={favorites} />
```

**3.3.3. Múltiplas Imagens na Modal**
```javascript
// Lista de imagens da API GBIF
{gbifData?.images?.map((image, index) => (
  <img key={index} src={image.url} alt={flower.common_name} />
))}
```

---

## ✅ 4. Creation of mechanisms that allow the information displayed to be dynamically altered through operations performed by the end user

### Como o projeto permite operações CRUD pelo usuário:

#### 4.1. **ADD (Adicionar)**

**4.1.1. Adicionar Planta Pessoal**

**Arquivo:** `src/components/AddPlantForm.jsx`

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  const newPlant = {
    name: formData.name,
    scientific: formData.scientific,
    image: imagePreview, // Base64
  };
  
  // Adiciona à coleção
  onAddPlant(newPlant);
  
  // Limpa formulário
  setFormData({ name: '', scientific: '', image: '' });
};
```

**Arquivo:** `src/hooks/useFlowers.js`

```javascript
const addFlower = useCallback((newFlower) => {
  const flowerWithId = { 
    ...newFlower, 
    id: `user-${Date.now()}`, // ID único
  };
  
  // Atualiza estado
  setFlowers((prev) => [flowerWithId, ...prev]);
  
  // Salva no localStorage automaticamente
}, []);
```

**Fluxo:**
1. Usuário preenche formulário
2. Upload de imagem (converte para base64)
3. Chama `addFlower()` do hook
4. Estado é atualizado imediatamente
5. Dados são salvos no localStorage
6. UI é atualizada automaticamente (React re-render)

**4.1.2. Adicionar aos Favoritos**

**Arquivo:** `src/components/FlowerDetailModal.jsx`

```javascript
const handleAddToCollection = () => {
  if (onAddToCollection) {
    onAddToCollection(flower);
    // UI atualiza automaticamente
  }
};
```

**Arquivo:** `src/hooks/useFavorites.js`

```javascript
const addFavorite = useCallback((flower) => {
  setFavorites(currentFavorites => {
    // Verifica se já existe
    const isAlreadyFavorite = currentFavorites.some(
      fav => fav.scientific_name === flower.scientific_name
    );
    
    if (isAlreadyFavorite) {
      return currentFavorites; // Não duplica
    }
    
    // Adiciona novo favorito
    const favoriteFlower = {
      ...flower,
      id: `favorite-${Date.now()}`,
    };
    
    return [...currentFavorites, favoriteFlower];
  });
}, []);
```

**Fluxo:**
1. Usuário clica em "♥ Like" no modal
2. Chama `addFavorite()` do hook
3. Estado é atualizado imediatamente
4. Salvo no localStorage
5. Sincroniza com outras páginas/abas
6. UI atualiza mostrando "✓ Liked"

#### 4.2. **DELETE (Remover)**

**4.2.1. Remover Planta da Coleção**

**Arquivo:** `src/components/FlowerCard.jsx`

```javascript
const handleRemove = () => {
  if (onRemove && flower.id) {
    onRemove(flower.id);
  }
};

// Botão de remoção
<button onClick={handleRemove} className="remove-btn">
  ×
</button>
```

**Arquivo:** `src/hooks/useFlowers.js`

```javascript
const removeFlower = useCallback((id) => {
  // Remove do estado
  setFlowers((prev) => prev.filter((flower) => flower.id !== id));
  
  // Atualiza localStorage automaticamente
  // (via useEffect que monitora mudanças em flowers)
}, []);
```

**Fluxo:**
1. Usuário clica no botão "×" no cartão
2. Chama `removeFlower(id)`
3. Estado é filtrado removendo o item
4. localStorage é atualizado automaticamente
5. UI atualiza removendo o cartão da tela

**4.2.2. Remover dos Favoritos**

**Arquivo:** `src/hooks/useFavorites.js`

```javascript
const removeFavorite = useCallback((flowerId) => {
  setFavorites(currentFavorites => {
    // Filtra removendo o favorito
    return currentFavorites.filter(fav => fav.id !== flowerId);
  });
}, []);
```

#### 4.3. **READ (Ler/Visualizar)**

**4.3.1. Visualizar Detalhes**

**Arquivo:** `src/components/FlowerDetailModal.jsx`

```javascript
// Abre modal ao clicar no cartão
const handleCardClick = (flower) => {
  setSelectedFlower(flower);
  setIsModalOpen(true);
};

// Modal exibe informações dinâmicas
<FlowerDetailModal
  flower={selectedFlower}
  isOpen={isModalOpen}
  onClose={handleCloseModal}
/>
```

**Explicação:**
- Modal carrega dados dinamicamente
- Busca informações adicionais da API GBIF
- Exibe múltiplas imagens
- Mostra informações de cuidados

#### 4.4. **UPDATE (Atualizar)**

**4.4.1. Atualização Automática do Estado**

O React atualiza a UI automaticamente quando o estado muda:

```javascript
// Estado é atualizado
setFlowers([...flowers, newFlower]);

// React detecta mudança e re-renderiza componentes
// UI atualiza automaticamente sem recarregar página
```

**4.4.2. Sincronização Entre Componentes**

**Arquivo:** `src/hooks/useFavorites.js`

```javascript
// Evento customizado para sincronizar
const FAVORITES_CHANGED_EVENT = 'favorites-changed';

// Quando favoritos mudam, dispara evento
useEffect(() => {
  saveFavorites(favorites);
  triggerFavoritesSync(); // Dispara evento
}, [favorites]);

// Outros componentes ouvem o evento
useEffect(() => {
  const handleChange = () => {
    reloadFavorites(); // Recarrega dados
  };
  
  window.addEventListener(FAVORITES_CHANGED_EVENT, handleChange);
}, []);
```

**Explicação:**
- Mudanças em um componente atualizam outros automaticamente
- Sincronização entre páginas e abas do navegador
- Sem necessidade de recarregar a página

---

## 📊 Resumo das Operações CRUD

| Operação | Componente | Hook | Persistência |
|----------|-----------|------|--------------|
| **CREATE** | AddPlantForm | useFlowers.addFlower() | localStorage |
| **CREATE** | FlowerDetailModal | useFavorites.addFavorite() | localStorage |
| **READ** | FlowerGrid | useFlowers / useFavorites | - |
| **READ** | FlowerDetailModal | - | API GBIF |
| **UPDATE** | React State | setState() | Automático |
| **DELETE** | FlowerCard | useFlowers.removeFlower() | localStorage |
| **DELETE** | FlowerCard | useFavorites.removeFavorite() | localStorage |

---

## 🔄 Fluxo Completo de Dados Dinâmicos

```
┌─────────────────┐
│   API Externa   │ (iNaturalist, GBIF)
│                 │
└────────┬────────┘
         │ fetch()
         ▼
┌─────────────────┐
│   React State   │ (useState)
│                 │
└────────┬────────┘
         │ setState()
         ▼
┌─────────────────┐
│   Componentes   │ (FlowerGrid, FlowerCard)
│                 │
└────────┬────────┘
         │ user action
         ▼
┌─────────────────┐
│   Operações     │ (add, remove, update)
│   CRUD          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  localStorage   │ (Persistência)
│                 │
└─────────────────┘
```

---

## 🎯 Pontos-Chave para o Relatório

1. **SPA React:**
   - ✅ Navegação client-side com React Router
   - ✅ Uma única página HTML
   - ✅ Renderização dinâmica sem recarregar

2. **Dados Dinâmicos de APIs:**
   - ✅ Integração com iNaturalist API
   - ✅ Integração com GBIF API
   - ✅ Estrutura de dados adaptável

3. **Listagens Dinâmicas:**
   - ✅ Listas geradas a partir de arrays
   - ✅ Atualização em tempo real
   - ✅ Filtragem e paginação

4. **Operações CRUD:**
   - ✅ CREATE: Adicionar plantas e favoritos
   - ✅ READ: Visualizar detalhes
   - ✅ UPDATE: Atualização automática de estado
   - ✅ DELETE: Remover plantas e favoritos
   - ✅ Todas as operações atualizam UI dinamicamente

---

## 📝 Exemplos de Código para o Relatório

### Exemplo 1: Buscar Dados da API
```javascript
const [flowers, setFlowers] = useState([]);

useEffect(() => {
  fetchRegionPlants('europa').then(data => {
    setFlowers(data); // Atualiza lista dinamicamente
  });
}, []);
```

### Exemplo 2: Listagem Dinâmica
```javascript
{flowers.map(flower => (
  <FlowerCard key={flower.id} flower={flower} />
))}
```

### Exemplo 3: Adicionar Elemento
```javascript
const addFlower = (newFlower) => {
  setFlowers(prev => [...prev, newFlower]); // UI atualiza automaticamente
};
```

### Exemplo 4: Remover Elemento
```javascript
const removeFlower = (id) => {
  setFlowers(prev => prev.filter(f => f.id !== id)); // UI atualiza automaticamente
};
```

---

## ✅ Conclusão

O projeto **Flourished** implementa completamente todos os requisitos:

1. ✅ **SPA React** - Navegação client-side sem recarregar páginas
2. ✅ **Dados Dinâmicos** - Obtidos de APIs externas (iNaturalist, GBIF)
3. ✅ **Listagens Dinâmicas** - Elementos renderizados a partir de dados da API
4. ✅ **Operações CRUD** - Add, Delete, Read, Update com atualização dinâmica da UI

Todas as operações são reativas e atualizam a interface instantaneamente, sem necessidade de recarregar a página.

