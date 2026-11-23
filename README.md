# RetroKeys 95 · Tienda de licencias de software

Web de venta de licencias hecha con HTML, CSS y JavaScript puro, siguiendo la arquitectura **App → Controller → Type**, con estética de escritorio de los 90: cada licencia es un disquete, cada sección una ventana y la compra abre un "instalador" que revela la clave.

## Cómo ejecutarlo
Los módulos ES y `fetch` necesitan un servidor local: extensión **Live Server** de VS Code, o `python -m http.server` desde esta carpeta y abrir http://localhost:8000.

## Estructura
```
index.html
style.css
data/licenses.json
images/            (iconos SVG de los programas)
scripts/
  app.js
  controllers/licenseController.js
  types/license.js
```

| Archivo | Responsabilidad |
|---|---|
| `app.js` (`App`) | Carga el JSON y decide dónde y en qué orden se pintan las secciones |
| `licenseController.js` (`LicenseController`) | `RenderFeatured`, `RenderOffers`, `RenderLatest`, `RenderAll` y la lógica de filtrado |
| `license.js` (`License`) | Datos de una licencia, `Render(parent)` y `Buy()` (ventana con la clave) |
| `licenses.json` | 30 licencias de 5 programas, 6 versiones de cada uno |

## Secciones (en orden)
1. **Todas las licencias** (las 30, en orden aleatorio) con filtros por texto, programa, categoría y "solo ofertas".
2. **Ofertas**: las 3 con más descuento.
3. **Destacados**: los 3 primeros.
4. **Últimas versiones**: las 3 últimas versiones de cada programa.

## Extras
Filtros en la sección principal, categorías (cada una con su color de disquete), iconos SVG propios, instalador animado al comprar, botón para copiar la clave y barra de tareas con navegación y reloj.

## Créditos
Los programas, versiones y claves son ficticios. Los iconos son SVG creados para el proyecto. No se usan librerías externas.
