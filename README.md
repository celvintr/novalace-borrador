# NOVALACE S.A. de C.V. — Sitio web (BORRADOR)

Borrador de diseño del sitio corporativo de **NOVALACE S.A. de C.V.** (fabricación de
cordones, cintas y tejidos angostos — Choloma, Cortés, Honduras), elaborado por **HonduWeb**
para presentar en reunión.

> ⚠️ **Es un borrador estático (HTML/CSS/JS), sin backend.** Los textos, cifras y datos son
> de muestra. El admin es una **maqueta de demostración**. La versión real se construirá sobre
> un CMS con panel administrable.

## Cómo verlo

Es 100% estático: **abra `index.html` en cualquier navegador**. No requiere servidor, Node ni PHP.

Para que el JavaScript (idioma, filtros, chatbot) funcione sin restricciones de `file://`,
puede servirlo localmente:

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: PHP
php -S localhost:8000
```

Luego visite `http://localhost:8000/` (sitio) y `http://localhost:8000/admin/` (panel).

## Qué incluye

### Frontend (`index.html`)
- **Bilingüe ES / EN** con cambio de un clic (selector en el encabezado).
- **Hero** industrial con emblema de cordones trenzados (inspirado en el logo).
- **6 secciones** de la propuesta: Inicio, Nosotros, Productos, Calidad e Innovación,
  NOVABOT y Contacto (+ Proceso).
- **Catálogo interactivo** con filtros por **tipo** (cordones / cintas y tapes / tejidos
  angostos) y **material** (poliéster / algodón / mixto) + búsqueda. Visuales generados por
  SVG con los colores de cada producto.
- **NOVABOT**: chatbot flotante de demostración con respuestas guiadas (bilingüe).
- **Contacto**: formulario, WhatsApp, mapa de Choloma, datos de la empresa.
- **Responsivo** (móvil / tablet / escritorio) con menú hamburguesa.
- Botón flotante de **WhatsApp**.

### Admin (`admin/index.html`) — maqueta
- Login de marca (cualquier credencial ingresa — es demo).
- **Dashboard**: métricas, gráfica de visitas (14 días), productos más vistos, mensajes.
- **Productos**: tabla con categoría, material, colores y estado + modal "Nuevo producto".
- **Mensajes**: bandeja de solicitudes de cotización.
- **Páginas**, **NOVABOT**, **SEO**, **Idiomas**, **Ajustes** (configuración de marca).

## Marca

Colores muestreados del logotipo:

| Uso            | Color      |
|----------------|------------|
| Azul marino    | `#22316F`  |
| Rojo industrial| `#DC121D`  |
| Dorado         | `#F4B400`  |
| Tinta (oscuro) | `#111A3D`  |

Tipografías: **Space Grotesk** (títulos) + **Inter** (cuerpo) vía Google Fonts.

## Estructura

```
NOVALACE/
├─ index.html              # Sitio (una sola página)
├─ admin/
│  ├─ index.html           # Panel administrativo (maqueta)
│  └─ assets/{admin.css, admin.js}
├─ assets/
│  ├─ css/styles.css       # Sistema de diseño del sitio
│  ├─ js/{i18n.js, app.js} # Diccionario ES/EN + lógica
│  └─ img/                 # Logo y favicons
└─ README.md
```

## Pendiente para la versión final
- Reemplazar textos, cifras y fotos con material real de NOVALACE (logo editable, fotos de
  planta/maquinaria/productos, misión/visión, certificaciones reales).
- Conectar el catálogo y el formulario a un CMS/panel real y administrable.
- NOVABOT con IA entrenado con la información de la empresa.
- SEO técnico, Analytics y Search Console en producción; dominio + hosting + SSL.

---
Borrador de diseño © HonduWeb · Contenido de muestra.
