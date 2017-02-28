var renderer = new THREE.WebGLRenderer()
renderer.setSize(750, 1206)
document.querySelector('body').appendChild(renderer.domElement)
renderer.setClearColor(0x000000) //要渲染了才能看得到


// sence
var scene = new THREE.Scene()


// camera
var camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)


// cube
var cube = new THREE.Mesh(
	new THREE.CubeGeometry(1, 2, 3),
	new THREE.MeshBasicMaterial({
		color: 0xff4956
	})
)
scene.add(cube)

renderer.render(scene, camera)

