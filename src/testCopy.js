console.log("a");
import * as THREE from '../modules/three/build/three.module.js';
import { OrbitControls } from "../modules/three/examples/jsm/controls/OrbitControls.js";


import {createObjects} from "./buildings.js"
import {createRoads} from "./roads.js"
import {carCreation} from "./car.js"



// Global variables
let camera, scene, renderer, controls, hemiLight, stats;
const lightList = [];
const testObjects = [];
const carList = [];
const carAxis = [];

// const gui = new GUI();
const settings = { speed: 2.0 };  // Create an object with a `speed` property

// gui.add(settings, 'speed', 0.0, 10.0).name('Speed');


// Lighting parameters
const bulbLuminousPowers = {
    "110000 lm (1000W)": 110000,
    "3500 lm (300W)": 3500,
    "1700 lm (100W)": 1700,
    "800 lm (60W)": 800,
    "400 lm (40W)": 400,
    "180 lm (25W)": 180,
    "20 lm (4W)": 20,
    "Off": 0
};

const hemiLuminousIrradiances = {
    "0.0001 lx (Moonless Night)": 0.0001,
    "0.002 lx (Night Airglow)": 0.002,
    "0.5 lx (Full Moon)": 0.5,
    "3.4 lx (City Twilight)": 3.4,
    "50 lx (Living Room)": 50,
    "100 lx (Very Overcast)": 100,
    "350 lx (Office Room)": 350,
    "400 lx (Sunrise/Sunset)": 400,
    "1000 lx (Overcast)": 1000,
    "18000 lx (Daylight)": 18000,
    "50000 lx (Direct Sun)": 50000
};

const params = {
    shadows: true,
    exposure: 0.68,
    bulbPower: Object.keys(bulbLuminousPowers)[4],
    hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
};

// Initialization and animation
init();
animate();

function init() {
    setupRenderer();

    setupScene();
    setupCamera();
    setupLights();
    setupControls();
    //setupStats();
    setupEventListeners();
    createEnvironment();
}

function setupScene() {
    const container = document.getElementById('container');
    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(Math.random() * 0xffffff, 10, 90);
    scene.fog = new THREE.FogExp2( "#fffdd0", 0.015 );
    
    container.appendChild(renderer.domElement);
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(28.6,40.15,-11.38);
}

function setupLights() {
    hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    scene.add(hemiLight);
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ physicallyCorrectLights: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

}

function setupStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
}

// Scene content
function createEnvironment() {
    const floorMat = new THREE.MeshStandardMaterial({
        roughness: 0.8,
        color: "white",
        metalness: 0.2,
        bumpScale: 0.0005
    });

    const floorGeometry = new THREE.PlaneBufferGeometry(200, 200);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = -Math.PI / 2;
    scene.add(floorMesh);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);


    createObjects(scene);     
    carCreation(scene,100,carList,carAxis);
    createRoads(scene,100);

}



// on Window Resize

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    const mouse = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(testObjects);

    if (intersects.length > 0) {
        intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    }
}


// Animation and rendering
function animate() {
    requestAnimationFrame(animate);
    // stats.begin();
    render();
    // stats.end();
}

function render() {
    renderer.toneMappingExposure = Math.pow(params.exposure, 1.0);
    hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance];
    const time = Date.now() * 0.0005;

    // Define view boundaries
    const viewLimit = 50; // Adjust this as needed

    // Update light positions and reset if out of view
    carList.forEach((car, idx) => {
        const axis = Math.random();

        // Move car along the x-axis or z-axis based on carAxis
        if (carAxis[idx] > 0.5) { 
            car.position.x += 0.1 * Math.random() *settings.speed;
            // Check if the car has moved out of view bounds in x-direction
            if (Math.abs(car.position.x) > viewLimit) {
                car.position.x = -car.position.x; // Reflect position back into view
            }
        } else {
            car.position.z += 0.1 * Math.random()*settings.speed;
            // Check if the car has moved out of view bounds in z-direction
            if (Math.abs(car.position.z) > viewLimit) {
                car.position.z = -car.position.z; // Reflect position back into view
            }
        }
    });

    renderer.render(scene, camera);
}





window.camera = camera;
window.controls = controls;
