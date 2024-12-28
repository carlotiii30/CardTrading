# CardTrading
Este es el repositorio del proyecto **CardTrading**, desarrollado para la asignatura de **Cloud Computing** del Máster de Ingeniería Informática.

## Contenidos
1. [Hito 1: Repositorio de prácticas y definición del proyecto](#hito-1-repositorio-de-prácticas-y-definición-del-proyecto)
2. [Hito 2: Integración Continua](#hito-2-integración-continua)
3. [Hito 3: Diseño de Microservicios](#hito-3-diseño-de-microservicios)
4. [Hito 4: Composición de Servicios](#hito-4-composición-de-servicios)

---

## Hito 1: Repositorio de prácticas y definición del proyecto
### Documentación
La definición del proyecto, incluyendo los objetivos y requisitos, está documentada en el archivo [definición](./docs/definicion.md).

---

## Hito 2: Integración Continua
### Documentación
- **Gestores de dependencia y herramientas seleccionadas**: [gestores](./docs/gestores.md)
- **Sistema de integración continua**: [integración continua](./docs/integracion_continua.md)
- **Estrategias de testing**: [herramientas de tests](./docs/tests.md)

### Código
- **Tests**: Los tests implementados se encuentran en la carpeta [tests](./backend/tests).
- **Workflows de CI**: El workflow de GitHub Actions está definido en [ci.yml](.github/workflows/ci.yml).

---

## Hito 3: Diseño de Microservicios
### Documentación
- **Framework para la API**: [documentación del framework](./docs/api.md)
- **Sistema de logs**: [sistema de logs](./docs/logs.md)
- **Testing de endpoints**: Detalles en el documento [tests](./docs/tests.md).

### Código
- **Endpoints de la API**: Se encuentran en la carpeta [routes](./backend/src/routes).
- **Tests para la API**: Ubicados en [tests](./backend/tests).

---

## Hito 4: Composición de Servicios
### Documentación
- **Configuración del clúster de contenedores**: [composición de servicios](./docs/compose.md)
- **Dockerfile de la aplicación**: [Dockerfile](./backend/Dockerfile)
- **Publicación de contenedores**: Instrucciones y detalles en [contenedores](./docs/contenedores.md).
- **Fichero `docker-compose.yml`**: La configuración del clúster se encuentra en el archivo [docker-compose.yml](./docker-compose.yml).
- **Tests del clúster de contenedores**: Documentación en [tests del clúster](./docs/tests_clúster.md).

### Código
- **Fichero de composición**: [docker-compose.yml](./docker-compose.yml)
- **Scripts de automatización**: 
  - **Iniciar contenedores**: `yarn docker:start`
  - **Parar contenedores**: `yarn docker:stop`
  - **Ejecutar tests en Docker**: `yarn docker:test`
