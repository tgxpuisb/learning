var renderer = new THREE.WebGLRenderer()
renderer.setSize(750, 1206)
document.querySelector('body').appendChild(renderer.domElement)
renderer.setClearColor(0x000000) //要渲染了才能看得到


var scene = new THREE.Scene()


// 透视投影照相机

// var camera = new THREE.PerspectiveCamera(45, 750 / 1206, 1, 10)
// camera.position.set(0, 0, 4)
// scene.add(camera)


// 正交照相机

var camera = new THREE.OrthographicCamera(-3, 3, 1.608 * 3, -1.608 * 3, 1, 10)
camera.position.set(3, 3, 3)
scene.add(camera)
camera.lookAt(new THREE.Vector3(0, 0, 0)) //照相机看坐标轴的方向

var whiteCube = new THREE.Mesh(
	new THREE.CubeGeometry(1, 1, 1),
	new THREE.MeshLambertMaterial({
		color: 0xffffff
	})
)
whiteCube.position.x = -2
var greenCube = new THREE.Mesh(
	new THREE.CubeGeometry(1, 1, 1),
	new THREE.MeshLambertMaterial({
		color: 0x00ffff
	})
)
greenCube.position.x = 2

scene.add(whiteCube, greenCube)

/*
// 环境光
var light = new THREE.AmbientLight(0xff0000)
scene.add(light)
*/

// 点光源

var light = new THREE.PointLight(0xffffff, 2, 100)
light.position.set(0, 1.5, 3)
scene.add(light)


renderer.render(scene, camera)












