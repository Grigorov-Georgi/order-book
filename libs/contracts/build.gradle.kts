plugins {
    id("java-library")
}

dependencies {
    api(project(":libs:domain"))
    testImplementation(libs.junit)
}
