import * as THREE from '../modules/three/build/three.module.js';

function createObjects(scene) {
    const floorMat = new THREE.MeshStandardMaterial({ 
        color: "black", 
        roughness: 0.7,
         metalness: 0.2 });

    for (let i = 0; i < 400; i++) {
        const boxMesh = createRandomBox(floorMat);
        scene.add(boxMesh);
        // testObjects.push(boxMesh);

        if (i % 10 === 0) {
            const light = createSign(scene,boxMesh);
            scene.add(light);
        }
    }
}

// Helper functions
function createRandomBox(material) {
    const spread = 30;
    const posx = Math.random() * spread - Math.random() * spread;
    const posy = Math.random() * spread - Math.random() * spread;
    const posz = Math.random() * 6;
    const boxGeometry = new THREE.BoxBufferGeometry(Math.random(), posz, Math.random());
    const boxMesh = new THREE.Mesh(boxGeometry, material);
    boxMesh.position.set(posx, posz / 2, posy);
    boxMesh.castShadow = true;
    return boxMesh;
}

function createSign(scene,boxMesh) {

    const position = boxMesh.position;
    const width = boxMesh.geometry.parameters.width;
    const height = boxMesh.geometry.parameters.height;
    const depth  = boxMesh.geometry.parameters.depth;


    const type = Math.random();
    
    if(type<0.5){
   
        const signMaterial = new THREE.MeshPhongMaterial({emissive : "red"})
        const boxGeometry = new THREE.BoxBufferGeometry(0.01, height/2, depth/3);
        
        const sign = new THREE.Mesh(boxGeometry, signMaterial);
        const a = new THREE.Vector3().addVectors(position,new THREE.Vector3(width/2,0.01+height/4,-depth/5));
        sign.position.copy(a)
        
        const boxGeometryA = new THREE.BoxBufferGeometry(width/8, height/2, depth/8);
        const b = new THREE.Vector3().addVectors(position,new THREE.Vector3(width/2,height/4,0));
        const signMaterialA = new THREE.MeshPhongMaterial({emissive : "yellow"})
        const signA = new THREE.Mesh(boxGeometryA, signMaterialA);
        signA.position.copy(b)
        scene.add(signA)
        return sign;

    }
    else{

        const signMaterial = new THREE.MeshPhongMaterial({emissive : "cyan"})
        const boxGeometry = new THREE.BoxBufferGeometry(width+0.1, height/8, depth+0.1);
        
        const sign = new THREE.Mesh(boxGeometry, signMaterial);
        const a = new THREE.Vector3().addVectors(position,new THREE.Vector3(0,height/3,0));
        sign.position.copy(a)


        const signMaterialA = new THREE.MeshPhongMaterial({emissive : "magenta"})
        // signMaterialA.emissive.setHex(Math.random() * 0xffffff, 10, 90)
        const boxGeometryA = new THREE.BoxBufferGeometry(width+0.1, height/20, depth+0.1);
        const signA = new THREE.Mesh(boxGeometryA, signMaterialA);
        const b = new THREE.Vector3().addVectors(position,new THREE.Vector3(0,height/6,0));
        signA.position.copy(b)
        scene.add(signA)


        const signMaterialB = new THREE.MeshPhongMaterial({emissive : "cyan"})
        const boxGeometryB = new THREE.BoxBufferGeometry(width+0.1, height/8, depth+0.1);
        
        const signB = new THREE.Mesh(boxGeometryB, signMaterialB);
        const c = new THREE.Vector3().addVectors(position,new THREE.Vector3(0,0,0));
        signB.position.copy(c)
        scene.add(signB)


        return sign;


    }

}

export{createObjects}