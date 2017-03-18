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

/*
// 点光源
var light = new THREE.PointLight(0xffffff, 2, 100)
light.position.set(0, 1.5, 3)
scene.add(light)
*/

/*
//平行光
var light = new THREE.DirectionalLight(0xffffff)
light.position.set(2, 5, 3)
scene.add(light)
*/

var xgeometry = new THREE.Geometry()
xgeometry.vertices.push(new THREE.Vector3(0, 0, 0))
xgeometry.vertices.push(new THREE.Vector3(20, 0, 0))
var xline = new THREE.Line(
	xgeometry,
	new THREE.LineBasicMaterial({
		color: 0xff0000
	})
)
var ygeometry = new THREE.Geometry()
ygeometry.vertices.push(new THREE.Vector3(0, 0, 0))
ygeometry.vertices.push(new THREE.Vector3(0, 20, 0))
var yline = new THREE.Line(
	ygeometry,
	new THREE.LineBasicMaterial({
		color: 0x00ff00
	})
)
var zgeometry = new THREE.Geometry()
zgeometry.vertices.push(new THREE.Vector3(0, 0, 0))
zgeometry.vertices.push(new THREE.Vector3(0, 0, 20))
var zline = new THREE.Line(
	zgeometry,
	new THREE.LineBasicMaterial({
		color: 0x0000ff
	})
)
scene.add(xline, yline, zline)



//聚光灯
var light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6)
light.position.set(3, 3, 3)
light.target.position.set(0, 0, 0)
scene.add(light)

renderer.render(scene, camera)












