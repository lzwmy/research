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
						def nodejsHome=tool 'nodejs'
						env.PATH = "${nodejsHome}/bin:${env.PATH}"
					}
					sh "npm install"
					sh "npm run build"
					script {
						projectArchiveDir="../archive/${currentBuild.projectName}/"
						sh "rm -rf ${projectArchiveDir}"
						sh "mkdir -p ${projectArchiveDir}"

						sh "../copy_files.sh . ${copyFiles} ${projectArchiveDir}"
					}
				}
			}
			stage('CodeScan') {
				steps {
					script {
						scannerHome = tool 'sonar'
					}
					withSonarQubeEnv('SonarQube') {
						sh "${scannerHome}/bin/sonar-scanner -Dproject.settings=sonar-project.properties"
					}
				}
			}
			stage('Deploy') {
				steps {
					script {
					  sh "mkdir -p ${dockerProject}/"
					  sh "../copy_files.sh ../archive/${currentBuild.projectName} . ${dockerProject}/"
					  if("${relatedProjects}"!=' ') {
					  	"${relatedProjects}".split(",").each { item ->
						  	sh "../copy_files.sh ../archive/${item} . ${dockerProject}/"
							}
					  }
					}
					sshPublisher failOnError: true, publishers: [sshPublisherDesc(configName: 'DevelopmentEnviroment', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '~/deploy_tomcat' + " ${dockerProject}", execTimeout: 300000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "./", remoteDirectorySDF: false, removePrefix: '', sourceFiles: "${dockerProject}/")], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)]
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
