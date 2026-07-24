# OWASP Dependency-Check - Pruebas de Vulnerabilidades

Esta carpeta almacena la documentación y las evidencias de la fase de pruebas de vulnerabilidades del trabajo de QA de Smart Campus Module 3.

## 1. Objetivo

El objetivo de esta fase es identificar vulnerabilidades conocidas en las dependencias del proyecto mediante un enfoque automatizado de Software Composition Analysis. El análisis ayuda a detectar paquetes vulnerables, CVE relacionados, niveles de severidad y recomendaciones de remediación antes de entregar la evidencia final de QA.

## 2. Herramienta

La herramienta utilizada para esta fase es OWASP Dependency-Check.

OWASP Dependency-Check analiza las dependencias del proyecto y las compara contra bases públicas de vulnerabilidades, como National Vulnerability Database. El resultado esperado para este proyecto es un reporte HTML que pueda revisarse y adjuntarse como evidencia de QA.

## 3. Workflow utilizado

El workflow de GitHub Actions configurado para este análisis es:

```text
.github/workflows/dependency-check-prueba.yml
```

Este workflow está configurado para ejecutar OWASP Dependency-Check sobre el repositorio y generar un reporte HTML.

## 4. Cómo ejecutar el workflow manualmente

Para ejecutar el workflow manualmente desde GitHub Actions:

1. Abrir el repositorio en GitHub.
2. Ir a la pestaña `Actions`.
3. Seleccionar el workflow llamado `Auditoria de Seguridad - Dependency-Check`.
4. Hacer clic en `Run workflow`.
5. Seleccionar la rama que se analizará.
6. Confirmar la ejecución.
7. Esperar hasta que el workflow finalice.

## 5. Dónde descargar el artefacto generado

Después de que el workflow finalice:

1. Abrir la ejecución completada del workflow.
2. Desplazarse hasta la sección `Artifacts`.
3. Descargar el artefacto con un nombre similar a:

```text
reporte-seguridad-owasp-<run_number>
```

El artefacto contiene el reporte de OWASP Dependency-Check generado por el workflow.

## 6. Dónde almacenar el reporte HTML descargado

El reporte HTML descargado debe almacenarse en:

```text
qa/owasp/reports/
```

Esta carpeta está reservada para reportes oficiales de OWASP Dependency-Check utilizados como evidencia final de QA.

## 7. Capturas de pantalla a almacenar

Las capturas relacionadas con la fase de pruebas de vulnerabilidades deben almacenarse en:

```text
qa/owasp/screenshots/
```

Capturas recomendadas:

- Pantalla de ejecución del workflow en GitHub Actions.
- Estado de finalización exitosa del workflow.
- Sección de descarga de artefactos.
- Resumen del reporte HTML de OWASP Dependency-Check.
- Resumen de severidad de vulnerabilidades.
- Detalles principales de CVE, si corresponde.

## 8. Resultados a resumir posteriormente

El resumen debe crearse únicamente después de que exista un nuevo reporte de OWASP Dependency-Check. Los siguientes resultados deben extraerse del reporte:

- Total de dependencias analizadas.
- Vulnerabilidades críticas.
- Vulnerabilidades altas.
- Vulnerabilidades medias.
- Vulnerabilidades bajas.
- CVE principales detectados.
- Recomendaciones técnicas.

El resumen futuro debe almacenarse en:

```text
qa/owasp/summary/
```

## Estado actual

Dependency-Check todavía no se ha ejecutado en esta fase. Esta carpeta contiene actualmente solo la estructura documental requerida para organizar futuras evidencias de OWASP.
