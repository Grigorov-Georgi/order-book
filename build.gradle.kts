plugins {
    id("java")
    id("io.spring.dependency-management") version "1.1.4" apply false
}

allprojects {
    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "java")
    
    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }
}
