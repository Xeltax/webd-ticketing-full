# Utiliser une image officielle Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY microservice-authentication/package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet
COPY microservice-authentication/ ./

RUN npm run build

# Exposer le port du microservice
EXPOSE 4000

# Lancer l'application
CMD ["npm", "run", "start"]
