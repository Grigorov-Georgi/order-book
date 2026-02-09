plugins {
    id("java")
    alias(libs.plugins.spring.boot)
}

dependencies {
    implementation(project(":libs:contracts"))
    implementation(project(":libs:domain"))
    implementation(libs.spring.boot.starter.web)
    implementation(libs.spring.boot.starter.actuator)
    testImplementation(libs.junit)
}
