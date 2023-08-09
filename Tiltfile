SOURCE_IMAGE = os.getenv("SOURCE_IMAGE", default='dev.local/tanzu-java-web-app-source')
LOCAL_PATH = os.getenv("LOCAL_PATH", default='.')
NAMESPACE = os.getenv("NAMESPACE", default='default')
OUTPUT_TO_NULL_COMMAND = os.getenv("OUTPUT_TO_NULL_COMMAND", default=' > /dev/null ')

local_resource(
    'build',
    'npm run build',
    deps=['./src'],
)

k8s_yaml('config/inner/config.yaml')

k8s_custom_deploy(
    'price-game',
    apply_cmd="tanzu apps workload apply -f config/inner/workload.yaml --update-strategy replace --debug --live-update" +
               " --local-path " + LOCAL_PATH +
               " --source-image " + SOURCE_IMAGE +
               " --namespace " + NAMESPACE +
               " --yes " +
               OUTPUT_TO_NULL_COMMAND +
               " && kubectl get workload price-game --namespace " + NAMESPACE + " -o yaml",
    delete_cmd="tanzu apps workload delete -f config/inner/workload.yaml --namespace " + NAMESPACE + " --yes",
    deps=['./build'],
    container_selector='workload',
    live_update=[
      sync('./build', '/workspace/build')
    ]
)

k8s_resource('price-game', port_forwards=["8081:8080"],
            extra_pod_selectors=[{'carto.run/workload-name': 'price-game', 'app.kubernetes.io/component': 'run'}])

allow_k8s_contexts('tap-iterate')