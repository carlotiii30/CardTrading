# Configuración de la Base de Datos en Render

Inicialmente, el proyecto utilizaba una base de datos PostgreSQL en un entorno local mediante Docker. 
Sin embargo, esta configuración no era viable para su despliegue en la plataforma Render debido a las siguientes razones:

- **Accesibilidad**: Render no puede acceder a contenedores de Docker locales.
- **Persistencia**: Los datos en un entorno local no se mantienen tras despliegues en la nube.
- **Configuración de red**: Render requiere una URL accesible para conectarse a la base de datos.

Por estas razones, se ha optado por migrar la base de datos a un servicio gestionado en Render, garantizando una configuración estable y accesible desde el servidor backend desplegado.

## Configuración de la Base de Datos en Render
1. Creación de la base de datos.
2. Definición de variables de entorno en Render.
3. Actualización de la configuración del proyecto.
4. Migración de los datos.
5. Despliegue.

