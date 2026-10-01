# Commercial Opportunity: Captación de mandatos para la intermediación de farmacias (España)

**ID:** `farmacia-mandate-engine`  
**Amélie Twin:** ninguno (petición externa de Reddit, 30.09.2026)  
**Status:** Research (modelo de costes hecho; conversiones sin medir; segundo análisis del Lab incorporado el 01.10.2026)  
**Category:** Servicio de intermediación + herramienta opcional  
**Target Buyer:** intermediarios nuevos, asesores de farmacia y despachos en España  
**Vista interactiva:** <https://felixinberlin.github.io/Amelie/#venture=farmacia-mandate-engine&lang=es> (pestaña Ventures: gráficos, sliders de precio, comisión y tasa de cierre; también en DE/EN)

> Todas las cifras de la tabla de enfoques son **supuestos**, no mediciones. Los datos de mercado son fragmentos de búsqueda del 30.09.2026: hay que comprobarlos en la fuente antes de citarlos. Código del modelo: `src/data/pharmaAcquisition.ts` (10 tests).

---

## 1. La pregunta

Cómo capta un intermediario clientes para la compraventa de farmacias en España, tanto compradores como vendedores, con tiempos, costes, inversión y ROI de cada enfoque.

## 2. Lo que dicen las fuentes

- **22.311 farmacias** (2024). Solo los farmacéuticos pueden ser propietarios; un titular por oficina. Cada comunidad autónoma regula la transmisión (Andalucía: mínimo cinco años de funcionamiento).
- **La demanda supera a la oferta.** Farmaconsulting dice conocer 22.000 compradores potenciales; ComprarFarmacia.es dice tener más de 1.000. Conclusión: **el cuello de botella son los vendedores**, no los compradores.
- **Volumen.** No hay cifra nacional publicada en lo que encontré. Andalucía: 120 ventas en 2024 y 148 en 2023 (−19 %); 28 fueron transmisiones parciales; las de herencia o donación subieron de 47 a 67. Extrapolar a España sería una estimación mía sin base: no la uso en el modelo.
- **Precio.** Múltiplo de ventas de 0,8 a 1,5 o de 4 a 7 veces el EBITDA. Facturación media 2024: 1,12 M€. El modelo usa **1,0 M€** por operación.
- **Comisión.** 3 a 5 % por parte, según un portal competidor (fuente interesada). Los intermediarios no publican tarifas. Un intermediario general de empresas declara del 5 al 10 % de comisión de éxito, pero no es una tarifa de farmacias. El modelo usa **3 % de una parte** (30.000 € por operación).
- **Plazos.** De 6 meses a 1 año en total; otras fuentes dicen 8 a 16 semanas desde el acuerdo de precio. El modelo usa 8 meses desde el mandato hasta el cobro.
- **Competencia.** 17 intermediarios en una lista (Farmaconsulting con 80 profesionales, Asefarma con más de 30 años, Farmatrading, Valfarma, Cetefarma y otros).
- **Complejidad.** No es una compraventa corriente: se suman la regulación autonómica, los requisitos de titularidad y las autorizaciones administrativas, y la operación toca a la vez cuestiones administrativas, regulatorias, fiscales, laborales y patrimoniales.
- **Legal.** El correo electrónico comercial sin consentimiento previo está prohibido (LSSI art. 21), también entre empresas. Para llamadas puede valer el interés legítimo (RGPD art. 6.1.f). El correo postal es el canal más limpio.

## 3. Enfoques: tiempo, coste, inversión y ROI

Supuestos: precio 1,0 M€, comisión 3 % de una parte, 40 % de los mandatos cierran, 8 meses del mandato al cobro. ROI a 24 meses = resultado después de 24 meses ÷ todos los costes, inversión incluida.

| Enfoque | Inversión | Coste/año | Primera comisión | Cierres/año | Resultado 24 m | ROI 24 m | Recuperación |
|---|--:|--:|--:|--:|--:|--:|--:|
| Cartas personales a titulares (4.000/año) | 1.500 € | 4.800 € | 11 meses | 1,3 | 34.260 € | 309 % | mes 13 |
| Cartas con radar de sucesión | 7.500 € | 7.800 € | 12 meses | 2,7 | 57.540 € | 249 % | mes 15 |
| Google Ads (búsquedas de venta) | 2.500 € | 12.000 € | 10 meses | 1,4 | 25.700 € | 97 % | mes 15 |
| Visitas y llamadas (una persona) | 3.000 € | 46.800 € | 11 meses | 3,8 | 28.200 € | 29 % | mes 20 |
| SEO y contenidos | 8.000 € | 14.400 € | 14 meses | 1,2 | −8.000 € | −22 % | mes 29 |
| Prescriptores (gestores, abogados, bancos; 15 % de la comisión) | 4.000 € | 13.800 € | 17 meses | 1,2 | −2.950 € | −12 % | mes 26 |
| Prensa y feria (Infarma) | 3.000 € | 19.200 € | 12 meses | 1,0 | −12.600 € | −30 % | mes 40 |
| Lado comprador (LinkedIn a farmacéuticos adjuntos) | 2.000 € | 9.600 € | – | – | −21.200 € | ayuda | – |

