plugins {
    id("java-library")
    alias(libs.plugins.protobuf)
}

dependencies {
    api(project(":libs:domain"))
    api(libs.protobuf.java)
    testImplementation(libs.junit)
}

protobuf {
    protoc {
        artifact = libs.protobuf.protoc.get().toString()
    }
}
