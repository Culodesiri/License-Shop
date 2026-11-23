# KeyShop · Tienda de licencias de software

Web de venta de licencias hecha con HTML, CSS y JavaScript puro, siguiendo la arquitectura **App → Controller → Type**.

## Cómo ejecutarlo
Los módulos ES y `fetch` necesitan un servidor local: extensión **Live Server** de VS Code, o `python -m http.server` desde esta carpeta y abrir http://localhost:8000.

## Estructura
| Archivo | Responsabilidad |
|---|---|
| `scripts/app.js` (`App`) | Carga el JSON y decide dónde y en qué orden se pintan las secciones |
| `scripts/controllers/licenseController.js` (`LicenseController`) | `RenderFeatured`, `RenderOffers`, `RenderLatest`, `RenderAll` |
| `scripts/types/license.js` (`License`) | Datos de una licencia, `Render(parent)` y `Buy()` (ventana con la clave) |
| `data/licenses.json` | 20 licencias de 3 programas, con 6-7 versiones cada uno (3 destacadas, 3 en oferta) |

## Créditos
Los programas, versiones y claves son ficticios. No se usan imágenes ni librerías externas.
