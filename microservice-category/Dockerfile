# Utiliser une image officielle Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY microservice-category/package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet
COPY microservice-category/ ./

# Copier Prisma depuis le dossier racine
COPY ../prisma ./prisma

# Générer Prisma Client (important)
RUN npx prisma generate

# Compiler TypeScript
RUN npm run

RUN npm run build

# Exposer le port du microservice
EXPOSE 4000

# Lancer l'application
CMD ["npm", "run", "start"]