Cómo leerlo:

1. **Las cartas ganan por euro, pero es la suposición más frágil.** Se asumen 0,7 % de respuesta y 12 % de respuesta a mandato. Se comprueba con 500 cartas (unos 650 €).
2. **Las visitas dan más volumen, pero cuestan más y dependen de una persona.** Con 8 meses de cierre, un año no basta para recuperarlas.
3. **SEO, prescriptores y feria no salen positivos en 24 meses con estos supuestos.** Ojo: los intermediarios establecidos llevan años en esas búsquedas y con esos prescriptores.
4. **Compradores: no invertir primero.** Ya hay listas grandes. El lado comprador sirve para cerrar mandatos, no para ganarlos. A 40 a 80 € por lead en LinkedIn (rango de España para B2B), 150 compradores cuestan unos 9.600 €.
5. **La inversión inicial nunca supera 8.000 €; lo caro es el tiempo.** Ninguna vía cobra antes del mes 10.

## 4. El radar de sucesión (la parte que es software)

Puntuar las farmacias a partir de datos públicos (años abiertas, banda de facturación, localidad) para decidir a quién escribir primero. **Límite duro:** la edad del titular no es pública, así que el radar solo aproxima. Antes de construirlo hay que revisar la protección de datos (interés legítimo, lista Robinson). Construirlo lleva unos siete días si se parte de un motor determinista; no es un producto en sí, es un multiplicador de las cartas.

## 5. Prueba de 90 días (unos 4.650 €)

| Paso | Presupuesto |
|---|--:|
| 500 cartas a titulares con muchos años abiertos; contar respuestas | 650 € |
| Página con calculadora de valoración y tres meses de Google Ads | 3.500 € |
| 15 conversaciones con gestores y abogados especializados en farmacia | 500 € |
| 10 conversaciones con titulares que no quieren vender: por qué no y en quién confiarían | 0 € |

**Parar** si a los 90 días hay menos de cinco conversaciones serias de venta y ningún mandato firmado.

## 6. Los cinco vectores comerciales

| Vector | Nota | Análisis |
|---|:---:|---|
| **1. Dolor y disposición a pagar** | 4/5 | Una comisión de 30.000 € por operación; el vendedor ya paga por intermediar. |
| **2. Time-to-Ship** | 2/5 | La captación es trabajo comercial; la primera comisión llega tarde. El radar es rápido, el negocio no. |
| **3. Canal** | 2/5 | Los canales baratos (buscadores, prescriptores) están ocupados por 17 intermediarios. |
| **4. Monetización** | 4/5 | Comisión por éxito; herramienta opcional de 99 a 299 €/mes. |
| **5. Defendibilidad** | 2/5 | La intermediación se basa en la confianza; solo el radar es determinista. |

**Veredicto:** el mercado existe y es rentable, pero no es un producto de software. Es un negocio de servicios con un multiplicador de datos. No recomendamos escribir código antes de que las cartas demuestren cuántos titulares responden.

## 7. Segundo análisis: Amélie-lab (agente Mark, 30.09.2026)

La misma pregunta se analizó en el proyecto hermano Amélie-lab (`mark-20260930T144720-a8c5ef`, gemini-2.5-flash, 21 búsquedas). Mark no comparó vías de captación, sino **cuatro modelos de negocio**. El análisis no dio tiempos, costes ni ROI por modelo (esos campos se añadieron al Lab después); las cifras de la sección 3 siguen siendo las únicas.

| Modelo | Lo opera | Estado | Nota |
|---|---|---|---|
| V1. Intermediación como servicio propio | el propio intermediario | en la lista corta | Primera consulta, estimación de valor, acompañamiento en la autorización y encaje entre comprador y vendedor. El Lab propone comisión de éxito del 3 al 7 % y de 3 a 6 meses hasta el primer cliente. |
| V4. Guía de pago sobre la normativa de transmisión por comunidad autónoma | producto para terceros | en la lista corta | Listas de comprobación, documentación y organismos por región, por suscripción o pago único. De 3 a 6 meses de trabajo jurídico previo. Los despachos ya dan este consejo; demanda y precio sin medir. |
| V2. Plataforma SaaS para otros intermediarios | producto para terceros | descartado | Mucho desarrollo, un mercado pequeño y a los intermediarios les bastan herramientas genéricas de gestión. Se reabre si los propios intermediarios dicen que las herramientas genéricas no les bastan. |
| V3. Producto de datos: mercado y valoración | producto para terceros | descartado | Los precios comparables de ventas reales solo los tiene quien intermedia; a eso se suman el mantenimiento de los datos y el RGPD. Se reabre cuando el propio negocio de intermediación tenga cierres: entonces los precios comparables son suyos. |

Lo que todavía nadie ha respondido:

