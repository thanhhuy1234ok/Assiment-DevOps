# CI/CD Project with Jenkins, Docker, MongoDB, Express, and React

This README provides step-by-step instructions to set up and deploy a CI/CD pipeline using Jenkins, Docker, MongoDB, Express (backend), and React (frontend).

---

## **1. Project Overview**

This project demonstrates a CI/CD pipeline that:

1. Builds Docker images for the backend (Express) and frontend (React).
2. Pushes these images to Docker Hub.
3. Deploys the application using Docker Compose with MongoDB as the database.
4. Sends build notifications via Telegram.

---

## **2. Prerequisites**

### **2.1 Tools and Technologies**
- **Jenkins**: CI/CD server
- **Docker**: For containerization
- **Docker Compose**: For managing multiple containers
- **Git**: Version control
- **MongoDB**: Database
- **Express**: Backend API
- **React**: Frontend application

### **2.2 Accounts and Setup**
- **Docker Hub**: Create an account to push Docker images.
- **Telegram Bot**:
  1. Use [@BotFather](https://t.me/BotFather) on Telegram to create a bot and get your bot token.
  2. Find your chat ID using tools like [getIDBot](https://t.me/getidbot).

---

## **3. Repository Structure**

```plaintext
project/
├── backend/                 # Express backend
│   ├── Dockerfile
│   ├── main.js
│   └── ...
├── frontend/                # React frontend
│   ├── Dockerfile
│   ├── src/
│   └── ...
├── docker-compose.yml       # Docker Compose file
├── .gitignore               # Gitignore file
├── Jenkinsfile              # Jenkins pipeline script
└── README.md                # This documentation
```

---

## **4. Step-by-Step Instructions**

### **4.1 Clone the Repository**
1. Create a GitHub repository (e.g., `Assiment-DevOps`).
2. Clone the repository locally:
   ```bash
   git clone https://github.com/<your_username>/Assiment-DevOps.git
   cd Assiment-DevOps
   ```
3. cd backend
    ```bash
    npm install 
   ```
4. cd frontend
    ```bash
    npm install 
    ```

### **4.2 Backend Setup**
1. Navigate to the `backend` directory.
2. Initialize the Go module:
   ```bash
   cd backend
   npm instal
   ```
3. Create a `Dockerfile` in the `backend` folder:
   ```dockerfile
    FROM node:23-alpine3.19

    WORKDIR /app
    COPY package.json .
    RUN npm install
    COPY . .

    USER node

    EXPOSE 8081

    CMD ["npm", "start"]
   ```

### **4.3 Frontend Setup**
1. Navigate to the `frontend` directory.
2. Create the React application:
   ```bash
   npx create-react-app frontend
   ```
3. Add a `Dockerfile` in the `frontend` folder:
   ```dockerfile
    FROM node:23-alpine3.19

    WORKDIR /app
    COPY package.json .
    RUN npm install
    COPY . .

    EXPOSE 5173
    CMD ["npm", "run", "dev"]
   ```

### **4.4 Add Docker Compose File**
Create a `docker-compose.yml` file in the root directory:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: express-backend
    ports:
      - "8081:8081"
    environment:
      - MONGO_URI=mongodb://mongo:27017/mydatabase
      - PORT=8081
    depends_on:
      - mongo

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: react-frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### **4.5 Set Up Jenkins**
1. Install Jenkins and required plugins:
   - Docker
   - Docker Pipeline
   - Git
   - Telegram Notifications
2. Add Docker Hub credentials to Jenkins.
3. Configure the GitHub repository webhook to trigger Jenkins builds.

### **4.6 Add Jenkinsfile**
1. Place the following `Jenkinsfile` in the root directory:
  
   pipeline {
       agent any

       environment {
           DOCKER_REGISTRY = 'your_dockerhub_username'
           BACKEND_IMAGE = "${DOCKER_REGISTRY}/backend-app"
           FRONTEND_IMAGE = "${DOCKER_REGISTRY}/frontend-app"
           TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'
           TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID'
            DOCKER_TAG = 'version_tag'
       }

       stages {
           stage('Clone Repository') {
               steps {
                   git branch: 'main', url: 'https://github.com/your_username/ci-cd-demo.git'
               }
           }

           stage('Build Backend') {
               steps {
                   dir('backend') {
                       script {
                           docker.build("${BACKEND_IMAGE}:${DOCKER_TAG}")
                       }
                   }
               }
           }

           stage('Build Frontend') {
               steps {
                   dir('frontend') {
                       script {
                           docker.build("${FRONTEND_IMAGE}:${DOCKER_TAG}")
                       }
                   }
               }
           }

           stage('Push to Docker Hub') {
               steps {
                   script {
                       docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                           docker.image("${BACKEND_IMAGE}:${DOCKER_TAG}").push()
                           docker.image("${FRONTEND_IMAGE}:${DOCKER_TAG}").push()
                       }
                   }
               }
           }

           stage('Deploy Services') {
               steps {
                   sh 'docker-compose up -d'
               }
           }
       }

       post {
           success {
               sendTelegramMessage("✅ Build #${BUILD_NUMBER} completed successfully!")
           }
           failure {
               sendTelegramMessage("❌ Build #${BUILD_NUMBER} failed.")
           }
       }
   }
   def sendTelegramMessage(String message) {
       sh """
       curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
       -d chat_id=${TELEGRAM_CHAT_ID} \
       -d text="${message}"
       """
   }
   ```

### **4.7 Run the Pipeline**
1. Push your code to GitHub.
2. Trigger a Jenkins build manually or via webhook.
3. Verify the application by accessing:
   - **Frontend**: `http://localhost:5173`
   - **Backend**: `http://localhost:8081`

---

## **5. Troubleshooting**
- Ensure Docker and Docker Compose are installed and running.
- Check Jenkins logs if builds fail.
- Verify MongoDB service connectivity from the backend.
- Test Telegram notifications using `curl` commands.

---

## **6. Future Enhancements**
- Add unit tests for backend and frontend.
- Deploy to a cloud platform (AWS, GCP, Azure).
- Use Kubernetes for scaling services.

---