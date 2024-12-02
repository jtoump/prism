// Import Three.js (ensure you have three.js included in your project)
import * as THREE from '../modules/three/build/three.module.js';
import { OrbitControls } from "../modules/three/examples/jsm/controls/OrbitControls.js";
// JSON Data (from the provided example)
const sceneData = {
  "scene": {
    "actor": {
      "position": [0, 0, -3],
      "rotation": [0, 45, 0],
      "props": [
        { "type": "cloak", "material": "dark green fabric" },
        { "type": "armor", "material": "chainmail with leather accents" },
        { "type": "arrows", "quantity": 3, "positions": [[0, 1, -3], [0, 0.5, -3], [0, 0, -3]] }
      ]
    },
    "environment": {
      "forest": {
        "trees": [
          { "type": "pine", "position": [-5, 0, -10] },
          { "type": "stump", "position": [3, 0, -5] }
        ],
        "ground": {
          "props": [
            { "type": "fallen branches", "position": [-2, 0, -3] },
            { "type": "rocks", "position": [1, 0, -2] }
          ]
        }
      },
      "lighting": {
        "type": "natural",
        "direction": [-1, -1, 0],
        "intensity": 0.8,
        "color": "#FFF5E0"
      }
    },
    "camera": {
      "position": [0, 2, 3],
      "rotation": [15, 0, 0]
    }
  }
};

// Create a Three.js scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.set(...sceneData.scene.camera.position);
camera.rotation.set(
  THREE.MathUtils.degToRad(sceneData.scene.camera.rotation[0]),
  THREE.MathUtils.degToRad(sceneData.scene.camera.rotation[1]),
  THREE.MathUtils.degToRad(sceneData.scene.camera.rotation[2])
);


// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Add lighting
const light = new THREE.DirectionalLight(sceneData.scene.environment.lighting.color, sceneData.scene.environment.lighting.intensity);
light.position.set(...sceneData.scene.environment.lighting.direction);
scene.add(light);

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSV( 0.6, 0.75, 0.5 );
hemiLight.groundColor.setHSV( 0.095, 0.5, 0.5 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );


// Helper function to create a box
function createBox(position, color = 0x808080, size = [1, 1, 1]) {
  const geometry = new THREE.BoxGeometry(...size);
  const material = new THREE.MeshStandardMaterial({ color });
  const box = new THREE.Mesh(geometry, material);
  box.position.set(...position);
  scene.add(box);
}

// Add actor
const actorPosition = sceneData.scene.actor.position;
createBox(actorPosition, 0x00ff00); // Green box for actor

// Add actor props (arrows)
sceneData.scene.actor.props.forEach((prop) => {
  if (prop.type === "arrows" && prop.positions) {
    prop.positions.forEach((arrowPos) => {
      createBox(arrowPos, 0x000000, [0.1, 0.1, 1]); // Black narrow boxes for arrows
    });
  }
});

// Add environment elements
sceneData.scene.environment.forest.trees.forEach((tree) => {
  createBox(tree.position, 0x8B4513, [0.5, 2, 0.5]); // Brown boxes for trees
});

sceneData.scene.environment.forest.ground.props.forEach((prop) => {
  createBox(prop.position, 0x808080); // Gray boxes for ground props
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
