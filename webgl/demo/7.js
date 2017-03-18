var renderer = new THREE.WebGLRenderer()
renderer.setSize(750, 1206)
document.querySelector('body').appendChild(renderer.domElement)
renderer.setClearColor(0x000000) //要渲染了才能看得到


// sence
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

/*
// 骰子
var loader = new THREE.TextureLoader()
loader.load(
	'./images/1-1.png',
	function(texture){
		var material = new THREE.MeshBasicMaterial({
			map: texture
		})
		var cube = new THREE.Mesh(
			new THREE.CubeGeometry(1, 1, 1),
			material
		)
		scene.add(cube)
		renderer.render(scene, camera)
	}
)

*/

// 棋盘
var loader = new THREE.TextureLoader()
loader.load(
	'./images/1-2.png',
	function(texture){
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping
		texture.repeat.set(4, 4)
		var material = new THREE.MeshBasicMaterial({
			map: texture
		})
		var cube = new THREE.Mesh(
			new THREE.CubeGeometry(1, 1, 1),
			material
		)
		scene.add(cube)
		renderer.render(scene, camera)
	}
)

// renderer.render(scene, camera)












