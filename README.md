# Mapa de Talleres de la Asamblea de Cerámica de Mendoza

Un mapa web con los talleres de cerámica de Mendoza avalados por la Asamblea de Ceramistas.
Los talleres se cargan desde una **planilla de Google**: para agregar, cambiar o sacar un taller solo hay que editar la planilla. No hace falta tocar código.

---

## 1. Crear la planilla de Google

1. Entrá a [sheets.google.com](https://sheets.google.com) y creá una planilla nueva.
2. En la **fila 1** escribí estos encabezados, uno por columna y tal cual están acá:

   | nombre | tipo | docente | direccion | departamento | lat | lng | dias_horarios | instagram | whatsapp | foto_url | descripcion | aprobado |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|

   Atajo: abrí el archivo `talleres-ejemplo.csv` de este proyecto, copiá todo y pegalo en la planilla.

3. Cargá un taller por fila. Qué va en cada columna:

   | Columna | Qué poner | Ejemplo |
   |---|---|---|
   | nombre | Nombre del taller | Taller Tierra Cruda |
   | tipo | Uno o varios, separados por coma | torno, esmaltes |
   | docente | Quién da el taller | Laura Gómez |
   | direccion | Calle y número | San Martín 1234 |
   | departamento | Departamento | Godoy Cruz |
   | lat / lng | Coordenadas (ver punto 3) | -32.9265 / -68.8440 |
   | dias_horarios | Texto libre | Lunes y miércoles 18 a 20 h |
   | instagram | El usuario, con o sin @ | @tierracruda |
   | whatsapp | El número con característica | 261 555-0001 |
   | foto_url | Link a una foto (opcional) | https://… |
   | descripcion | Unas líneas sobre el taller | Clases para principiantes… |
   | aprobado | `si` o `no` (ver punto 4) | si |

   Los filtros de **tipo** y **departamento** del mapa se arman solos con lo que escribas. Conviene escribir siempre igual (por ejemplo, siempre "esmaltes" y no a veces "esmaltado").

## 2. Publicar la planilla como CSV

1. En la planilla: **Archivo → Compartir → Publicar en la web**.
2. En "Vínculo", elegí la hoja de los talleres y, en el formato, **Valores separados por comas (.csv)**.
3. Tocá **Publicar** y copiá el link que aparece.
4. Abrí `index.html` y, cerca del principio del script, pegá el link entre las comillas:

   ```js
   const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/....../pub?output=csv';
   ```

   En esa misma zona también podés cambiar el **título** (`TITULO`) y poner el **logo** (`LOGO_URL`, el link a una imagen).

   Ahí mismo está `ESTILO_MAPA`, que define cómo se ve el mapa:

   | Valor | Cómo se ve |
   |---|---|
   | `'suave'` (el que viene puesto) | Limpio y claro, con los nombres de las calles. En modo oscuro cambia solo a un mapa oscuro |
   | `'acuarela'` | Pintado en acuarela, sin nombres de calles |
   | `'osm'` | El mapa clásico de OpenStreetMap, con mucho detalle |

   `'suave'` y `'acuarela'` son de **Stadia Maps**. Son gratis, pero cuando el sitio esté en internet hay que avisarles el dominio una sola vez (no hace falta poner ninguna clave):
   1. Creá una cuenta gratis en [client.stadiamaps.com](https://client.stadiamaps.com/signup/).
   2. Creá una "property" y, en **Authentication → Domains**, agregá el dominio del sitio, por ejemplo `tu-usuario.github.io`.

   Mientras no lo hagas, el mapa pasa solo al estilo clásico de OpenStreetMap, así que nunca queda vacío.

Esto se hace una sola vez. Desde ahí, lo que cambies en la planilla aparece en el mapa solo; Google puede tardar unos 5 minutos en actualizarlo.

> Si el link queda vacío o falla, el mapa muestra los talleres de ejemplo de `talleres-ejemplo.csv`.

## 3. Sacar las coordenadas (lat / lng) desde Google Maps

1. Buscá el taller en [Google Maps](https://maps.google.com).
2. Hacé **click derecho** justo sobre el lugar. En el celular, mantené apretado el lugar.
3. Arriba del menú aparecen dos números, por ejemplo `-32.9265, -68.8440`. Tocalos y se copian.
4. El primero va en **lat** y el segundo en **lng**. Los dos son negativos en Mendoza.

Si pegás los dos números juntos en la columna `lat` y dejás `lng` vacía, también funciona.
Si una fila tiene coordenadas mal cargadas, ese taller no aparece en el mapa, pero el resto sí.

## 4. Aprobar un taller

- Solo aparecen en el mapa los talleres con **`si`** en la columna `aprobado`. Da igual si escribís "si", "Sí" o "SI".
- Para sacar un taller sin borrarlo, cambiá `si` por `no` o dejá la celda vacía.

## 5. Subir el sitio a GitHub Pages

1. Creá una cuenta en [github.com](https://github.com) si no tenés.
2. Creá un repositorio nuevo (botón **New**), por ejemplo `mapa-talleres`, y marcalo como **Public**.
3. Tocá **uploading an existing file** y arrastrá `index.html`, `talleres-ejemplo.csv` y `README.md`. Después tocá **Commit changes**.
4. Andá a **Settings → Pages**. En "Branch" elegí **main** y la carpeta **/ (root)**, y tocá **Save**.
5. Al rato (1 o 2 minutos) aparece el link del mapa, del estilo `https://tu-usuario.github.io/mapa-talleres/`. Ese es el link para poner en Instagram.

Para cambiar el título, el logo o el link de la planilla más adelante: en GitHub abrí `index.html`, tocá el lápiz ✏️, editá y tocá **Commit changes**.

---

### Para probarlo en la compu (opcional, más técnico)

Abrir `index.html` con doble click no funciona, porque el navegador no deja leer el CSV así. Hay que levantar un servidor local en la carpeta del proyecto:

```bash
python -m http.server 8000
```

y abrir <http://localhost:8000>.
