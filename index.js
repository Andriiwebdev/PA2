const camera = setupCamera();
const scene = setupScene();

const renderer = setupRenderer();

cornucopiaMesh = setupTargetObject();
scene.add(cornucopiaMesh);

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", e => onAngleChange(e.alpha, e.beta, e.gamma), true);
}

animate();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onAngleChange(alpha, beta, gamma) {
    let localpha = alpha || document.getElementById("alpha").value;
    let locbeta = beta || document.getElementById("beta").value;
    let locgamma = gamma || document.getElementById("gamma").value;

    let matrix = getQuaternion(localpha, locbeta, locgamma);

    cornucopiaMesh.applyQuaternion(matrix);
}

function getQuaternion(alpha, beta, gamma) {
    const toRadian = grad => grad * Math.PI / 180;

    let _x = beta ? toRadian(beta) : 0; // beta
    let _y = gamma ? toRadian(gamma) : 0; // gamma
    let _z = alpha ? toRadian(alpha) : 0; // alpha

    let cX = Math.cos(_x / 2);
    let cY = Math.cos(_y / 2);
    let cZ = Math.cos(_z / 2);
    let sX = Math.sin(_x / 2);
    let sY = Math.sin(_y / 2);
    let sZ = Math.sin(_z / 2);

    let w = cX * cY * cZ - sX * sY * sZ;
    let x = sX * cY * cZ - cX * sY * sZ;
    let y = cX * sY * cZ + sX * cY * sZ;
    let z = cX * cY * sZ + sX * sY * cZ;

    return new THREE.Quaternion(x, y, z, w);// [ w, x, y, z ];
}

function setupScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    return scene;
}

function setupTargetObject() {
    //const geometry = new THREE.ParametricGeometry(surfaceFunc, 200, 200);
    const boxWidth = 10;
    const boxHeight = 10;
    const boxDepth = 10;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const loader = new THREE.TextureLoader();
    const materials = [
        new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
      ];
    const surfaceMesh = new THREE.Mesh(geometry,  new THREE.MeshBasicMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}));
    surfaceMesh.position.set(0, 0, -25);

    return surfaceMesh;
}

function setupCamera() {
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    return camera;
}

function setupRenderer(targetObject) {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return renderer;
}