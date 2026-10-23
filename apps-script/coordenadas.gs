/**
 * Completa lat y lng de los talleres a partir de la dirección y el departamento.
 *
 * Se pega en la planilla de respuestas: Extensiones > Apps Script (ver README, punto 3).
 * Agrega un menú "Mapa" a la planilla y, si se configura el activador, corre solo
 * cada vez que alguien manda el formulario.
 *
 * Qué hace en cada fila:
 * - Si lat y lng ya son números, no la toca.
 * - Si pegaron las coordenadas como texto (por ejemplo "-32.9265, -68.8440" todo en lat,
 *   o con punto decimal), las convierte en números y las separa en lat y lng.
 * - Si están vacías, las busca con la dirección. Cuando la ubicación es aproximada
 *   (por ejemplo, solo encontró el barrio), deja una nota en la celda para revisarla.
 */

// Nombre de la pestaña donde caen las respuestas del formulario
const HOJA_RESPUESTAS = 'Respuestas de formulario 1';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Mapa')
    .addItem('Completar coordenadas', 'completarCoordenadas')
    .addToUi();
}

// Para el activador "Al enviar el formulario"
function alEnviarFormulario() {
  completarCoordenadas();
}

function completarCoordenadas() {
  const planilla = SpreadsheetApp.getActive();
  const hoja = planilla.getSheetByName(HOJA_RESPUESTAS);
  if (!hoja) throw new Error(`No encuentro la pestaña "${HOJA_RESPUESTAS}"`);

  const datos = hoja.getDataRange().getValues();
  const encabezados = datos[0].map(h => String(h).trim().toLowerCase());
  const columna = nombre => encabezados.indexOf(nombre);
  const cDireccion = columna('dirección');
  const cDepartamento = columna('departamento');
  const cLat = columna('lat');
  const cLng = columna('lng');
  if (cDireccion < 0 || cLat < 0 || cLng < 0) {
    throw new Error('Faltan las columnas "Dirección", "lat" o "lng"');
  }

  // Busca dentro del Gran Mendoza
  const geocoder = Maps.newGeocoder()
    .setRegion('ar')
    .setLanguage('es')
    .setBounds(-33.3, -69.1, -32.6, -68.5);

  let completadas = 0;
  const aRevisar = [];

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    const lat = fila[cLat];
    const lng = fila[cLng];
    if (typeof lat === 'number' && typeof lng === 'number') continue;

    const celdaLat = hoja.getRange(i + 1, cLat + 1);
    const celdaLng = hoja.getRange(i + 1, cLng + 1);

    // Coordenadas pegadas como texto
    const pegadas = leerCoordenadas(lat, lng);
    if (pegadas) {
      celdaLat.setValue(pegadas[0]);
      celdaLng.setValue(pegadas[1]);
      completadas++;
      continue;
    }

    // Buscar por dirección
    const direccion = String(fila[cDireccion]).trim();
    if (!direccion) continue;
    const departamento = cDepartamento >= 0 ? String(fila[cDepartamento]).trim() : '';
    const consulta = [direccion, departamento, 'Mendoza', 'Argentina'].filter(Boolean).join(', ');

    const respuesta = geocoder.geocode(consulta);
    if (respuesta.status === 'OK' && respuesta.results.length) {
      const resultado = respuesta.results[0];
      celdaLat.setValue(resultado.geometry.location.lat);
      celdaLng.setValue(resultado.geometry.location.lng);
      const precisa = ['ROOFTOP', 'RANGE_INTERPOLATED'].includes(resultado.geometry.location_type);
      celdaLat.setNote(precisa ? '' : `Ubicación aproximada (${resultado.formatted_address}). Revisala en Google Maps.`);
      if (!precisa) aRevisar.push(i + 1);
      completadas++;
    } else {
      celdaLat.setNote('No encontré esta dirección. Cargá las coordenadas a mano.');
      aRevisar.push(i + 1);
    }
    Utilities.sleep(200);
  }

  const mensaje = aRevisar.length
    ? `Completé ${completadas}. Revisá las filas ${aRevisar.join(', ')} (tienen una nota).`
    : `Completé ${completadas} fila(s).`;
  planilla.toast(mensaje, 'Coordenadas', 8);
}

// Acepta "-32.9265, -68.8440" en lat (como lo copia Google Maps) o cada número por separado,
// con punto o coma decimal. Devuelve [lat, lng] o null.
function leerCoordenadas(lat, lng) {
  const numero = v => {
    if (typeof v === 'number') return v;
    const texto = String(v).trim().replace(',', '.');
    return texto && !isNaN(texto) ? Number(texto) : NaN;
  };

  const par = String(lat).match(/^\s*(-?\d+[.,]\d+)\s*[,;\s]\s*(-?\d+[.,]\d+)\s*$/);
  if (par && String(lng).trim() === '') return [numero(par[1]), numero(par[2])];

  const a = numero(lat);
  const b = numero(lng);
  return isFinite(a) && isFinite(b) ? [a, b] : null;
}
