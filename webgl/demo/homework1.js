var renderer = new THREE.WebGLRenderer()
renderer.setSize(750, 1206)
document.querySelector('body').appendChild(renderer.domElement)
renderer.setClearColor(0x000000)


var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, 750 / 1206, 1, 10)
camera.position.set(-5, 5, 5)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)


var cube = new THREE.Mesh(
    new THREE.CubeGeometry(1, 2, 3),
    new THREE.MeshPhongMaterial({
        color: 0xff4956
    })
)
scene.add(cube)

var Torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xff4956
    })
)
Torus.position.x = 0.55
Torus.position.y = -1
Torus.position.z = 1
Torus.rotateY(Math.PI / 2)
scene.add(Torus)

var Torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xff4956
    })
)
Torus2.position.x = 0.55
Torus2.position.y = -1
Torus2.position.z = -1
Torus2.rotateY(Math.PI / 2)
scene.add(Torus2)

var Torus3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xff4956
    })
)
Torus3.position.x = -0.55
Torus3.position.y = -1
Torus3.position.z = 1
Torus3.rotateY(Math.PI / 2)
scene.add(Torus3)


var Torus4 = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xff4956
    })
)
Torus4.position.x = -0.55
Torus4.position.y = -1
Torus4.position.z = -1
Torus4.rotateY(Math.PI / 2)
scene.add(Torus4)

 var ambientLight = new THREE.AmbientLight(0x666666)  // 添加环境光
 scene.add(ambientLight)

 var directionalLight = new THREE.DirectionalLight(0x989898) // 添加平行光
 directionalLight.position.set(-5, 5, 5)   // 设置平行光光源位置
 scene.add(directionalLight)


renderer.render(scene, camera)