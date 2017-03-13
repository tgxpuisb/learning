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


var cube = new THREE.Mesh(
	new THREE.CubeGeometry(1, 2, 3),
	new THREE.MeshNormalMaterial()
)
scene.add(cube)
let rad = 0
function run(){
	rad += 0.00002
	if(rad >= 2){
		rad = 0
	}
	cube.rotateY(Math.PI * rad)
	renderer.render(scene, camera)
	setTimeout(function(){
		run()
	}, 30)
}
run()


renderer.render(scene, camera)












