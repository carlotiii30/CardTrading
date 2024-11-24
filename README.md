# CardTrading
Proyecto de la asignatura Cloud Computing del master de Ingeniería Informática

## Hito 1: Repositorio de pácticas y definición del proyecto
En el documento [definición](./docs/definicion.md) se encuentra la definición
del proyecto y la configuración del repositorio de GitHub.

## Hito 2: Integración Continua
Con respecto a la parte de documentación...
La explicación de la elección de los gestores está en [gestores](./docs/gestores.md),
por otro lado tenemos, las [herramientas de tests](./docs/tests.md)
y el sistema de [integración continua](./docs/integracion_continua.md).

En cuanto a la parte de código...
Los tests se encuentran en [tests](./backend/tests), mientras que el workflow
de GitHub Actions para la integración continua está en [ci](.github/workflows/ci.yml)

## Hito 3: Diseño de Microservicios
La documentación del framework elegido para la API lo encontramos [aqui](./docs/api.md),
mientras que la del logger seleccionado podemos verla en [sistema de logs](./docs/logs.md).
La documentación de los tests de los endpoints se ha incluido en el documento
[tests](./docs/tests.md)

Por otro lado, en [routes](./backend/src/routes/) encontramos los endpoints
y en [tests](./backend/tests) se han incluido los tests referentes a la API. 
