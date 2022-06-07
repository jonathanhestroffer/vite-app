import * as THREE from "three";

export function addLights(scene, camera) {
  const dirLight = new THREE.SpotLight(0xffffff, 1);
  dirLight.castShadow = true;
  dirLight.position.set(5, 10, 5);
  dirLight.shadow.mapSize.width = 512 * 10; // default
  dirLight.shadow.mapSize.height = 512 * 10; // default
  dirLight.shadow.camera.near = 0.5; // default
  dirLight.shadow.camera.far = 500;
  scene.add(dirLight);
  camera.add(dirLight);
  scene.add(camera);
}
