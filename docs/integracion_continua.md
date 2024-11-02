# Integración Continua
Tenemos que elegir un sistema de integración continua adecuado
para el proyecto, para ello, hemos establecido algunos criterios
teniendo en cuenta las necesidades actuales y las futuras.

## Criterios
- **Gratuidad**: Gratuito, de código abierto.
- **Compatibilidad con Docker**: Integración con contenedores Docker.
- **Compatibilidad con Github**: Integración con repositorios de GitHub.

## Opciones
Entre las muchas opciones de sistemas de integración continua encontramos Jenkins,
Travis CI, CircleCI, GitLab CI/CD y Semaphore CI. Además de la propia integración
de GitHub, GitHub Actions.

De los mencionados, vamos a descartar los que no son gratuitos por completo, si
no que ofrecen planes de prueba, o solo algunas funcionalidades. Por tanto, nos
quedamos con Jenkins, GitLab y GitHub Actions.

Jenkins tiene soporte para Docker y está bien integrado con GitHub, pero necesita
complementos; GitLab tiene integración nativa con Docker y se puede integrar con
repositorios de GitHub, por lo que la opción mas conveniente entre estos dos
sería la segunda.

## Decisión final
A pesar de que la plataforma GitLab nos ofrece todo lo que estamos buscando, 
GitHub ya nos da un sistema, sin necesidad de ningún tipo de integración ni
de configuración adicional, así que será GitHub Actions la herramienta que
utilizaremos para la integración continua.

## Versiones
Un tema a tener en cuenta es la versión que vamos a utilizar en el flujo de
trabajo, en este caso, vamos a testear tres para tener una mayor confianza: la
versión actual de Node (22), la LTS (20) y la anterior a la LTS.