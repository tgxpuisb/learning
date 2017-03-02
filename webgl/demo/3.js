var renderer = new THREE.WebGLRenderer()
renderer.setSize(750, 1206)
document.querySelector('body').appendChild(renderer.domElement)
renderer.setClearColor(0x000000) //要渲染了才能看得到


// sence
var scene = new THREE.Scene()


// 透视投影照相机

var camera = new THREE.PerspectiveCamera(45, 750 / 1206, 1, 10)
camera.position.set(0, 0, 4)
scene.add(camera)


// 正交照相机
/*
var camera = new THREE.OrthographicCamera(-3, 3, 1.608 * 3, -1.608 * 3, 1, 10)
camera.position.set(3, 3, 3)
scene.add(camera)
camera.lookAt(new THREE.Vector3(0, 0, 0)) //照相机看坐标轴的方向
*/


// cube
var cube = new THREE.Mesh(
	new THREE.CubeGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true //换一种材质,代替实心的
	})
)
scene.add(cube)


var z = 1
function change(){
	z += 0.01
	setTimeout(function(){
		if(z < 10){
			change()
		}
	}, 100)
	camera.position.set(0, 0, z)
	renderer.render(scene, camera)
}
//change()

renderer.render(scene, camera)












