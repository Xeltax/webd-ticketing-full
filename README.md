# Webd Ticketing Full

## 📌 Introduction

Webd Ticketing Full est une application basée sur une architecture **microservices** conçue pour la gestion d'événements et de tickets. Ce projet est construit en **Node.js**, **Express**, **Next.js** et utilise **Prisma ORM** avec **PostgreSQL** comme base de données relationnelle. Il exploite **RabbitMQ** pour la communication entre microservices et **JWT** pour l'authentification et la protection des routes.

## 🏠 Architecture

L'application est divisée en **9 microservices** indépendants, chacun ayant une responsabilité spécifique :

- **Microservice-Authentication** : Gère l'authentification et la gestion des tokens JWT.
- **Microservice-User** : Gère les utilisateurs et leurs informations.
- **Microservice-Category** : Gère les catégories d'événements.
- **Microservice-Event** : Gère la création et la gestion des événements.
- **Microservice-Reservation** : Gère la réservation des tickets pour les événements.
- **Microservice-Tickets** : Gère les tickets générés après une réservation.
- **Microservice-Mailer** : Envoie des emails transactionnels via **Mailtrap**.
- **General-API** : Serveur **Express**, agit comme **gateway API** pour rediriger les requêtes vers les bons microservices.
- **General-Frontend** : **Next.js** pour la partie frontend, optimisé avec **Server-Side Rendering (SSR)**.

## 📡 Communication entre Microservices

Les microservices communiquent entre eux via **RabbitMQ** en utilisant une **queue de requête-réponse** par route API.  
Cela permet de **bien séparer les communications**, **éviter les conflits** et **assurer la scalabilité** du projet.

---

## 🛠️ Installation et Déploiement

### **📌 Prérequis**

- **Docker** et **Docker Compose** installés sur votre machine.

### **🚀 Installation**

1. **Clonez le projet :**

   ```sh
   git clone https://github.com/Xeltax/webd-ticketing-full.git
   cd webd-ticketing-full
   ```

2. **Construisez et démarrez les conteneurs :**

   ```sh
   docker compose build
   docker compose up -d
   ```

3. **Accédez à l'application :**

    - **Frontend** : `http://localhost:3000`
    - **API Gateway** : `http://localhost:8080`
    - **RabbitMQ Management** : `http://localhost:15672` (login: guest | password: guest)

---

## 🔑 **Authentification**

L'authentification est gérée via **JWT**. Certaines routes nécessitent un **token d'accès**.

### **🛠️ Exemple d'authentification**

- **POST** `/auth/login`
    - **Body** :
      ```json
      {
        "email": "user@example.com",
        "password": "password123"
      }
      ```
    - **Réponse** :
      ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR..."
      }
      ```

---

## 🖀 **Exemple de Routes**

### **🔒 Route Protégée (JWT)**

**Créer une catégorie (nécessite un token JWT)**

- **POST** `http://localhost:8080/categories`
- **Headers** :
  ```json
  {
    "Authorization": "Bearer <votre_token_jwt>"
  }
  ```
- **Body** :
  ```json
  {
    "name": "Course",
    "color": "#ff0000"
  }
  ```
- **Réponse** :
  ```json
  {
    "id": "fd4d4ea6-da37-4969-9054-01acfca261b6",
    "name": "Course",
    "color": "#ff0000"
  }
  ```

---

## 🛠️ **Technologies Utilisées**

- **Backend** : Node.js, Express, Prisma ORM, RabbitMQ, PostgreSQL
- **Frontend** : Next.js (React), Antd (Ant Design)
- **Communication** : RabbitMQ (AMQP)
- **Auth** : JWT (JSON Web Tokens)
- **Déploiement** : Docker & Docker Compose

---

## 🚀 **Pourquoi cette architecture ?**

- **🛠️ Microservices** : Chaque service est indépendant, facilitant la scalabilité et la maintenance.
- **🔗 PostgreSQL + Prisma** : Une seule base **relationnelle** simplifie la gestion des relations et optimise les requêtes grâce aux **relations Prisma**.
- **📡 RabbitMQ** : Permet une communication fluide et scalable entre microservices avec **une queue dédiée par route API**.
- **⚡ Next.js (SSR)** : Optimise les performances et gère les erreurs en cas d’indisponibilité des microservices.

---

## 📄 **Conclusion**

Ce projet met en œuvre une architecture **scalable, performante et modulaire**, idéale pour un système de gestion d’événements avec microservices.

🔥 **Déployez le projet et commencez à explorer Webd Ticketing Full dès maintenant !** 🚀
