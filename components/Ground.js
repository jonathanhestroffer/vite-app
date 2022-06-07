import * as THREE from "three";

export function Ground() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 1, 1),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 })
  );
  ground.name = "ground";
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
}
