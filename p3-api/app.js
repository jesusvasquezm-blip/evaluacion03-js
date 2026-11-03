const btnBuscar = document.getElementById('btn-buscar');
const inputCiudad = document.getElementById('ciudad-input');
const divEstado = document.getElementById('estado-mensaje');
const divResultado = document.getElementById('resultado-clima');
const btnComparar = document.getElementById('btn-comparar');
const divTiempos = document.getElementById('reporte-tiempos');

// 1. Geocodificación (Open-Meteo)
async function buscarCiudad(nombre) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nombre)}&count=1&language=es`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error en la red: HTTP ${res.status}`);
  const data = await res.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error(`La ciudad "${nombre}" no fue encontrada.`);
  }
  return data.results[0];
}

// 2. Clima actual (Open-Meteo)
async function obtenerClima(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
  return await res.json();
}

// Evento Buscar
btnBuscar.addEventListener('click', async () => {
  const ciudadNombre = inputCiudad.value.trim();
  if (!ciudadNombre) {
    divEstado.style.color = 'blue';
    divEstado.textContent = 'Por favor, ingrese el nombre de una ciudad.';
    return;
  }

  divEstado.style.color = 'blue';
  divEstado.textContent = 'Cargando...';
  btnBuscar.disabled = true;
  divResultado.innerHTML = '';

  try {
    const datosGeo = await buscarCiudad(ciudadNombre);
    const datosClima = await obtenerClima(datosGeo.latitude, datosGeo.longitude);

    divEstado.textContent = '';
    divResultado.innerHTML = `
      <h3>${datosGeo.name} (${datosGeo.admin1 || 'N/A'})</h3>
      <p>Temperatura: <strong>${datosClima.current.temperature_2m} °C</strong></p>
      <p>Velocidad del viento: <strong>${datosClima.current.wind_speed_10m} km/h</strong></p>
    `;
  } catch (error) {
    divEstado.style.color = 'red';
    divEstado.textContent = `Error: ${error.message}`;
  } finally {
    btnBuscar.disabled = false;
  }
});

// Medición de Tiempos (Secuencial vs Promise.all)
async function medirTiempos() {
  const ciudades = ['Lima', 'Cusco', 'Arequipa'];
  divTiempos.textContent = 'Midiendo tiempos...';

  // Secuencial
  const inicioSec = performance.now();
  for (const c of ciudades) {
    const geo = await buscarCiudad(c);
    await obtenerClima(geo.latitude, geo.longitude);
  }
  const finSec = performance.now();
  const tiempoSecuencial = (finSec - inicioSec).toFixed(2);

  // Paralelo (Promise.all)
  const inicioPar = performance.now();
  await Promise.all(ciudades.map(async (c) => {
    const geo = await buscarCiudad(c);
    return obtenerClima(geo.latitude, geo.longitude);
  }));
  const finPar = performance.now();
  const tiempoParalelo = (finPar - inicioPar).toFixed(2);

  divTiempos.innerHTML = `
    <p><strong>Await Secuencial:</strong> ${tiempoSecuencial} ms</p>
    <p><strong>Paralelo (Promise.all):</strong> ${tiempoParalelo} ms</p>
  `;
}

btnComparar.addEventListener('click', medirTiempos);