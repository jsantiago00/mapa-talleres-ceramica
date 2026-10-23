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
   | foto_url | Link a una foto (opcional, ver punto 5) | https://… |
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

   En esa misma zona también podés cambiar el **título** (`TITULO`), el **mensaje de bienvenida** (`BIENVENIDA`; si lo dejás vacío no aparece) y poner el **logo** (`LOGO_URL`, el link a una imagen).

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

## 3. Coordenadas (lat / lng)

### Automático (recomendado)

La planilla puede completar `lat` y `lng` sola a partir de la dirección. Se configura una sola vez:

1. En la planilla de respuestas: **Extensiones → Apps Script**.
2. Borrá lo que aparece, pegá todo el contenido de [`apps-script/coordenadas.gs`](apps-script/coordenadas.gs) y tocá el ícono de guardar.
3. Volvé a la planilla y recargala. Aparece un menú nuevo, **Mapa**. Tocá **Mapa → Completar coordenadas**. La primera vez Google pide permiso: elegí tu cuenta, **Configuración avanzada → Ir a ... (no seguro)** y **Permitir**. Es tu propio script, por eso Google avisa.
4. Para que se complete solo cada vez que llega una respuesta: en Apps Script, tocá **Activadores** (el reloj, a la izquierda) → **Agregar activador**. Elegí la función `alEnviarFormulario`, la fuente **De la hoja de cálculo** y el tipo **Al enviar el formulario**, y guardá.

Si la dirección es vaga (por ejemplo, solo el barrio), el script igual pone una ubicación aproximada y deja una **nota** en la celda de `lat` para que la revisen. Conviene mirar en el mapa que cada taller quedó en su lugar antes de aprobarlo.

### A mano, desde Google Maps

1. Buscá el taller en [Google Maps](https://maps.google.com).
2. Hacé **click derecho** justo sobre el lugar. En el celular, mantené apretado el lugar.
3. Arriba del menú aparecen dos números, por ejemplo `-32.9265, -68.8440`. Tocalos y se copian.
4. Pegalos en la columna **lat**, los dos juntos, y tocá **Mapa → Completar coordenadas**: el script los separa en `lat` y `lng` y los deja en el formato correcto.

Ojo si no usás el script: con la planilla en formato argentino, un número con punto (`-32.9265`) se guarda como texto y ese taller **no aparece** en el mapa. Hay que escribirlo con coma (`-32,9265`).

## 4. Aprobar un taller

- Solo aparecen en el mapa los talleres con **`si`** en la columna `aprobado`. Da igual si escribís "si", "Sí" o "SI".
- Para sacar un taller sin borrarlo, cambiá `si` por `no` o dejá la celda vacía.

## 5. Formulario para que se sumen talleres (opcional)

Con un Google Form, cada docente puede pedir sumarse y los datos caen directo en una planilla. La Asamblea solo revisa y aprueba.

1. Entrá a [forms.google.com](https://forms.google.com) y creá un formulario con estas preguntas (los títulos tienen que ser estos):
   **Nombre del taller**, **Tipo de taller**, **Docente**, **Dirección**, **Departamento**, **Días y horarios**, **Instagram**, **WhatsApp**, **Foto**, **Descripción**.

   Para **Foto**, usá el tipo de pregunta **Subir archivo**: permití solo **Imagen**, máximo **1 archivo** y 10 MB. Así cada docente sube la foto desde el celular. Dos cosas a tener en cuenta:
   - Para subir archivos, Google pide que quien completa el formulario tenga cuenta de Google.
   - Las fotos se guardan en tu Drive, en una carpeta con el nombre del formulario y "(File responses)". **Compartí esa carpeta** una vez como "Cualquier persona con el enlace: Lector". Si no, las fotos son privadas y en el mapa aparece la vasija dibujada en su lugar.

   La foto también puede ser un link: el de una imagen en internet (que termine en `.jpg`, `.png`, etc.) o el link para compartir de Google Drive, que el mapa convierte solo. Los links de Instagram y de Google Fotos **no funcionan**, porque no son imágenes sino páginas.
2. En la pestaña **Respuestas**, tocá **Vincular con Hojas de cálculo** para que las respuestas se guarden en una planilla.
3. En esa planilla, agregá a la derecha tres columnas más: **lat**, **lng** y **aprobado**. Las completa la Asamblea al revisar cada taller (ver puntos 3 y 4).
4. **No publiques la hoja de respuestas**: tiene los correos de quienes completan el formulario y los talleres sin aprobar, y lo publicado lo puede ver cualquiera. En su lugar, creá una pestaña nueva llamada `mapa` y escribí en la celda A1:

   ```
   =QUERY('Respuestas de formulario 1'!C:O; "select * where lower(O) = 'si' or lower(O) = 'sí'"; 1)
   ```

   Esa pestaña muestra solo los talleres aprobados, sin la marca temporal ni el correo, y se actualiza sola. Publicá **esa** pestaña como CSV (punto 2) y usá ese link en `SHEET_CSV_URL`. Si agregás o sacás preguntas del formulario, revisá que las letras `C:O` y `O` (la columna `aprobado`) sigan siendo las correctas.
5. Copiá el link del formulario (botón **Enviar**, ícono de link) y pegalo en `FORMULARIO_URL`, en `index.html`.

Así aparece un botón "Sumar mi taller" al final de la lista y un link en el mensaje de bienvenida. Lo que la gente manda no se ve en el mapa hasta que alguien de la Asamblea escribe `si` en `aprobado`.

## 6. Compartir un taller

Cada taller tiene su propio link, que abre el mapa con ese taller ya seleccionado. Se consigue con el botón **Compartir** de la tarjeta, y sirve para que cada docente lo ponga en su Instagram o para nombrarlo en una publicación.

El link sale del nombre del taller (por ejemplo `.../#taller-tierra-cruda`), así que si se le cambia el nombre en la planilla, el link viejo deja de abrirlo.

## 7. Subir el sitio a GitHub Pages

1. Creá una cuenta en [github.com](https://github.com) si no tenés.
2. Creá un repositorio nuevo (botón **New**), por ejemplo `mapa-talleres`, y marcalo como **Public**.
3. Tocá **uploading an existing file** y arrastrá `index.html`, `talleres-ejemplo.csv`, `og-image.png` y `README.md`. Después tocá **Commit changes**.
4. Andá a **Settings → Pages**. En "Branch" elegí **main** y la carpeta **/ (root)**, y tocá **Save**.
5. Al rato (1 o 2 minutos) aparece el link del mapa, del estilo `https://tu-usuario.github.io/mapa-talleres/`. Ese es el link para poner en Instagram.
6. Para que el link se vea lindo al compartirlo (con la imagen `og-image.png`), abrí `index.html` y, cerca del principio, cambiá `content="og-image.png"` por la dirección completa, por ejemplo `content="https://tu-usuario.github.io/mapa-talleres/og-image.png"`.
7. Anotá el dominio en Stadia Maps (ver punto 2) para que se vea el mapa suave.

Para cambiar el título, el logo, la bienvenida o los links más adelante: en GitHub abrí `index.html`, tocá el ícono del lápiz, editá y tocá **Commit changes**.

---

### Para probarlo en la compu (opcional, más técnico)

Abrir `index.html` con doble click no funciona, porque el navegador no deja leer el CSV así. Hay que levantar un servidor local en la carpeta del proyecto:

```bash
python -m http.server 8000
```

y abrir <http://localhost:8000>.
