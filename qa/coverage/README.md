# Cobertura de Pruebas - Jest

Esta carpeta contiene los reportes de cobertura de pruebas unitarias generados con Jest para los microservicios NestJS del proyecto Smart Campus Module 3.

## Objetivo

Medir qué porcentaje del código fuente fue ejecutado por las pruebas unitarias automatizadas existentes, con el fin de complementar la evidencia de calidad solicitada para la entrega final.

## Herramienta utilizada

Jest con la opción `--coverage`.

## Organización

```text
qa/coverage/
|-- reports/      # Reportes HTML y JSON de cobertura por aplicación
|-- summary/      # Resumen consolidado de cobertura
`-- README.md     # Documentación de esta fase QA
```

## Aplicaciones evaluadas

- `announcement-service`
- `api-gateway`
- `auth-service`
- `campus-incident-service`
- `library-service`
- `notification-service`
- `qr-access-service`
- `space-availability-service`
- `transport-service`
- `workflow-service`

## Evidencias principales

- `qa/coverage/summary/coverage-summary.md`
- `qa/coverage/summary/coverage-results.json`
- `qa/coverage/reports/<aplicacion>/index.html`

## Nota

Esta fase no reemplaza las pruebas funcionales Selenium, pruebas de rendimiento Apache JMeter, análisis de vulnerabilidades OWASP Dependency-Check ni análisis estático ESLint/TypeScript. La cobertura es una métrica adicional que indica qué parte del código fue ejecutada por pruebas unitarias.
