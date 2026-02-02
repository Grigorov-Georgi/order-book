plugins {
    id("java")
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
}

dependencies {
    implementation(project(":libs:contracts"))
    implementation(project(":libs:domain"))
    implementation(project(":libs:common"))
    implementation(libs.spring.boot.starter.web)
    implementation(libs.spring.boot.starter.actuator)
    implementation(libs.spring.kafka)
    testImplementation(libs.junit)
}
