# Plataforma como Servicio (PaaS) para el Despliegue de la Aplicación
Vamos a seleccionar un PaaS adecuado para desplegar nuestra aplicación en la nube, asegurando compatibilidad con los requisitos del proyecto y cumplimiento con las normativas europeas.

## Criterios
- **Compatibilidad**: Debe soportar el stack tecnológico del proyecto (Node.js con TypeScript) y permitir configuración desde ficheros o comandos CLI.
- **Despliegue automático**: Debe ser posible configurar despliegues automáticos desde GitHub al hacer un push a ramas específicas.
- **Coste**: Debe ofrecer un nivel gratuito o ser económicamente viable para un proyecto académico.
- **Facilidad de uso**: Herramientas y documentación que simplifiquen el proceso de despliegue.

## Opciones

### Heroku
- **Compatibilidad**: Soporte nativo para Node.js y despliegue mediante Procfile.
- **Despliegue automático**: Habilita despliegues automáticos desde GitHub.
- **Coste**: Nivel gratuito limitado a 550-1,000 horas de uso al mes.
- **Facilidad de uso**: Documentación extensa y CLI amigable.
- **Contras**: Nivel gratuito incluye hibernación de aplicaciones tras inactividad.

### Render
- **Compatibilidad**: Soporte para Node.js y despliegue mediante un archivo render.yaml.
- **Despliegue automático**: Compatible con despliegues desde GitHub.
- **Coste**: Nivel gratuito que incluye 750 horas al mes y una base de datos gratuita de 512 MB.
- **Facilidad de uso**: GUI moderna y configuración sencilla.
- **Contras**: Comunidad menos activa que Heroku.

### Vercel
- **Compatibilidad**: Excelente para aplicaciones front-end, aunque puede soportar backend sencillo con serverless functions.
- **Despliegue automático**: Despliegue inmediato tras push en GitHub.
- **Coste**: Nivel gratuito ilimitado para proyectos académicos básicos.
- **Facilidad de uso**: Ideal para proyectos con enfoque en front-end.
- **Contras**: No es ideal para aplicaciones con backend intensivo.

### Railway
- **Compatibilidad**: Soporte para Node.js y despliegue con archivo railway.json.
- **Despliegue automático**: Integración directa con GitHub.
- **Coste**: Nivel gratuito con $5 de créditos mensuales.
- **Facilidad de uso**: Interfaz intuitiva y buen soporte técnico.
- **Contras**: Créditos gratuitos limitados.

## Decisión final
Dada la naturaleza de nuestra aplicación, la necesidad de compatibilidad con Node.js y TypeScript, facilidad de configuración desde GitHub, optamos por Render como PaaS.

Render combina un nivel gratuito generoso, despliegue desde GitHub, y soporte adecuado para aplicaciones backend, lo que lo hace ideal para cumplir con los requisitos del proyecto.