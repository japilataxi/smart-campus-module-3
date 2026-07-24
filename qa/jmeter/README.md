# Pruebas de Rendimiento - Apache JMeter

## Objetivo

Esta carpeta contiene la organización para la fase de pruebas de rendimiento del trabajo de QA de Smart Campus Module 3. El objetivo es evaluar el comportamiento de los servicios backend bajo carga, enfocándose en tiempo de respuesta, throughput, estabilidad y tasa de errores para solicitudes HTTP representativas.

## Herramienta

La herramienta seleccionada para esta fase es Apache JMeter.

Apache JMeter se utilizará para crear planes de prueba de carga, ejecutar solicitudes HTTP contra el sistema, recopilar resultados de ejecución y generar evidencias para el informe de QA.

## Sistema evaluado

Sistema evaluado: Smart Campus Module 3.

Las pruebas de rendimiento se enfocan en el punto de entrada backend utilizado por la aplicación web y la arquitectura de microservicios.

## Punto de entrada

El punto de entrada principal para la primera prueba de rendimiento es:

```text
http://localhost:3000
```

Esto corresponde al API Gateway, que centraliza las solicitudes HTTP desde el frontend y las redirige a los microservicios correspondientes.

## Plan inicial de prueba JMeter

Archivo creado:

```text
qa/jmeter/plans/smart-campus-load-test.jmx
```

Nombre del plan de prueba:

```text
Smart Campus Module 3 - Prueba de Carga Inicial
```

Configuración del Thread Group:

- Nombre: Usuarios concurrentes - Carga inicial.
- Usuarios concurrentes: 10.
- Periodo de ramp-up: 30 segundos.
- Cantidad de iteraciones: 2.
- Mismo usuario en cada iteración: habilitado.
- Constant Timer: 500 milisegundos entre solicitudes.

Total esperado de solicitudes:

```text
10 users x 2 iterations x 4 endpoints = 80 requests
```

## Variables configurables

El plan de prueba utiliza estas variables en HTTP Request Defaults:

```text
BASE_PROTOCOL = http
BASE_HOST = localhost
BASE_PORT = 3000
```

## Endpoints seleccionados para la primera prueba

La primera prueba de rendimiento utiliza endpoints orientados a lectura para evitar modificar datos del sistema durante la ejecución inicial:

```text
GET /health
GET /api/library/books
GET /api/transport/routes
GET /api/announcements
```

Estos endpoints fueron seleccionados porque representan operaciones comunes de la plataforma:

- `/health`: verifica la disponibilidad del API Gateway.
- `/api/library/books`: representa consultas al catálogo de biblioteca.
- `/api/transport/routes`: representa consultas de rutas de transporte.
- `/api/announcements`: representa consultas de anuncios institucionales.

## Assertions

Cada solicitud HTTP incluye una Response Assertion que acepta únicamente códigos de estado HTTP exitosos:

```text
200
201
204
```

La prueba debe fallar cuando el API devuelva códigos de error como:

```text
400, 401, 403, 404, 500, 502, 503
```

## Listeners locales

El plan de prueba incluye únicamente listeners útiles para ejecución local:

- Summary Report.
- Aggregate Report.
- View Results Tree.

## Métricas a evaluar

Las siguientes métricas serán revisadas durante la fase de pruebas de rendimiento:

- Tiempo promedio de respuesta.
- Tiempo mínimo y máximo de respuesta.
- Percentil 90 del tiempo de respuesta.
- Percentil 95 del tiempo de respuesta.
- Throughput.
- Porcentaje de errores.
- Número total de solicitudes.

## Organización de carpetas

Los archivos de esta fase se organizan de la siguiente manera:

```text
qa/jmeter/
|-- plans/        # Planes de prueba JMeter (.jmx)
|-- results/      # Resultados crudos de ejecución (.jtl)
|-- reports/      # Reportes HTML generados por JMeter
|-- screenshots/  # Evidencias visuales de ejecuciones y reportes
|-- summary/      # Resumen escrito de resultados de rendimiento
`-- README.md     # Documentación de esta fase QA
```

## Estado actual

El plan de prueba inicial `.jmx` ha sido creado.

Todavía no se ha ejecutado ninguna prueba de rendimiento.

Todavía no se ha generado ningún archivo de resultados `.jtl`.

Todavía no se ha generado ningún reporte HTML de rendimiento.
