plugins {
    id("java")
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.jib)
}

dependencies {
    implementation(platform(libs.spring.boot.dependencies))
    implementation(project(":libs:contracts"))
    implementation(project(":libs:domain"))
    implementation(project(":libs:common"))
    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    implementation(libs.spring.boot.starter.web)
    implementation(libs.spring.boot.starter.actuator)
    implementation(libs.spring.kafka)
    implementation(libs.kafka.clients)
    testCompileOnly(libs.lombok)
    testAnnotationProcessor(libs.lombok)
    testImplementation(libs.junit)
}


springBoot {
    mainClass.set("io.orderable.orderapi.Main")
}

jib {
    from {
        image = "eclipse-temurin:22-jre"
        platforms {
            platform {
                os = "linux"
                architecture = "arm64"
            }
        }
    }
    to {
        image = "order-book/order-api:dev"
    }
    container {
        mainClass = "io.orderable.orderapi.Main"
        ports = listOf("8080")
        creationTime = "USE_CURRENT_TIMESTAMP"
    }
}

tasks.filter { it.name in setOf("jibDockerBuild", "jibBuildTar", "jib") }.onEach {
  it.notCompatibleWithConfigurationCache("Jib is not compatible with configuration cache")
}
