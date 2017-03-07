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



// 长方体
/*
var cube = new THREE.Mesh(
	new THREE.CubeGeometry(1, 2, 3),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true //换一种材质,代替实心的
	})
)
scene.add(cube)
*/

// 平面
/*
var plane = new THREE.Mesh(
	new THREE.PlaneGeometry(2, 3),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true //换一种材质,代替实心的
	})
)
scene.add(plane)
*/

// 球体
/*
var Sphere = new THREE.Mesh(
	new THREE.SphereGeometry(3, 20, 20, 0, Math.PI / 4, 0, Math.PI),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true //换一种材质,代替实心的
	})
)
scene.add(Sphere)
*/

//圆形
/*
var Cicle = new THREE.Mesh(
	new THREE.CircleGeometry(3, 20, 0, Math.PI / 1),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Cicle)
*/

// 标准圆柱体
/*
var Cylinder = new THREE.Mesh(
	new THREE.CylinderGeometry(2, 2, 5, 20, 10),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Cylinder)
*/

// 圆台
/*
var Cylinder = new THREE.Mesh(
	new THREE.CylinderGeometry(1, 2, 5, 20, 10),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Cylinder)
*/

//圆锥
/*
var Cylinder = new THREE.Mesh(
	new THREE.CylinderGeometry(0, 2, 5, 20, 10),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Cylinder)
*/


//正四面体
/*
var Tetrahedron = new THREE.Mesh(
	new THREE.TetrahedronGeometry(2),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Tetrahedron)
*/

//正八面体
/*
var Octahedron = new THREE.Mesh(
	new THREE.OctahedronGeometry(2),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Octahedron)
*/

// 正十二面体
/*
var Icosahedron = new THREE.Mesh(
	new THREE.IcosahedronGeometry(2),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Icosahedron)
*/

// 圆环面
/*
var Torus = new THREE.Mesh(
	new THREE.TorusGeometry(3, 1, 20, 20, Math.PI),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Torus)
*/

// 圆环节
/*
var Torus = new THREE.Mesh(
	new THREE.TorusKnotGeometry(2, 0.5, 32, 8),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)
scene.add(Torus)
*/

//自定义形状
// 初始化几何形状
var geometry = new THREE.Geometry();

// 设置顶点位置
// 顶部4顶点
geometry.vertices.push(new THREE.Vector3(-1, 2, -1));
geometry.vertices.push(new THREE.Vector3(1, 2, -1));
geometry.vertices.push(new THREE.Vector3(1, 2, 1));
geometry.vertices.push(new THREE.Vector3(-1, 2, 1));
// 底部4顶点
geometry.vertices.push(new THREE.Vector3(-2, 0, -2));
geometry.vertices.push(new THREE.Vector3(2, 0, -2));
geometry.vertices.push(new THREE.Vector3(2, 0, 2));
geometry.vertices.push(new THREE.Vector3(-2, 0, 2));

// 设置顶点连接情况
// 顶面
geometry.faces.push(new THREE.Face3(0, 1, 3));
geometry.faces.push(new THREE.Face3(1, 2, 3));
// 底面
geometry.faces.push(new THREE.Face3(4, 5, 6));
geometry.faces.push(new THREE.Face3(5, 6, 7));
// 四个侧面
geometry.faces.push(new THREE.Face3(1, 5, 6));
geometry.faces.push(new THREE.Face3(6, 2, 1));
geometry.faces.push(new THREE.Face3(2, 6, 7));
geometry.faces.push(new THREE.Face3(7, 3, 2));
geometry.faces.push(new THREE.Face3(3, 7, 0));
geometry.faces.push(new THREE.Face3(7, 4, 0));
geometry.faces.push(new THREE.Face3(0, 4, 5));
geometry.faces.push(new THREE.Face3(0, 5, 1));

var customGeometry = new THREE.Mesh(
	geometry,
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		wireframe: true
	})
)

scene.add(customGeometry)




/*
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
change()
*/

renderer.render(scene, camera)












