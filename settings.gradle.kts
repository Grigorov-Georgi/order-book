plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "order-book"

include("apps:order-api")
include("apps:orderbook-worker")
include("apps:query-api")
include("libs:contracts")
include("libs:domain")
include("libs:common")
