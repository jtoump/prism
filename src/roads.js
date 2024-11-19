import * as THREE from '../modules/three/build/three.module.js';

function createRoads(scene,number){
    const roadMaterial = new THREE.MeshPhongMaterial({ emissive: "white" });
     
    // Define road thickness and size
    const roadWidth = 0.01;   // Width of the road
    const roadHeight = 0.01; // Thickness of the road


    for(let i =0;i<number;i++){


       
        const roadLength = Math.random()*40; // Length of the road

        // Create a box geometry to represent the road with thickness
        const roadGeometry = new THREE.BoxGeometry(roadLength, roadHeight, roadWidth);
        
        // Create the road mesh
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        

        // Position the road - aligning it with the original start and end points
        if(Math.random()>0.5){
            road.rotation.y = Math.PI/2;

        }

        if(Math.random()>0.5){
            const pos = new THREE.Vector3(Math.random()*60-Math.random()*60,0.1,Math.random()*60-Math.random()*60 );
            road.position.copy(pos); // Center it vertically at y = 2 and horizontally between start and end points
        }else{
            road.position.copy(Math.random()*60-Math.random()*60, 0.1, Math.random()*60-Math.random()*60); // Center it vertically at y = 2 and horizontally between start and end points

        }
        // Add the road to the scene
        scene.add(road);
    }
}

export{createRoads}