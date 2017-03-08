var renderer = new THREE.WebGLRenderer()
renderer.setSize(750, 1206)
document.querySelector('body').appendChild(renderer.domElement)
renderer.setClearColor(0x000000)


var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, 750 / 1206, 1, 10)
camera.position.set(5, 5, 5)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)


var cube = new THREE.Mesh(
    new THREE.CubeGeometry(1, 2, 3),
    new THREE.MeshBasicMaterial({
        color: 0xff4956,
        wireframe: true
    })
)
scene.add(cube)

var Torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 10, 10),
    new THREE.MeshBasicMaterial({
        color: 0xff4956,
        wireframe: true
    })
)
Torus.position.x = 0.5
Torus.position.y = -1
Torus.position.z = 1
Torus.rotateY(Math.PI / 2)
scene.add(Torus)

var Torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 10, 10),
    new THREE.MeshBasicMaterial({
        color: 0xff4956,
        wireframe: true
    })
)
Torus2.position.x = 0.5
Torus2.position.y = -1
Torus2.position.z = -1
Torus2.rotateY(Math.PI / 2)
scene.add(Torus2)

var Torus3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 10, 10),
    new THREE.MeshBasicMaterial({
        color: 0xff4956,
        wireframe: true
    })
)
Torus3.position.x = -0.5
Torus3.position.y = -1
Torus3.position.z = 1
Torus3.rotateY(Math.PI / 2)
scene.add(Torus3)


var Torus4 = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 10, 10),
    new THREE.MeshBasicMaterial({
        color: 0xff4956,
        wireframe: true
    })
)
Torus4.position.x = -0.5
Torus4.position.y = -1
Torus4.position.z = -1
Torus4.rotateY(Math.PI / 2)
scene.add(Torus4)




renderer.render(scene, camera)