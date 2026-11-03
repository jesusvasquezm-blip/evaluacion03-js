# Evaluación 03 - JavaScript (Tecsup)

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![ES Modules](https://img.shields.io/badge/Modules-ES6-blue)](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules)
[![Estado](https://img.shields.io/badge/Estado-Completado-brightgreen)](#)

Solución integral de la Evaluación 03 del curso de Desarrollo Web en Tecsup. Se abarcan temas de manipulación del DOM, prevención de ataques XSS, modularización con ES6 y consumo de APIs asíncronas con optimización de rendimiento.

🌐 **GitHub Pages:** [https://jesusvasquezm-blip.github.io/evaluacion03-js/](https://jesusvasquezm-blip.github.io/evaluacion03-js/)

---

## Tabla de Contenidos
- [Pregunta 1: DOM y Seguridad XSS](#pregunta-1-dom-y-seguridad-xss)
- [Pregunta 2: Módulos ES6 y Falsy Values](#pregunta-2-módulos-es6-y-falsy-values)
- [Pregunta 3: Consumo de APIs y Rendimiento](#pregunta-3-consumo-de-apis-y-rendimiento)
- [Diagrama de Flujo del Sistema](#diagrama-de-flujo-del-sistema)
- [Bitácora de IA Generativa](#bitácora-de-ia-generativa)
- [Conclusión del Proyecto](#conclusión-del-proyecto)
- [Checklist de Entregables](#checklist-de-entregables)

---

## Pregunta 1: DOM y Seguridad XSS
![Evidencia Pregunta 1](img/p1.png)

Se implementó el registro de productos manipulando el DOM de forma segura mediante `textContent` para prevenir ataques de inyección XSS. Además, se habilitó la prueba con `innerHTML` para evidenciar la vulnerabilidad.

### Código clave (Sanitización con textContent):
```js
const tdNombre = document.createElement('td');
tdNombre.textContent = nombreProducto; // Asignación segura que escapa código HTML/JS