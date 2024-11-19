

import * as THREE from '../modules/three/build/three.module.js';


function carCreation(scene,number,carList,carAxis){
    let lastcar;
    for(let i =0;i<number;i++){
        const carMaterial = new THREE.MeshPhongMaterial({emissive : "orange"})
        const boxGeometry = new THREE.BoxBufferGeometry(0.08, 0.01, 0.08);
        const car = new THREE.Mesh(boxGeometry, carMaterial);
    
        car.position.copy(new THREE.Vector3(Math.random()*50-Math.random()*50,Math.random()*20,Math.random()*50-Math.random()*50))
        carList.push(car);
        const axis = Math.random();
        carAxis.push(axis);
        
        
        // Create cone geometry for headlights (beam lights)
        const coneGeometry = new THREE.ConeGeometry(0.03, 10.0*Math.random(), 8);
        const lightMaterial = new THREE.MeshPhongMaterial({ emissive: "white" ,
                                                            specular:"white",
                                                            fog:true}); // Slight yellow for beam lights

       
        
        
        // Create materials
        const shipMaterial = new THREE.MeshBasicMaterial({ color: "black" });
        const cockpitMaterial = new THREE.MeshBasicMaterial({ color: "black", transparent: true, opacity: 0.5 });
        const engineMaterial = new THREE.MeshBasicMaterial({ color: "black" });

        // Create the main body group to hold all parts of the ship
        const bodyGroup = new THREE.Group();

        // Main Body
        const bodyCylinder = new THREE.CylinderGeometry(0.8, 0.8, 5, 32);
        const body = new THREE.Mesh(bodyCylinder, shipMaterial);
        body.rotation.z = Math.PI / 2;
        bodyGroup.add(body); // Add the main body to the group

        // Cockpit
        const cockpitSphere = new THREE.SphereGeometry(0.8, 32, 32);
        const cockpit = new THREE.Mesh(cockpitSphere, cockpitMaterial);
        cockpit.position.set(2.5, 0.0, 0.0); // Position relative to the main body
        bodyGroup.add(cockpit); // Add cockpit to the group

        // Wings
        // const wingShape = new THREE.BoxGeometry(4, 0.1, 1);
        // const leftWing = new THREE.Mesh(wingShape, shipMaterial);
        // leftWing.position.set(-1, 0, 2);
        // leftWing.rotation.y = Math.PI / 10;
        // bodyGroup.add(leftWing); // Add left wing to the group

        // const rightWing = leftWing.clone();
        // rightWing.position.z = -2;
        // rightWing.rotation.y = -Math.PI / 10;
        // bodyGroup.add(rightWing); // Add right wing to the group

        // Engines
        const engineShape = new THREE.CylinderGeometry(0.6, 0.3, 1.5, 32);
        const leftEngine = new THREE.Mesh(engineShape, engineMaterial);
        const leftEngineConeGeometry = new THREE.ConeGeometry(0.6, 3.5, 8);
        const leftEngineCon = new THREE.Mesh(leftEngineConeGeometry, engineMaterial);
        leftEngine.position.set(-0.2, 0, 1.2);
        leftEngineCon.position.copy(new THREE.Vector3().addVectors(leftEngine.position,new THREE.Vector3(-2.7,0,0)));
        leftEngineCon.rotation.z = Math.PI / 2;
        leftEngine.rotation.z = Math.PI / 2;
        
        bodyGroup.add(leftEngineCon)

        bodyGroup.add(leftEngine); // Add left engine to the group

        const rightEngine = leftEngine.clone();
        const rightEngineCon = leftEngineCon.clone();

        rightEngine.position.z = -1.2;
        rightEngineCon.position.z = -1.2;
        
        bodyGroup.add(rightEngine); // Add right engine to the group
        bodyGroup.add(rightEngineCon); // Add right engine to the group


        const centerEngine = leftEngine.clone();
        const centertEngineCon = leftEngineCon.clone();

        centerEngine.position.copy(new THREE.Vector3(-2.5-0.6,0.0,0.0));
        centertEngineCon.position.set(new THREE.Vector3(0.0,1.0,0.0))

        // centertEngineCon.copy(new THREE.Vector3().add(centerEngine.position,new THREE.Vector3(-2.7,0,0)));

        bodyGroup.add(centerEngine); // Add right engine to the group
        bodyGroup.add(centertEngineCon); // Add right engine to the group


        // Left beam light
        const leftBeam = new THREE.Mesh(coneGeometry, lightMaterial);
        leftBeam.rotation.z = Math.PI / 2; // Rotate to face forward
        leftBeam.position.copy(new THREE.Vector3().addVectors(leftEngineCon.position, new THREE.Vector3(-2.1, 0.0, 0.0)));
        bodyGroup.add(leftBeam);

        const rightBeam = leftBeam.clone();
        rightBeam.position.z = -1.2;
        bodyGroup.add(rightBeam);

        // Tail Fins
        const tailFin = new THREE.BoxGeometry(1, 0.1, 0.3);
        const leftTail = new THREE.Mesh(tailFin, shipMaterial);
        leftTail.position.set(-2.5, 0, 1);
        leftTail.rotation.y = Math.PI / 8;
        bodyGroup.add(leftTail); // Add left tail fin to the group

        const rightTail = leftTail.clone();
        rightTail.position.z = -1;
        rightTail.rotation.y = -Math.PI / 8;
        bodyGroup.add(rightTail); // Add right tail fin to the group

        // Add the body group to the scene
        if(axis<0.5){
            bodyGroup.rotation.y = -Math.PI/2;
        }

        const scaleFactor = 0.1 * Math.random();
        bodyGroup.scale.set(scaleFactor,scaleFactor,scaleFactor); // Increase size by 1.5 times in all directions
        car.add(bodyGroup);
        scene.add(car);


    }
  
}


export{carCreation}