# Análisis Estático - ESLint y TypeScript Compiler

## Objetivo

Esta carpeta contiene la estructura de documentación y evidencias para la fase de análisis estático del trabajo de QA de Smart Campus Module 3.

El objetivo del análisis estático es inspeccionar el código fuente sin ejecutar la aplicación, con el fin de detectar problemas de calidad de código, problemas de sintaxis, errores de tipado e incumplimientos de reglas antes de la ejecución.

## Herramientas utilizadas

Las herramientas seleccionadas para esta fase son:

- ESLint.
- TypeScript Compiler.

ESLint se utiliza para validar reglas de codificación, detectar patrones inseguros, variables no utilizadas, promesas no controladas y problemas de estilo o calidad de acuerdo con la configuración ya definida en cada aplicación.

TypeScript Compiler se utiliza con `--noEmit` para validar tipos sin generar artefactos de compilación ni modificar archivos del proyecto.

## Alcance

La fase de análisis estático cubre:

- Microservicios NestJS.
- Aplicación frontend Next.js.
- Pruebas QA Selenium escritas en TypeScript.

El análisis reutilizará las configuraciones existentes de ESLint y TypeScript ya presentes en el proyecto.

## Análisis estático vs pruebas dinámicas

El análisis estático revisa el código sin ejecutar la aplicación. Ayuda a detectar problemas de forma temprana en el proceso de desarrollo, antes de que el software sea desplegado o ejecutado.

Las pruebas dinámicas ejecutan la aplicación o el comportamiento del sistema, como pruebas funcionales Selenium, análisis de dependencias OWASP o pruebas de rendimiento JMeter.

En este proyecto, el análisis estático complementa las fases anteriores de QA mediante la validación de calidad de código y seguridad de tipos antes de la ejecución.

## Problemas detectables

Las herramientas seleccionadas para esta fase pueden ayudar a detectar:

- Errores de sintaxis.
- Problemas de verificación de tipos.
- Variables no utilizadas.
- Promesas no controladas o floating promises.
- Uso incorrecto de tipos.
- Incumplimiento de reglas de codificación.
- Patrones inconsistentes frente a las reglas configuradas de ESLint.

## Criterios de ejecución segura

Para ESLint, los comandos seguros no deben usar `--fix`, porque `--fix` modifica automáticamente los archivos fuente.

Para TypeScript, el compilador debe ejecutarse con `--noEmit`, porque esto valida los tipos sin generar archivos de salida.

## Organización futura de evidencias

Las evidencias de esta fase se organizarán de la siguiente manera:

```text
qa/static-analysis/
|-- reports/      # Salidas de ejecución de ESLint y TypeScript
|-- screenshots/  # Evidencias visuales de ejecuciones en terminal o reportes
|-- summary/      # Resumen final escrito del análisis estático
`-- README.md     # Documentación de esta fase QA
```

## Estado actual

Todavía no se ha ejecutado análisis estático.

Todavía no se ha generado ningún reporte ESLint.

Todavía no se ha generado ningún reporte TypeScript.

No se ha modificado código fuente ni archivos de configuración existentes para esta fase.
