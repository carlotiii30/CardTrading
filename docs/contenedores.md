# Publicación de Contenedores

## Proceso de Publicación
1. **Construcción Automática**:
   - Usamos un workflow de GitHub Actions para generar y publicar las imágenes de Docker.
   - Cada cambio en la rama principal desencadena la construcción de la imagen.

2. **Plataforma de Publicación**:
   - Las imágenes se publican en [GitHub Packages](https://github.com/carlotiii30/CardTrading/pkgs/container/cardtrading).
   - Nombramos las imágenes según las convenciones del proyecto (`cardtrading:latest`).

3. **Configuración del Dockerfile**:
   - **Base**: `node:16-alpine` por su ligereza y compatibilidad.
   - **Capas**:
     1. Instalación de dependencias.
     2. Copia del código fuente.
     3. Exposición de puertos.

4. **Variables de Entorno**:
   - Se utilizan valores predeterminados en el Dockerfile para evitar dependencias externas como `.env` en entornos de despliegue.

## Justificación
La publicación automática asegura que las imágenes estén siempre actualizadas, facilitando el despliegue en entornos de producción o pruebas.
