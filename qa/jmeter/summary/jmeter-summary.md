# Pruebas de Rendimiento - Apache JMeter

## Herramienta utilizada

Apache JMeter 5.6.3

## Plan de prueba

qa/jmeter/plans/smart-campus-load-test.jmx

## Configuración

- Usuarios concurrentes: 10
- Ramp-up: 30 segundos
- Iteraciones por usuario: 2
- Endpoints evaluados: 4
- Total de solicitudes esperadas: 80
- Punto de entrada: http://localhost:3000

## Resultado general

- Total de solicitudes: 80
- Solicitudes exitosas: 80
- Solicitudes fallidas: 0
- Porcentaje de errores: 0%
- Tiempo promedio de respuesta: 22.9 ms
- Tiempo mínimo: 4 ms
- Tiempo máximo: 236 ms
- Percentil 90: 28 ms
- Percentil 95: 72 ms
- Throughput: 2.63 solicitudes por segundo

## Resultado por endpoint

### CP-R01 - Health API Gateway

- Solicitudes: 20
- Promedio: 16.75 ms
- Mínimo: 4 ms
- Máximo: 85 ms
- Error: 0%
- Código HTTP: 200

### CP-R02 - Consultar libros

- Solicitudes: 20
- Promedio: 23.55 ms
- Mínimo: 7 ms
- Máximo: 203 ms
- Error: 0%
- Código HTTP: 200

### CP-R03 - Consultar rutas de transporte

- Solicitudes: 20
- Promedio: 22.5 ms
- Mínimo: 6 ms
- Máximo: 211 ms
- Error: 0%
- Código HTTP: 200

### CP-R04 - Consultar anuncios

- Solicitudes: 20
- Promedio: 28.8 ms
- Mínimo: 10 ms
- Máximo: 236 ms
- Error: 0%
- Código HTTP: 200

## Interpretación

El sistema procesó todas las solicitudes sin errores durante la ejecución de la prueba de rendimiento. Los cuatro endpoints evaluados respondieron con código HTTP 200 y no se registraron errores de assertion, errores HTTP ni solicitudes fallidas.

Los tiempos de respuesta observados fueron bajos bajo una carga moderada de 10 usuarios concurrentes, con 2 iteraciones por usuario y un total de 80 solicitudes. El tiempo promedio general fue de 22.9 ms, con un percentil 90 de 28 ms y un percentil 95 de 72 ms, lo que indica que la mayoría de respuestas se mantuvieron dentro de tiempos aceptables para una prueba inicial.

Esta prueba representa una carga inicial controlada sobre el API Gateway y endpoints de consulta. No corresponde a una prueba de estrés extremo, ya que no busca llevar el sistema a su punto de falla, sino validar su comportamiento básico bajo concurrencia moderada.

## Conclusión

El API Gateway y los endpoints evaluados presentaron un comportamiento estable durante la prueba. Las 80 solicitudes esperadas fueron ejecutadas correctamente, todas respondieron con código HTTP 200 y el porcentaje de errores fue 0%.

Con base en estos resultados, el sistema muestra un desempeño adecuado para la carga inicial definida en el plan de pruebas de rendimiento.

## Recomendaciones

- Ejecutar pruebas con mayor cantidad de usuarios.
- Realizar pruebas de estrés y resistencia.
- Monitorear CPU, memoria y uso de red.
- Repetir la prueba antes de cada liberación.
- Mantener JMeter integrado en el proceso de QA.