# Utiliser une image de base
FROM node:16

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet dans le conteneur
COPY . .

# RUN est une instruction lancée au build de l'image.
# Installer les dépendances (installation au sein du projet)
RUN npm install

# Installer nodemon dans le conteneur (installation dans l'environnement de développement)
RUN npm install -g nodemon

#Cmd est une instruction lancée à l'instanciation du conteneur.
# Commande à exécuter au démarrage du conteneur
CMD ["npm", "start"]