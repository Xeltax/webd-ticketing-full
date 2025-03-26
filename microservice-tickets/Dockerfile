# Utiliser une image officielle Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY microservice-tickets/package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet
COPY microservice-tickets/ ./

# Copier Prisma depuis le dossier racine
COPY ../prisma ./prisma

# Générer Prisma Client (important)
RUN npx prisma generate

RUN npm run build

# Exposer le port du microservice
EXPOSE 4000

# Lancer l'application
CMD ["npm", "run", "start"]
