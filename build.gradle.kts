import com.diffplug.gradle.spotless.SpotlessExtension
import org.gradle.language.base.plugins.LifecycleBasePlugin

plugins {
    id("java")
    alias(libs.plugins.spotless) apply false
}

val rootSpotlessCheck = tasks.register("spotlessCheck") {
    group = LifecycleBasePlugin.VERIFICATION_GROUP
    description = "Runs Spotless checks for all Java modules."
}

val rootSpotlessApply = tasks.register("spotlessApply") {
    group = "formatting"
    description = "Applies Spotless formatting to all Java modules."
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
            languageVersion = JavaLanguageVersion.of(22)
        }
    }

    if (childProjects.isEmpty()) {
        apply(plugin = "com.diffplug.spotless")

        extensions.configure(SpotlessExtension::class.java) {
            java {
                target("src/*/java/**/*.java")
                googleJavaFormat()
                removeUnusedImports()
                trimTrailingWhitespace()
                endWithNewline()
            }
        }

        rootSpotlessCheck.configure {
            dependsOn(tasks.named("spotlessCheck"))
        }

        rootSpotlessApply.configure {
            dependsOn(tasks.named("spotlessApply"))
        }
    }
}

tasks.named("check") {
    dependsOn(rootSpotlessCheck)
}