1. ¿Cuánto cuesta cada uno de los cuatro modelos, cuándo cobra y qué devuelve? El Lab ya tiene campos de tiempo, inversión, costes recurrentes y ROI por modelo; en este análisis quedaron vacíos.
2. ¿Cuántas farmacias cambian de titular al año en toda España? Solo se conoce Andalucía (120 ventas en 2024).
3. ¿Qué cobran de verdad los intermediarios de farmacias? Ninguno publica tarifas; los dos análisis trabajan con aproximaciones.
4. ¿Pagaría alguien por la guía por comunidad autónoma, y cuánto?
5. ¿Cuántos titulares responden a una carta? De esa cifra depende todo el modelo; 500 cartas la miden.

Contrastado con el modelo de la sección 3:

1. **El veredicto se mantiene.** Negocio de servicios propio sí, software para terceros no. El producto de datos descartado marca el mismo límite que el radar de sucesión, que solo sirve por dentro como multiplicador de las cartas.
2. **Comisión.** El 3 al 7 % del Lab viene de tarifas de intermediarios generales, no de ventas de farmacias. El modelo sigue en el 3 % de una parte; el control de la vista interactiva llega ahora hasta el 7 %.
3. **Tiempo.** De 3 a 6 meses hasta el primer cliente encaja con el primer mandato del modelo (de 2 a 9 meses según la vía). La comisión llega ocho meses después; ninguna vía cobra antes del mes 10.
4. **Objetivo de ingresos sin respaldo.** El Lab apunta a 100.000 a 200.000 € el primer año. A 30.000 € por operación serían de tres a siete cierres cobrados; el modelo no llega a uno entero en el primer año.
5. **Nuevo: la guía por comunidad.** En el modelo es solo un cebo gratuito (SEO). Si alguien pagaría por ella se puede preguntar en las 15 conversaciones con gestores y abogados de la prueba de 90 días.

Criterios de descarte del Lab para el negocio de intermediación:

- Ninguna operación en los primeros nueve meses. Con ocho meses de tramitación, eso alcanzaría a casi todas las vías antes de su primera comisión; es más útil: ningún mandato firmado a los nueve meses.
- Un cambio legal que permita cadenas o simplifique mucho la transmisión.
- Ninguna diferencia visible frente a los intermediarios establecidos.

Más nombres en el mercado. Despachos y asesores que el Lab clasifica como competencia directa: Marvin Abogados, Gómez Córdoba, Traspasso, Asefarma. Intermediarios y portales de los resultados de búsqueda (sin comprobar uno a uno): Profarma, Urbagesa, Traspasodefarmacias.com, Farmatrading, Ideafarma, Pfarma, Farcapital.

Calidad de las evidencias del Lab: de 16 afirmaciones de hecho, la página citada respalda 8, 5 solo en parte, 1 no, y 2 quedaron sin comprobar. A este dossier solo pasaron las respaldadas.

## 8. Qué falta por comprobar

- Número anual de operaciones en toda España (no encontrado).
- Tarifas reales de los intermediarios (ninguna publicada).
- Origen legal de las direcciones de los titulares (colegios, registros autonómicos).
- Tarifa de Correos 2026 para cartas personalizadas, tarifas de Correo Farmacéutico y El Global, precio del stand de Infarma.
- Fecha de la próxima Infarma.
- Demanda y precio de una guía normativa de pago por comunidad autónoma (propuesta del Lab).

## 9. Fuentes (fragmentos de búsqueda, 30.09.2026)

- [Gómez Córdoba: cuántas farmacias hay en España](https://gomezcordoba.com/cuantas-farmacias-hay-espana/)
- [BOE: Ley 16/1997](https://www.boe.es/buscar/act.php?id=BOE-A-1997-9022)
- [IM Farmacias: compraventas en Andalucía 2024](https://www.imfarmacias.es/noticia/37980/andalucia-registra-un-menor-numero-de-compraventas-de-farmacias-en-2.html)
- [El Global: radiografía de la profesión 2025](https://elglobalfarma.com/farmacia/radiografia-profesion-farmaceutica-2025-colegiados-estabiliza-empleo/)
- [Capittal: cuánto vale una farmacia](https://capittal.es/recursos/blog/cuanto-vale-una-farmacia)
- [ComprarFarmacia.es: intermediarios](https://www.comprarfarmacia.es/intermediarios/)
- [Gómez Córdoba: traspasos](https://gomezcordoba.com/traspasos-de-farmacia/)
- [Farmaconsulting](https://www.farmaconsulting.es/)
- [BOE: LSSI](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758)
- [Growth LinkedIn: LinkedIn Ads en España](https://growthlinkedin.com/agencia-linkedin-ads/)

Añadidas con el análisis del Lab (el Lab leyó la página y encontró allí la afirmación):

- [Blue Mountain: vender una farmacia](https://blue-mountain.es/en/insights/sell-pharmacy-business/)
- [In Diem: compraventa de farmacias](https://www.in-diem.com/en/lawyers-for-pharmacies/pharmacy-purchase-and-sale/)
- [Smergers: intermediarios de empresas en España](https://www.smergers.com/business-brokers-in-spain/c170m15i/)
- [Insights10: mercado de farmacia en España](https://www.insights10.com/report/spain-retail-pharmacy-market-analysis/) (20.050 M USD en 2022, previsión de 31.700 M USD en 2030; mide lo que venden las farmacias, no las compraventas de farmacias)
