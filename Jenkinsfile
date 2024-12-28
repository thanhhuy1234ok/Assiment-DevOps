pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'thanhhuy1234ok'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/backend-app"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/frontend-app"
        TELEGRAM_BOT_TOKEN = '6491846812:AAFEEkxM3JWVEtjMJQzB_RdJztPwT5W_9I0'
        TELEGRAM_CHAT_ID = '-4027852461'
    }

    stages {
        stage('Clone Repository') {
             steps {
                git branch: 'main', url: 'https://github.com/thanhhuy1234ok/Assiment-DevOps.git'
                sh 'ls -R'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        sh 'ls -la' 
                        echo "${BACKEND_IMAGE}:1.0.0"
                        docker.build("${BACKEND_IMAGE}:1.0.0")
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        sh 'ls -la' 
                        echo "${FRONTEND_IMAGE}:1.0.0"
                        docker.build("${FRONTEND_IMAGE}:1.0.0")
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${BACKEND_IMAGE}:1.0.0").push()
                        docker.image("${FRONTEND_IMAGE}:1.0.0").push()
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