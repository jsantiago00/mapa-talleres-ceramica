# Mapa de talleres de la Asamblea de Cerámica de Mendoza

Mapa web de talleres de cerámica del Gran Mendoza avalados por la Asamblea de Ceramistas. Lo mantiene gente no técnica y la mayoría lo abre desde un link en Instagram (mobile-first).

## Restricciones
- Un solo `index.html` (HTML + CSS + JS inline), sin build ni frameworks. Librerías por CDN (cdnjs) con versión fija: Leaflet 1.9.4, Leaflet.markercluster 1.5.3, PapaParse 5.4.1.
- Nada que requiera API keys en el código. CARTO pide key desde 2026: no usarlo. El mapa es Stadia Maps (dominio `santiagososa.com.ar` anotado en su panel); si Stadia no autoriza, la app pasa sola a OpenStreetMap (Stadia responde una imagen de "401", no un error, por eso se prueba con `fetch` antes de elegir la capa).
- No usar emojis, ni en la interfaz ni en los textos: se usan íconos SVG propios (`ICONOS` en `index.html`).
- Estética cálida: terracota, arcilla y crema; Fraunces + Nunito; modo claro/oscuro con variables CSS en `:root` y `:root[data-theme="dark"]`.
- Textos en español rioplatense (voseo).

## Datos
- Los talleres salen de un Google Sheet publicado como CSV (`SHEET_CSV_URL`). Las respuestas del Google Form (`FORMULARIO_URL`) caen en "Respuestas de formulario 1"; se publica una pestaña `mapa` con `QUERY` que deja solo los aprobados y sin el correo. Nunca publicar la hoja de respuestas.
- Google tarda unos 5 minutos en actualizar el CSV publicado.
- Los encabezados se normalizan y pasan por `ALIAS_COLUMNAS` (los títulos de las preguntas del form, como "Nombre del taller", ya están mapeados).
- `apps-script/coordenadas.gs` se pega en la planilla y completa `lat`/`lng` desde la dirección. La planilla está en formato argentino (coma decimal).
- Las fotos pueden ser links de Google Drive (pregunta "Subir archivo" del form): `fuentesFoto()` los convierte a la imagen directa.

## Publicación
- Repo `jsantiago00/mapa-talleres-ceramica`, GitHub Pages desde `main`, en https://santiagososa.com.ar/mapa-talleres-ceramica/
- `og-image.png` (vista previa al compartir) se genera desde `herramientas/og-imagen.html` con una captura de 1200×630.
- Para probar en local: `python -m http.server 8000` y abrir http://localhost:8000. Probar siempre en un viewport de celular.
