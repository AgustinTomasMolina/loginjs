# Usa la imagen base de Node.js
FROM node:latest

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de tu proyecto al contenedor
COPY . .

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]

ENV ROOT_PATH=/usr/src/app
