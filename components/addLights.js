import * as THREE from "three";

export function addLights(scene) {
  const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.castShadow = true;
  dirLight.position.set(3, 10, -3);

  scene.add(dirLight);
  scene.add(ambLight);
}
