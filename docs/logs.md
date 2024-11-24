# Sistema de Logs
Vamos a utilizar un sistema de logs para registrar la información
relevante sobre el funcionamiento de nuesta aplicación.

## Criterios
- **Compatibilidad**: Compatible con nuestro entorno de ejecución.
- **Mantenimiento**: Comunidad activa y actualizaciones frecuentes.
- **Formato**: Formato de registro.
- **Integración con ElasticSearch**: Para el siguiente hito.

## Opciones
Las opciones barajadas son Pino, Winston y Log4js, todas compatibles
con TypeScript. Para comprobar el mantenimiento de las mismas, miramos
en Snyk, donde las puntuaciones son 94, 92 y 82, respectivamente; por
tanto, descartamos Log4js.

Pino puede producir logs en formato JSON o plano y Winston es configurable,
lo que permite registrar logs en varios formatos.

La biblioteca ```pino-elasticsearch``` facilita la integración, y los logs
pueden ser analizados con herramientas como Kibana; por su parte, la
biblioteca ```winston-elasticsearch``` también cubre esta funcionalidad.


## Decisión final
Dada la necesidad de compatibilidad con Docker y elasticsearch,
eficiencia, niveles de logs, mantenimiento y formato JSON, optaremos
por Pino como sistema de logs.
