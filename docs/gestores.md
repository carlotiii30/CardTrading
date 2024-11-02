# Gestores de dependencias y de tareas
Para la elección del gestor de dependencias y del gestor de tareas tenemos que
tener en cuenta que el lenguaje que estamos utilizando es TypeScript. 
Además, vamos a establecer unos criterios para la elección de los mismos.


## Criterios de elección para el gestor de dependencias
- **Seguridad**: Evitar que los paquetes tengan vulnerabilidades conocidas.
- **Estabilidad**: Intentar que las bibliotecas utilizadas se mantengan
constantes.
- **Comunidad**: Cantidad de recursos desarrollados, y ayuda en la resolución
de problemas.


## Criterios de elección para el gestor de tareas
- **Rendimiento**: Velocidad y eficiencia.
- **Comunidad**: Proporcionar soluciones rápidas a problemas comunes.
- **Flexibilidad**: Adaptación a diferentes necesidades y contextos.


## Opciones
Lo primero que hemos elegido ha sido el gestor de dependencias, nuestras opciones
eran npm, pnpm y yarn. La primera de estas tiene una comunidad muy grande y activa
que proporciona soporte y actualizaciones constantes; Yarn destaca por su velocidad
y capacidad de bloquear versiones; y pnpm tiene comandos que pueden ser muy útiles.

Las opciones para el gestor de tareas son grunt, que es una opción más simple
y generalizada; y gulp, que ofrece flexibilidad en la automatización de tareas.
Además de los criterios establecidos, vamos a tener en cuenta el gestor de
dependencias elegido.


## Elección
De entre los tres gestores de dependencias, nos quedamos con [Yarn](https://yarnpkg.com).
Al haber elegido Yarn, tenemos la posibilidad de utilizarlo como gestor de tareas,
por tanto, esta va a ser nuestra elección también.