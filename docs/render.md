
# Render

## Configuración del Archivo `render.yaml`
El archivo `render.yaml` es utilizado para definir cómo se debe construir y ejecutar la aplicación en Render. Este archivo debe estar en la raíz del repositorio.

## Cambios Realizados en el Código

### **Compilar Antes de Ejecutar (Optimización de Memoria)**
- **Problema**: Usar `ts-node` directamente para ejecutar el código TypeScript en un entorno de producción consume más memoria y puede causar errores.
- **Solución**: Se añadió un script en el `package.json` para compilar el código antes de ejecutarlo.

```json
"scripts": {
  "build": "tsc",
  "start-js": "node dist/app.js"
}
```

Ahora, el proyecto se compila en la fase de construcción y el archivo transpilado es ejecutado en producción.

### **Manejo de Variables de Entorno**
- **Problema**: La aplicación no encontraba la configuración de la base de datos.
- **Solución**: Se configuraron variables de entorno en Render para la conexión a la base de datos.

## Validación Local
Antes de desplegar en Render, se validó el flujo localmente:

1. **Instalación de Dependencias**:
   ```bash
   cd backend
   yarn
   ```

2. **Compilación del Código**:
   ```bash
   yarn build
   ```

3. **Verificación de los Archivos Generados**:
   ```bash
   ls -R dist
   ```

4. **Ejecución del Archivo Compilado**:
   ```bash
   node dist/app.js
   ```

## Conclusión
Con estas configuraciones y ajustes, la aplicación se despliega correctamente en Render. La optimización de memoria y la configuración del entorno de producción aseguran un funcionamiento estable y eficiente.

Para futuros despliegues...
1. Validar el flujo localmente.
2. Mantener actualizadas las variables de entorno en Render.
3. Revisar los logs en caso de errores durante el despliegue.
