node {
    def env = ''
    configFileProvider([configFile(fileId: "${params.ENV_FILE}", variable: 'ENV')]) {
        env = readFile(ENV)
    }

    stage('Checkout'){
            checkout scm
    }


    docker.withRegistry("${params.DOCKER_REGISTRY_URL}", "${params.DOCKER_REGISTRY_CREDENTIALS}") {

        sh "rm -f .env.production"
        sh "echo \"${env}\" >> .env.production"

        stage "build"
        def app = docker.build "${params.IMAGE_NAME}", "--no-cache ."

        stage "publish"
        app.push 'latest'
    }
}
