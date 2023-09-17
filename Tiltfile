SOURCE_IMAGE = os.getenv("SOURCE_IMAGE", default='dev.local/tanzu-java-web-app-source')
LOCAL_PATH = os.getenv("LOCAL_PATH", default='.')
NAMESPACE = os.getenv("NAMESPACE", default='default')

update_settings (k8s_upsert_timeout_secs = 120) 

local_resource(
    'build',
    'npm run build',
    deps=['./src'],
)

k8s_custom_deploy(
    'price-game',
     apply_cmd="tanzu apps workload apply -f config/workload.yaml --update-strategy replace --debug --live-update" +
               " --local-path " + LOCAL_PATH +
               " --namespace " + "dev-live" +
               " --yes " +
               "> /dev/null" +
                " && kubectl get workload price-game --namespace " + "dev-live" + " -o yaml",
     apply_cmd_bat="tanzu apps workload apply -f config/workload.yaml --update-strategy replace --debug --live-update" +
              " --local-path " + LOCAL_PATH +
              " --namespace " + "dev-live" +
              " --yes " +
              "> NUL" +
              " && kubectl get workload price-game --namespace " + "dev-live" + " -o yaml",              
    delete_cmd="tanzu apps workload delete -f config/workload.yaml --namespace " + NAMESPACE + " --yes",
    deps=['./build'],
    container_selector='workload',
    live_update=[
      sync('./build', '/workspace/build')
    ]
)

k8s_resource('price-game', port_forwards=["8081:8080"],
            extra_pod_selectors=[{'carto.run/workload-name': 'price-game', 'app.kubernetes.io/component': 'run'}])

allow_k8s_contexts('tap-iterate')