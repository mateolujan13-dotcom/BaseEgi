# NexoSport — Design Spec: Estética, Correcciones y Grafo D3 Mejorado

## 1. Resumen

Mejoras estéticas y funcionales al proyecto NexoSport EGI: corrección de errores (conteo de tablas), eliminación de efectos no deseados (tilt 3D, orbs invisibles), potenciación del hero glow, y rediseño del grafo de relaciones FK con D3.js para ofrecer más información e interacción.

## 2. Cambios ya implementados

### 2.1 Eliminación de tilt 3D en desplegables
- **Archivo:** `assets/js/main.js`
- **Qué:** Se eliminó la función `initTiltCards()` que aplicaba `rotateX`/`rotateY` con `perspective(1000px)` según posición del mouse sobre cada `.glass-card`.
- **Por qué:** Efecto no deseado, consumía recursos innecesarios.
- **Reemplazo:** CSS puro en `assets/css/base.css`:
  ```css
  .glass-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 24px rgba(232,255,0,0.08);
    border-color: rgba(232,255,0,0.35);
  }
  ```

### 2.2 Eliminación de bg-orb
- **Archivo:** `index.html`
- **Qué:** Se eliminaron 3 divs `<div class="bg-orb ...">` del HTML.
- **Por qué:** No tenían estilos CSS asociados, eran invisibles y no aportaban valor.

### 2.3 Hero glow más notorio
- **Archivo:** `index.html`
- **Qué:** Se aumentó tamaño (600→700px, 500→550px), blur (180→200px) y opacidad (0.06→0.1 y 0.08) de los glows decorativos del hero.
- **Por qué:** Eran prácticamente imperceptibles.

### 2.4 Corrección de conteo de tablas
- **Archivo:** `index.html:1432`
- **Qué:** "21 tablas agrupadas en 6 módulos: Usuarios, Catálogo, Inventario, Pedidos, Logística y Mayoristas."
- **Corregido a:** "23 tablas agrupadas en 7 módulos: Usuarios & Roles, Catálogo, Inventario, Pedidos & Pagos, Logística, Mayoristas & CRM y Carrito & Cupones."
- **Por qué:** El esquema real tiene 23 tablas y 7 módulos definidos en `table-data.js`.

## 3. Grafo D3 — Mejoras de interacción e información

### 3.1 Estado actual
El archivo `assets/js/d3-graph.js` implementa un grafo force-directed con D3.js v7. Actualmente:
- Nodos (tablas) con color por módulo
- Aristas con flechas (FK) entre tablas
- Hover con tooltip flotante (nombre, módulo, columnas, relaciones)
- Zoom/pan con scroll y arrastre de fondo
- Nodos arrastrables

### 3.2 Mejora: Click para sidebar informativo

**Trigger:** Click sobre un nodo del grafo.

**Comportamiento:**
- Se abre un panel fijo (sidebar) en el lado derecho del contenedor del grafo
- El grafo se reajusta al ancho restante (no se deforma)
- El panel contiene información detallada de la tabla seleccionada:
  - **Nombre** de la tabla (título, color del módulo)
  - **Módulo** al que pertenece (label + color)
  - **Grado** (cantidad total de conexiones FK)
  - **Columnas** (lista completa con indicador visual PK / FK / CHECK / etc.)
  - **Relaciones FK salientes** → nombre de tabla destino
  - **Relaciones FK entrantes** ← nombre de tabla origen
- Botón **"Cerrar"** (✕) o click fuera del panel para cerrar
- Al hacer click en otra tabla, el panel se actualiza con la nueva info

**Estilo del sidebar:**
- Fondo semi-oscuro (`#111118`), borde izquierdo con color del módulo
- Tipografía: JetBrains Mono para datos técnicos, Instrument Sans para texto general
- Scroll interno si el contenido es largo
- Animación de entrada (slide desde la derecha)

### 3.3 Mejora: Doble click para aislar

**Trigger:** Doble click sobre un nodo del grafo.

**Comportamiento:**
- El nodo clickeado y sus vecinos directos (1 grado de separación) mantienen opacidad total
- Todos los demás nodos se atenúan (opacidad ~0.15)
- Las aristas conectadas al grupo se mantienen visibles con opacidad normal; el resto se atenúa
- La leyenda y hint permanecen visibles
- Al hacer click en cualquier parte del fondo del grafo (no sobre un nodo), se restaura la vista completa
- Alternativamente, un botón "Restaurar vista" aparece mientras está aislado

### 3.4 Arquitectura técnica

**Archivos afectados:**
- `assets/js/d3-graph.js` (modificar función `initD3Graph`)
- `assets/css/base.css` (agregar estilos del sidebar)
- `index.html` (sin cambios, el contenedor `#d3-graph` existe)

**Estructura del código:**
```
initD3Graph()
├── setup existente (SVG, simulación, zoom, nodos, aristas)
├── click handler → toggleSidebar(nodeData)
│   ├── renderSidebar(d) — construye HTML del panel
│   ├── updateGraphSelection(d) — resalta nodo seleccionado
│   └── closeSidebar() — oculta panel + restaura selección
└── dblclick handler → isolateNode(nodeData)
    ├── dimNonNeighbors(nodeId) — atenúa nodos no conectados
    └── restoreView() — restaura vista completa
```

**Datos del sidebar:** Provienen de `DB_NODES`, `DB_MODULES`, `DB_LINKS` y `DB_TABLES` (definidos en `table-data.js`).

### 3.5 Interacciones completas del grafo

| Acción | Comportamiento |
|--------|----------------|
| Hover | Tooltip flotante (existente, sin cambios) |
| Click | Abre sidebar con info detallada |
| Click en otro nodo | Sidebar se actualiza |
| Click en fondo | Cierra sidebar (si abierto) |
| Doble click | Aísla nodo + vecinos |
| Click en fondo (modo aislado) | Restaura vista completa |
| Arrastrar nodo | Reposiciona nodo (existente) |
| Scroll | Zoom in/out (existente) |
| Arrastrar fondo | Pan (existente) |

## 4. Archivos involucrados

| Archivo | Cambio |
|---------|--------|
| `index.html` | Eliminar bg-orb, hero glow + notorio, corregir conteo tablas |
| `assets/js/main.js` | Eliminar initTiltCards() y su llamado |
| `assets/css/base.css` | Agregar .glass-card:hover, estilos del sidebar |
| `assets/js/d3-graph.js` | Agregar click→sidebar, doble click→aislar |
| `assets/js/table-data.js` | Sin cambios (datos ya completos) |

## 5. No incluido (por decisión)

- Filtro por módulos (no requerido)
- Buscador de tablas (no requerido)
- Animaciones excesivas (priorizar rendimiento)
- Three.js / particle background (eliminados en commit anterior)
