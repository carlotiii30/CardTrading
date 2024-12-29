# Usa una imagen base oficial de Node.js (slim para reducir tamaño)
FROM node:18-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json ./

# Instala las dependencias en el entorno del contenedor
RUN yarn install --frozen-lockfile

# Copia el resto de los archivos de la aplicación
COPY . .

# Establece permisos correctos para evitar ejecutar como root
RUN adduser --disabled-password appuser && chown -R appuser /app
USER appuser

# Expone el puerto que usará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["yarn", "start"]