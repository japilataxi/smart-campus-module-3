# Informe de Cobertura de Pruebas - Jest

## Herramienta utilizada

Jest con la opción `--coverage`.

## Fecha de ejecución

2026-07-23

## Alcance

La cobertura se ejecutó sobre los microservicios NestJS que cuentan con script de pruebas unitarias y configuración Jest.

## Resultado general

- Aplicaciones evaluadas: 10
- Aplicaciones con ejecución aprobada: 10
- Aplicaciones con ejecución fallida: 0
- Aplicaciones con reporte de cobertura generado: 10

## Resultados por aplicación

| Aplicación | Estado | Statements % | Branches % | Functions % | Lines % | Reporte |
|---|---:|---:|---:|---:|---:|---|
| announcement-service | Aprobado | 0 | 0 | 0 | 0 | qa/coverage/reports/announcement-service/index.html |
| api-gateway | Aprobado | 34.46 | 0 | 6.25 | 33.44 | qa/coverage/reports/api-gateway/index.html |
| auth-service | Aprobado | 49.73 | 4.34 | 24 | 47.07 | qa/coverage/reports/auth-service/index.html |
| campus-incident-service | Aprobado | 34.14 | 0 | 26.31 | 30.43 | qa/coverage/reports/campus-incident-service/index.html |
| library-service | Aprobado | 51.46 | 0 | 23.25 | 48.63 | qa/coverage/reports/library-service/index.html |
| notification-service | Aprobado | 21.49 | 1.58 | 13.72 | 20.28 | qa/coverage/reports/notification-service/index.html |
| qr-access-service | Aprobado | 19.64 | 25.22 | 13.92 | 19.68 | qa/coverage/reports/qr-access-service/index.html |
| space-availability-service | Aprobado | 30.61 | 15.87 | 16.92 | 31.67 | qa/coverage/reports/space-availability-service/index.html |
| transport-service | Aprobado | 29.65 | 17.64 | 16.39 | 31.17 | qa/coverage/reports/transport-service/index.html |
| workflow-service | Aprobado | 31.27 | 11.7 | 19.04 | 31.72 | qa/coverage/reports/workflow-service/index.html |

## Evidencias generadas

- Reporte consolidado de salida: `qa/coverage/reports/coverage-execution-results.txt`
- Reportes HTML por aplicación: `qa/coverage/reports/<aplicacion>/index.html`
- Resumen JSON consolidado: `qa/coverage/summary/coverage-results.json`

## Interpretación

La cobertura representa el porcentaje de código ejecutado por las pruebas unitarias automatizadas. Este resultado complementa las pruebas funcionales Selenium, pruebas de rendimiento con Apache JMeter, pruebas de vulnerabilidades con OWASP Dependency-Check y análisis estático con ESLint/TypeScript.

Los porcentajes no representan aprobación funcional del sistema completo; representan únicamente el alcance de ejecución de las pruebas unitarias existentes sobre el código fuente.
