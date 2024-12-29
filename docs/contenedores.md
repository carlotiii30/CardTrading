# Contenedores

## Configuración

### app
- **Imagen base:** `node:14-alpine`
- **Justificación:** Se elige una imagen ligera de Node.js para ejecutar la aplicación de manera eficiente.

### db
- **Imagen base:** `postgres:13`
- **Justificación:** PostgreSQL 13 proporciona las funcionalidades necesarias para el almacenamiento de datos.

### elasticsearch
- **Imagen base:** `elasticsearch:7.10.1`
- **Justificación:** Versión compatible con las necesidades de logging de la aplicación.

### kibana
- **Imagen base:** `kibana:7.10.1`
- **Justificación:** Proporciona una interfaz gráfica para visualizar los logs almacenados en Elasticsearch.

### test
- **Imagen base:** `node:14-alpine`
- **Justificación:** Utiliza la misma imagen que `app` para garantizar la coherencia en el entorno de pruebas.


## Publicación

### Proceso de Publicación
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
