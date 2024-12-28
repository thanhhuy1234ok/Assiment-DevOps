pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'thanhhuy1234ok/lap2-devops-jenkins'
        DOCKER_TAG = 'main'
        TELEGRAM_BOT_TOKEN = '6491846812:AAFEEkxM3JWVEtjMJQzB_RdJztPwT5W_9I0'
        TELEGRAM_CHAT_ID = '-4027852461'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/thanhhuy1234ok/Assiment-DevOps.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Không sử dụng sudo, đảm bảo user Jenkins có quyền chạy Docker
                    sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo "DOCKER_IMAGE: ${DOCKER_IMAGE}"
                    echo "DOCKER_TAG: ${DOCKER_TAG}"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "${DOCKER_IMAGE}:${DOCKER_TAG} pushed to Docker Hub!"
                    // Đăng nhập và đẩy image lên Docker Hub
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy Golang to DEV') {
            steps {
                echo 'Deploying to DEV...'
                // Kéo image từ Docker Hub
                sh 'docker image pull ${DOCKER_IMAGE}:${DOCKER_TAG}'

                // Dừng container cũ nếu tồn tại
                sh 'docker container stop golang-jenkins || echo "this container does not exist"'

                // Tạo network nếu chưa có
                sh 'docker network create dev || echo "this network exists"'

                // Xóa container không dùng
                sh 'echo y | docker container prune'

                // Chạy container mới
                sh 'docker container run -d --rm --name server-golang -p 4000:3000 --network dev ${DOCKER_IMAGE}:${DOCKER_TAG}'
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