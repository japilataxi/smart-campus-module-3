# Informe de Pruebas Estaticas

## 1. Objetivo

El objetivo de las pruebas estaticas fue detectar problemas de calidad, tipado, estilo y posibles errores antes de ejecutar el sistema. Este tipo de revision permite identificar hallazgos en el codigo fuente sin levantar la aplicacion, reduciendo riesgos antes de las pruebas dinamicas y antes de una liberacion.

## 2. Herramientas utilizadas

- ESLint
- TypeScript Compiler
- pnpm

## 3. Alcance

El analisis incluyo microservicios desarrollados con NestJS, el frontend desarrollado con Next.js, la aplicacion movil y las pruebas Selenium, segun correspondia a cada herramienta.

ESLint se ejecuto sobre los microservicios NestJS y el frontend Next.js. TypeScript Compiler se ejecuto sobre microservicios, frontend, aplicacion movil y pruebas Selenium.

## 4. Resultados de ESLint

- Aplicaciones analizadas: 11
- Aplicaciones sin errores: 0
- Errores totales: 995
- Advertencias totales: 35

| Aplicacion | Errores | Advertencias | Estado |
|---|---:|---:|---|
| apps/api-gateway | 255 | 3 | Con hallazgos |
| apps/auth-service | 90 | 5 | Con hallazgos |
| apps/library-service | 90 | 6 | Con hallazgos |
| apps/campus-incident-service | 21 | 2 | Con hallazgos |
| apps/notification-service | 215 | 6 | Con hallazgos |
| apps/announcement-service | 218 | 1 | Con hallazgos |
| apps/web-app | 106 | 12 | Con hallazgos |
| apps/qr-access-service | No evaluado completamente | No evaluado completamente | Error de configuracion ESLint |
| apps/space-availability-service | No evaluado completamente | No evaluado completamente | Error de configuracion ESLint |
| apps/transport-service | No evaluado completamente | No evaluado completamente | Error de configuracion ESLint |
| apps/workflow-service | No evaluado completamente | No evaluado completamente | Error de configuracion ESLint |

En cuatro aplicaciones, ESLint no pudo completar el analisis por un problema de configuracion. El error frecuente fue:

```text
ReferenceError: require is not defined in ES module scope
```

Este hallazgo representa un problema de configuracion de ESLint, no necesariamente un error funcional de la aplicacion. Para obtener resultados completos en esas aplicaciones, primero se debe corregir la configuracion del archivo ESLint correspondiente.

## 5. Reglas mas frecuentes

Las reglas o categorias de hallazgos mas frecuentes fueron:

- `prettier/prettier`: indica incumplimientos de formato de codigo definidos por Prettier, como saltos de linea, espacios, indentacion o estilo de escritura.
- `@typescript-eslint/no-explicit-any`: detecta el uso explicito de `any`, lo que reduce la seguridad de tipos y dificulta el mantenimiento.
- `@typescript-eslint/no-unsafe-member-access`: aparece cuando se accede a propiedades de valores con tipo inseguro, normalmente `any` o tipos no inferidos correctamente.
- `@typescript-eslint/no-unsafe-assignment`: indica asignaciones de valores con tipo inseguro hacia variables o propiedades.
- `@typescript-eslint/no-unsafe-argument`: detecta argumentos inseguros enviados a funciones que esperan tipos mas especificos.
- `@typescript-eslint/no-floating-promises`: advierte sobre promesas que no fueron esperadas con `await`, capturadas con `.catch()` o marcadas explicitamente como ignoradas.
- `@typescript-eslint/no-unused-vars`: identifica variables, parametros o importaciones declaradas pero no utilizadas.

## 6. Resultados de TypeScript

- Aplicaciones analizadas: 13
- Aplicaciones aprobadas: 13
- Errores TypeScript: 0
- Porcentaje de aprobacion: 100%

Todas las aplicaciones evaluadas pasaron la comprobacion de tipos con el comando:

```text
pnpm exec tsc --noEmit
```

Esto confirma que no se detectaron errores de compilacion TypeScript durante esta ejecucion.

## 7. Interpretacion

El proyecto presenta consistencia de tipado, ya que todas las aplicaciones evaluadas con TypeScript Compiler finalizaron sin errores. No se detectaron errores de compilacion TypeScript en microservicios, frontend, aplicacion movil ni pruebas Selenium.

Sin embargo, ESLint detecto deuda tecnica y problemas de calidad relacionados con formato, uso de `any`, accesos inseguros a miembros, asignaciones inseguras, promesas sin control y variables no utilizadas.

Adicionalmente, cuatro aplicaciones requieren corregir primero la configuracion de ESLint antes de poder obtener un resultado completo del analisis estatico en esos modulos.

Estos hallazgos no significan que el sistema no funcione. Indican que existen aspectos de mantenibilidad, estandarizacion y calidad del codigo que deben mejorar para fortalecer el proyecto.

## 8. Conclusion

El analisis estatico fue ejecutado correctamente y los reportes fueron generados como evidencia dentro de la carpeta de QA.

El resultado de TypeScript fue satisfactorio, porque las 13 aplicaciones evaluadas aprobaron sin errores de tipado.

El resultado de ESLint no fue satisfactorio, porque se encontraron errores y advertencias en las aplicaciones evaluadas, ademas de errores de configuracion en cuatro aplicaciones.

Por lo tanto, el proyecto requiere acciones correctivas antes de considerar aprobada completamente la calidad estatica.

## 9. Recomendaciones

- Corregir primero la configuracion ESLint de las cuatro aplicaciones que no pudieron evaluarse completamente.
- Ejecutar Prettier o ESLint con `--fix` en una rama de trabajo, despues de respaldar cambios.
- Reemplazar `any` por tipos especificos.
- Corregir promesas no controladas.
- Eliminar variables no utilizadas.
- Integrar `pnpm lint` en GitHub Actions.
- Establecer un umbral de errores permitido igual a cero.
- Repetir el analisis despues de las correcciones.