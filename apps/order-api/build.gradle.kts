plugins {
    id("java")
    alias(libs.plugins.spring.boot)
}

dependencies {
    implementation(platform(libs.spring.boot.dependencies))
    implementation(project(":libs:contracts"))
    implementation(project(":libs:domain"))
    implementation(project(":libs:common"))
    implementation(libs.spring.boot.starter.web)
    implementation(libs.spring.boot.starter.actuator)
    implementation(libs.spring.kafka)
    testImplementation(libs.junit)
}


springBoot {
    mainClass.set("io.orderable.orderapi.Main")
}
