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


// 正常材质
/*
var cube = new THREE.Mesh(
	new THREE.CubeGeometry(1, 2, 3),
	new THREE.MeshBasicMaterial({
		color: 0xff4956,
		opacity: 0.1 // 貌似没效果
	})
)
scene.add(cube)
*/

//Lambert材质
// 如果没有光,该图形是一团漆黑
/*
var cube = new THREE.Mesh(
	new THREE.CubeGeometry(1, 2, 3),
	new THREE.MeshLambertMaterial({
		color: 0xff4956,
		// ambient: 0xff4956,
		//emissive: 0xff4956
	})
)
scene.add(cube)
*/

// phong材质

var material = new THREE.MeshPhongMaterial({
    specular: 0xff0000
});
var sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 40, 40), material);
scene.add(sphere)

var ambientLight = new THREE.AmbientLight(0x666666)  // 添加环境光
scene.add(ambientLight)

var directionalLight = new THREE.DirectionalLight(0x989898) // 添加平行光
directionalLight.position.set(-5, 5, 5)   // 设置平行光光源位置
scene.add(directionalLight)



renderer.render(scene, camera)












