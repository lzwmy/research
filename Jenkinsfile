pipeline {
	agent any
	environment {
			fixedEmailList = 'stirling.li@emhi.cn'
			dockerProject = 'research-web'
			copyFiles = 'docker/'
	}
	stages{
        stage('Build') {
  				steps {
  					script {
  					    packageJson = readJSON file: 'package.json'
  						def nodejsHome=tool 'nodejs'
  						env.PATH = "${nodejsHome}/bin:${env.PATH}"
  					}
  					sh "npm install"
  					sh "npm run build"
  					script {
  						sh "../copy_files.sh . ${copyFiles} ${packageJson.name}/"
  					}
  				}
  			}
  			stage('Deploy') {
  				steps {
  					fileOperations([fileZipOperation("${packageJson.name}/${packageJson.name}")])
  					ftpPublisher alwaysPublishFromMaster: false, masterNodeName: '', paramPublish: null, continueOnError: false, failOnError: false, publishers: [[configName: 'phsms', transfers: [[asciiMode: false, cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "phsms/${packageJson.name}/${packageJson.version}", remoteDirectorySDF: false, removePrefix: '', sourceFiles: "${packageJson.name}.zip"]], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false]]
  				}
  			}
  	}
  	post {
  		always {
  			script {
  				gitCommitEmail=sh(script:'git --no-pager show -s --format=\'%ae\'',returnStdout:true)
  				emailList=fixedEmailList.contains(gitCommitEmail)?fixedEmailList:fixedEmailList+','+gitCommitEmail
  			}
  			cleanWs()
  			emailext body: '$DEFAULT_CONTENT', subject: '$DEFAULT_SUBJECT', to: emailList
  		}
  	}
  }

