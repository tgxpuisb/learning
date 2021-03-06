var requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

var scene = null;
var camera = null;
var renderer = null;

var id = null;

var stat = null;

var ballMesh = null;
var ballRadius = 0.5;
var isMoving = false;
var maxHeight = 5;

var v = 0;
var a = -0.01;

function init() {
    stat = new Stats();
    stat.domElement.style.position = 'absolute';
    stat.domElement.style.right = '0px';
    stat.domElement.style.top = '0px';
    document.body.appendChild(stat.domElement);

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas')
    });
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 100);
    camera.position.set(5, 10, 20);
    camera.lookAt(new THREE.Vector3(0, 3, 0));
    scene.add(camera);

    // ball
    ballMesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 16, 8),
        new THREE.MeshLambertMaterial({
            color: 0xffff00
    }));
    ballMesh.position.y = ballRadius;
    scene.add(ballMesh);

    // plane
    var texture = THREE.ImageUtils.loadTexture('./images/1-2.png', {}, function() {
        renderer.render(scene, camera);
    });
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5),
            new THREE.MeshLambertMaterial({map: texture}));
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 15);
    scene.add(light);

    id = requestAnimationFrame(draw);
}

function draw() {
    stat.begin();

    if (isMoving) {
        ballMesh.position.y += v;
        v += a;

        if (ballMesh.position.y <= ballRadius) {
            // hit plane
            v = -v * 0.9;
        }

        if (Math.abs(v) < 0.001) {
            // stop moving
            isMoving = false;
            ballMesh.position.y = ballRadius;
        }
    }

    renderer.render(scene, camera);

    id = requestAnimationFrame(draw);

    stat.end();
}

function stop() {
    if (id !== null) {
        cancelAnimationFrame(id);
        id = null;
    }
}

function drop() {
    isMoving = true;
    ballMesh.position.y = maxHeight;
    v = 0;
}