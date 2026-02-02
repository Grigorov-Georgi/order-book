# Deploying a Multirole StatefulSet

The real power of a StatefulSet comes into play when you need to have multiple Pods.
When designing an application that will use StatefulSet, Pod replicas within the StatefulSet need to know about each other and communicate with each other as part of the
stateful application design. This is the benefit, though, of using the StatefulSet type
because each of the Pods gets a unique identifier in a set known as the ordinal. You
can use this uniqueness and guaranteed ordering to assign different roles to the different unique Pods in the set and associate the same persistent disk through updates
and even deletion and re-creation.

For this example, we'll take the single Pod Redis StatefulSet from the previous section and convert it to a three-Pod setup by introducing the replica role. Redis uses a
leader/follower replication strategy, consisting of a primary Pod (in section 9.2.1, this
was the only Pod) and additional Pods with the replica role (not to be confused with
Kubernetes "replicas," which refer to all of the Pods in the StatefulSet or Deployment).

Building on the example in the previous section, we'll keep the same Redis configuration for the primary Pod and add an additional configuration file for the replicas,
which contains a reference to the address of the primary Pod. Listing 9.9 is the ConfigMap where these two configuration files are defined.

## ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-role-config
data:
  primary.conf: |
    bind 0.0.0.0
    port 6379
    protected-mode no
    appendonly yes
    dir /redis/data
  replica.conf: |
    replicaof redis-0.redis-service 6379
    bind 0.0.0.0
    port 6379
    protected-mode no
    appendonly yes
    dir /redis/data
```

ConfigMaps are simply a convenient way for us to define two configuration files, one
for each of the two roles. We could equally build our own container using the Redis
base image and put these two files in there. But since this is the only customization we
need, it's simpler to just define them here and mount them into our container.

Next, we'll update the StatefulSet workload to use an init container (i.e., a container that runs during the initialization of the Pod) to set the role of each Pod replica.
The script that runs in this init container looks up the ordinal of the Pod being initialized to determine its role and copies the relevant configuration for that role—recall
that a special feature of StatefulSets is that each Pod is assigned a unique ordinal. We
can use the ordinal value of 0 to designate the primary role, while assigning the
remaining Pods to the replica role.

This technique can be applied to a variety of different stateful workloads where
you have multiple roles. If you're looking for MariaDB, there's a great guide provided
with the Kubernetes docs: https://kubernetes.io/docs/tasks/run-application/run-replicated-stateful-application/

## StatefulSet

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  selector:
    matchLabels:
      app: redis-sts
  serviceName: redis-service
  replicas: 3
  template:
    metadata:
      labels:
        app: redis-sts
    spec:
      terminationGracePeriodSeconds: 10
      initContainers:
      - name: init-redis
        image: redis:latest
        command:
        - bash
        - "-c"
        - |
          set -ex
          # Generate server-id from Pod ordinal index.
          [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
          ordinal=${BASH_REMATCH[1]}
          echo "ordinal ${ordinal}"
          # Copy appropriate config files from config-map to emptyDir.
          mkdir -p /redis/conf/
          if [[ $ordinal -eq 0 ]]; then
            cp /mnt/redis-configmap/primary.conf /redis/conf/redis.conf
          else
            cp /mnt/redis-configmap/replica.conf /redis/conf/redis.conf
          fi
          cat /redis/conf/redis.conf
        volumeMounts:
        - name: redis-config-volume
          mountPath: /redis/conf/
        - name: redis-configmap-volume
          mountPath: /mnt/redis-configmap
      containers:
      - name: redis-container
        image: redis:latest
        command: ["redis-server"]
        args: ["/redis/conf/redis.conf"]
        volumeMounts:
        - name: redis-config-volume
          mountPath: /redis/conf/
        - name: redis-pvc
          mountPath: /redis/data
        resources:
          requests:
            cpu: 1
            memory: 4Gi
      volumes:
      - name: redis-configmap-volume
        configMap:
          name: redis-role-config
      - name: redis-config-volume
        emptyDir: {}
      volumeClaimTemplates:
      - metadata:
          name: redis-pvc
        spec:
          accessModes: [ "ReadWriteOnce" ]
          resources:
            requests:
              storage: 1Gi
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  ports:
  - port: 6379
  clusterIP: None
  selector:
    app: redis-sts
```

## Key Concepts

There's a bit to unpack here, so let's take a closer look. The main difference to our
single-instance Redis StatefulSet is the presence of an init container. This init
container, as its name suggests, runs during the initialization phase of the Pod. It
mounts two volumes, the ConfigMap and a new volume `redis-config-volume`:

- **redis-config-volume**: emptyDir mount, shared with the main container
- **redis-configmap-volume**: ConfigMap mount with the 2 files from the ConfigMap
- **redis-pvc**: The Redis data volume mount, defined in the volumeClaimTemplates section

The `redis-config-volume` is of type `emptyDir`, which allows data to be shared between
containers but does not persist data if the Pod is rescheduled (unlike PersistentVolume). We are only using this emptyDir volume to store a copy of the config, and it
is ideal for that. The init container runs a bash script contained in the YAML:

```bash
set -ex
# Generate server-id from Pod ordinal index.
[[ `hostname` =~ -([0-9]+)$ ]] || exit 1
ordinal=${BASH_REMATCH[1]}
# Copy appropriate config files from config-map to emptyDir.
mkdir -p /redis/conf/
if [[ $ordinal -eq 0 ]]; then
  cp /mnt/redis-configmap/primary.conf /redis/conf/redis.conf
else
  cp /mnt/redis-configmap/replica.conf /redis/conf/redis.conf
fi
```

This script will copy one of the two different configurations from the ConfigMap volume (mounted at `/mnt/redis-configmap`) to this shared emptyDir volume (mounted
at `/redis/conf`), depending on the ordinal number of the Pod. That is, if the Pod is
`redis-0`, the `primary.conf` file is copied; for the rest, `replica.conf` is copied.

The main container then mounts the same `redis-config-volume` emptyDir volume at `/redis/conf`. When the Redis process is started, it will use whatever configuration resides at `/redis/conf/redis.conf`.

## Testing

To try it out you can connect to the primary Pod using the port-forward/local client combination, or by creating an ephemeral Pod as documented in the previous sections. We can also connect directly with exec to quickly write some data:

```bash
$ kubectl exec -it redis-0 -- redis-cli
127.0.0.1:6379> SET capital:australia "Canberra"
OK
127.0.0.1:6379> exit
```

Then connect to a replica and read it back:

```bash
$ kubectl exec -it redis-1 -- redis-cli
Defaulted container "redis-container" out of: redis-container, init-redis (init)
127.0.0.1:6379> GET capital:australia
"Canberra"
```

The replicas are read-only so you won't be able to write data directly:

```bash
127.0.0.1:6379> SET capital:usa "Washington"
(error) READONLY You can't write against a read only replica.
127.0.0.1:6379> exit
```

## Usage Pattern

This pattern can be applied to:
- **Redis**: Primary/replica setup (as shown above)
- **Databases**: Primary/replica or master/slave configurations
- **Other stateful workloads**: Any application requiring role-based Pod configuration

The key is using the Pod ordinal (from the hostname) to determine the role and selecting the appropriate configuration file accordingly.
