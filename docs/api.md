# API  
Para la implementación de la API debemos elegir un framework adecuado que cumpla
con una serie de requisitos.  

## Criterios  
- **Compatibilidad**: Compatible con nuestro entorno de ejecución.  
- **Rendimiento**: Capaz de manejar una gran cantidad de solicitudes concurrentes
de manera eficiente.  
- **Modularidad**: Permitir un diseño desacoplado basado en controladores, servicios
y modelos para facilitar el mantenimiento y la evolución.  
- **Mantenimiento**: Comunidad activa, actualizaciones frecuentes y documentación
clara.  
- **Extensibilidad**: Flexibilidad para integrar middleware adicional como
autenticación, validación y gestión de errores.  

## Opciones  
Consideramos Express.js, Koa, y NestJS, cada uno con características destacadas.
Express.js se presenta como una solución ampliamente utilizada en el ecosistema Node.js,
con excelente compatibilidad con TypeScript a través de bibliotecas como @types/express.
Ofrece una modularidad destacada mediante rutas y middlewares, además de contar con una
comunidad activa y actualizaciones regulares, obteniendo una puntuación de 90 en Snyk.

Por otro lado, Koa, a pesar de ser más rápido gracias a su arquitectura basada en promesas
y async/await, requiere una configuración inicial más compleja para funcionalidades comunes,
y su comunidad, aunque sólida, es más pequeña, con una puntuación de 84 en Snyk.

Finalmente, NestJS sobresale por su arquitectura robusta basada en controladores, servicios
y módulos, diseñada específicamente para TypeScript. Sin embargo, su naturaleza opinada lo
hace menos flexible que Express o Koa, y su curva de aprendizaje es más pronunciada.

## Decisión final  
Dada la necesidad de un framework probado, extensible y con una gran comunidad,
optamos por Express.js. Su compatibilidad con TypeScript y la facilidad para
integrar middlewares lo convierten en la mejor opción para esta API.