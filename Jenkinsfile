pipeline {
  agent any
  parameters {
  choice(name:'VERSION', choices:['1.0','1.1','1.2'], description:'Version of the build')
  booleanParam(name:'executeTests', defaultValue:false)
  }
  stages {
    stage("build"){
      steps{
        
        echo "build ${VERSION}"
      }
  }
    stage("test"){
      when {
        expression {
          params.executeTests
        }
      }
      steps {
      echo "test"
      }
  }
}
}
