# Composición de Servicios

## Decisiones de Diseño
Para la configuración de los servicios de nuestra aplicación, utilizamos Docker Compose, lo que nos permite desplegar y orquestar múltiples contenedores de manera eficiente.

### Servicios Incluidos
- **app**: Contenedor principal que ejecuta la lógica de la aplicación.
- **db**: Contenedor para la base de datos PostgreSQL, encargado de almacenar los datos de la aplicación.
- **elasticsearch**: Servicio para almacenar y buscar logs estructurados.
- **kibana**: Herramienta para visualizar los logs almacenados en Elasticsearch.
- **test**: Contenedor especializado en ejecutar los tests de integración.

### Volúmenes y Redes
- **Volúmenes**:
  - `db_data`: Persiste los datos de la base de datos entre reinicios.
  - `es_data`: Persiste los índices de Elasticsearch.
- **Redes**:
  - `app_network`: Garantiza la comunicación segura entre los contenedores.

### Configuración de los Servicios
- **Base de Datos (PostgreSQL)**:
  - Configurada con un usuario, contraseña y base de datos inicial predefinidos.
  - Incluye scripts para verificar y crear bases de datos necesarias en el entorno de test.
- **Elasticsearch y Kibana**:
  - Configuración simplificada para un nodo único, ideal para entornos de desarrollo y pruebas.
- **Aplicación (app)**:
  - Expone el puerto 3000 para interactuar con la API.
  - Define dependencias de otros servicios como `db` y `elasticsearch`.

### Justificación
Docker Compose se seleccionó debido a su facilidad para gestionar configuraciones multi-contenedor y su compatibilidad con entornos locales y CI/CD.
