# Automatización QA con Selenium

Esta carpeta contiene la estructura inicial para pruebas funcionales web con Selenium WebDriver y TypeScript para Smart Campus Module 3.

## Propósito

El proyecto de pruebas Selenium está aislado dentro de `qa/selenium` para evitar modificar el código fuente de la aplicación, la configuración raíz del monorepo, GitHub Actions o las dependencias de producción.

## Estructura actual

- `pages/`: Clases del patrón Page Object Model para páginas reales de Smart Campus. El código de pruebas utilizará esta carpeta posteriormente para representar páginas como Landing, Login y Dashboard.
- `tests/`: Casos de prueba funcionales con Selenium. Todavía no se han creado casos de prueba.
- `utils/`: Utilidades compartidas de QA, como creación de WebDriver, carga de variables de entorno, esperas, capturas de pantalla y helpers de reportes.
- `screenshots/`: Evidencias generadas durante la ejecución de pruebas, especialmente capturas realizadas ante fallos.
- `reports/`: Reportes de ejecución que muestran pruebas aprobadas y fallidas.

## Archivos

- `package.json`: Define esta carpeta de automatización QA como un proyecto aislado de Node.js/TypeScript. Las dependencias están intencionalmente vacías en esta etapa porque Selenium todavía no ha sido instalado.
- `tsconfig.json`: Define las reglas de compilación de TypeScript para los archivos QA ubicados en `pages`, `tests` y `utils`.
- `.env.example`: Documenta las variables de entorno que utilizarán las futuras pruebas Selenium, incluyendo la URL del frontend, URL del API, navegador, tiempo de espera y credenciales de prueba.
- `README.md`: Documenta la estructura de automatización QA y explica cómo se pretende utilizar esta carpeta.

## Decisión sobre la configuración de Selenium

No se creó un archivo separado `selenium.config.ts` porque no es un requisito estándar de Selenium WebDriver. Los proyectos con Selenium normalmente crean el driver directamente en un archivo de utilidad/helper y leen la configuración de ejecución desde variables de entorno. Esto mantiene la configuración simple, explícita y más fácil de defender en una revisión de QA.

## Estado

Todavía no se han creado casos de prueba Selenium.
Todavía no se han instalado dependencias.
No se ha modificado código de la aplicación.
