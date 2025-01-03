pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'thanhhuy1234ok'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/backend-app"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/frontend-app"
        TELEGRAM_BOT_TOKEN = '6491846812:AAFEEkxM3JWVEtjMJQzB_RdJztPwT5W_9I0'
        TELEGRAM_CHAT_ID = '-4027852461'
        DOCKER_TAG = '1.0.0'
    }

    stages {
        stage('Clone Repository') {
             steps {
                git branch: 'main', url: 'https://github.com/thanhhuy1234ok/Assiment-DevOps.git'
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

      stage('Deploy Backend and Frontend') {
            steps {
                script {
                    sh """
                    docker container stop backend-app || echo "No existing Backend container"
                    docker container stop frontend-app || echo "No existing Frontend container"

                    docker run -d --rm --name backend-app --network dev -p 8081:8081 ${BACKEND_IMAGE}:${DOCKER_TAG}

                    docker run -d --rm --name frontend-app --network dev -p 5173:5173 ${FRONTEND_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
    }
        post { 
        always {
            // Dọn dẹp workspace
            cleanWs()
        } 
 
        success {
            // Gửi thông báo Telegram khi build thành công
            sendTelegramMessage("✅ Build #${BUILD_NUMBER} was successful! ✅")
        }

        failure {
            // Gửi thông báo Telegram khi build thất bại
            sendTelegramMessage("❌ Build #${BUILD_NUMBER} failed. ❌")
        }
    }
}


// Hàm gửi thông báo Telegram
def sendTelegramMessage(String message = "") {
    if (message.isEmpty()) {
        error "Message cannot be empty"
    }
    def curlCmd = "curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage -d chat_id=${TELEGRAM_CHAT_ID} -d text=\"${message}\""
    sh curlCmd
}