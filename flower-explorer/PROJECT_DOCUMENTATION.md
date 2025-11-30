# ME FLOWERS - Project Documentation

## Project Overview

**ME FLOWERS** is a React-based web application for exploring and managing a personal collection of flowering plants. The application allows users to:
- View flowers from different geographic regions (Europe, Asia, Africa, South America, Central America)
- Add personal plants to their collection with photos
- Save favorite flowers from regional collections
- View detailed information about each flower including taxonomic data, conservation status, and care instructions

## Architecture

### Technology Stack
- **React** - UI library for building components
- **React Router** - Client-side routing
- **Vite** - Build tool and development server
- **iNaturalist API** - Free API for flower/plant data (no API key required)
- **GBIF API** - Global Biodiversity Information Facility for detailed species data
- **localStorage** - Browser storage for persistence

### Design System
- **Swiss Design Principles**: Minimal, clean, grid-based, typographic
- **Color Palette**: Neutral grays with red accent (#E63946)
- **Typography**: IBM Plex Sans (Helvetica-inspired)
- **Responsive**: Mobile-first, adapts to tablet and desktop

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx       # Navigation header
│   ├── FlowerCard.jsx   # Individual flower card
│   ├── FlowerGrid.jsx   # Grid container for cards
│   ├── FlowerDetailModal.jsx  # Detailed flower information modal
│   ├── AddPlantForm.jsx # Form for adding personal plants
│   └── Loader.jsx       # Loading spinner
│
├── pages/               # Page components
│   ├── Regions.jsx      # World map with region selection
│   └── RegionPlants.jsx # Flowers from specific region
│
├── hooks/               # Custom React hooks
│   ├── useFlowers.js    # Manages user's personal plants
│   └── useFavorites.js  # Manages liked flowers from regions
│
├── lib/                 # Utility libraries
│   ├── regions.js       # iNaturalist API integration
│   ├── gbif.js          # GBIF API integration
│   └── plantCare.js     # Plant care information database
│
├── App.jsx              # Main app component with routing
├── index.jsx            # Application entry point
└── index.css            # Global styles (Swiss design system)
```

## Key Features

### 1. Personal Collection (Home Page)
- **My Flowers**: User's own plants added via form
- **Liked**: Flowers saved from regional collections
- Filter tabs to switch between views
- Image upload support (converts to base64)
- Persistent storage (survives browser refresh)

### 2. Regional Exploration
- Interactive world map with clickable regions
- 5 regions: Europe, Asia, Africa, South America, Central America
- "See More" button to load additional flowers (20 at a time)
- Random selection from ~500,000 flower database

### 3. Flower Detail Modal
- Scientific and common names
- Taxonomic hierarchy (Kingdom → Species)
- Conservation status
- Multiple images
- Plant care instructions
- Additional data from GBIF API
- "Like" button (adds to favorites)
- "Add to My Flowers" button (adds to personal collection)

### 4. Data Management
- **localStorage**: All user data persists locally
- **Sync**: Changes sync across browser tabs using custom events
- **Image Validation**: Only flowers with valid images are displayed
- **Auto-replace**: Flowers without images are automatically replaced

## Data Flow

### Adding a Personal Plant
1. User fills out `AddPlantForm`
2. Form validates input (name required)
3. Image converted to base64 string
4. `useFlowers.addFlower()` called
5. Plant saved to localStorage
6. Component re-renders with new plant

### Viewing Regional Flowers
1. User selects a region from map
2. `RegionPlants` component loads
3. `fetchRegionPlants()` calls iNaturalist API
4. API returns flower observations
5. Data grouped by species (deduplicated)
6. Only flowers with images are displayed
7. Results cached for 2 hours

### Liking a Flower
1. User clicks "Like" button in modal
2. `useFavorites.addFavorite()` called
3. Flower saved to localStorage
4. Custom event triggers sync
5. All components update

## API Integration

### iNaturalist API
- **Endpoint**: `https://api.inaturalist.org/v1/observations`
- **No API Key Required**
- **Filters**: 
  - `iconic_taxa=Plantae` (plants only)
  - `term_id=12` (flowering plants)
  - `place_id` (geographic region)
  - `photos=true` (only observations with photos)
- **Returns**: Flower observations with images, taxonomic data, location

### GBIF API
- **Endpoint**: `https://api.gbif.org/v1`
- **Purpose**: Enhanced species information
- **Data**: Descriptions, vernacular names, occurrence counts, threat status
- **Caching**: Responses cached to reduce API calls

## State Management

### useFlowers Hook
- Manages user's personal plants
- Loads from localStorage on mount
- Replaces plants without images automatically
- Syncs across tabs via custom events
- Storage key: `beFlourished_user_plants`

### useFavorites Hook
- Manages liked flowers from regions
- Loads from localStorage on mount
- Replaces favorites without images automatically
- Syncs across tabs via custom events
- Storage key: `beFlourished_favorites`

## Component Communication

### Props Flow
- **Parent → Child**: Data flows down via props
- **Child → Parent**: Events flow up via callbacks
- **Sibling Components**: Communicate via shared hooks and localStorage

### Event System
- Custom events for cross-component sync
- `user-plants-changed`: Triggers when personal plants change
- `favorites-changed`: Triggers when favorites change
- Components listen for events and reload data

## Routing

### Routes
- `/` - Home page (My Collection)
- `/regions` - Regions selection page
- `/region/:region` - Flowers from specific region
  - Parameters: `europa`, `asia`, `africa`, `south-america`, `central-america`

### Navigation
- Client-side routing (no page reloads)
- Uses React Router's `BrowserRouter`
- URL parameters extracted with `useParams()`

## Image Handling

### Image Sources
1. User-uploaded images (base64)
2. API images (URLs from iNaturalist)
3. GBIF media (additional images)

### Image Validation
- Checks for valid, non-empty URLs
- Handles multiple property names (`image`, `default_image.medium_url`)
- Filters out broken/missing images
- Cards without images are not created

## Performance Optimizations

### Caching
- API responses cached in localStorage (2 hours TTL)
- Reduces API calls
- Faster page loads

### Lazy Loading
- Images use `loading="lazy"` attribute
- Only loads images when visible

### State Management
- Only necessary re-renders
- useCallback for stable function references
- Memoization where appropriate

## Error Handling

### API Errors
- Try-catch blocks around API calls
- User-friendly error messages
- Graceful degradation (empty states)

### Image Errors
- onError handlers on img tags
- Fallback to "NO IMAGE" placeholder
- Automatic replacement from API

### localStorage Errors
- Try-catch around storage operations
- Handles quota exceeded errors
- Validates data before storing

## Future Enhancements

Potential improvements:
- Search functionality
- Advanced filtering (by family, color, etc.)
- User accounts (cloud sync)
- Export collection as PDF
- Plant care reminders
- Photo upload to cloud storage

## Dependencies

Key npm packages:
- `react` - UI library
- `react-dom` - DOM rendering
- `react-router-dom` - Routing

All dependencies listed in `package.json`.

## Development

### Running the Project
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

### Project Structure Notes
- All components use functional components with hooks
- No class components
- Modern React patterns (React 18+)
- ES6+ JavaScript features





