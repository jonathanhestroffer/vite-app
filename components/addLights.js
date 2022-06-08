import * as THREE from "three";

export function addLights(scene) {
  const ambLight = new THREE.AmbientLight(0x000000, 0.14);
  // scene.add(ambLight);
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
  const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.1);
  const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.1);
  const dirLight5 = new THREE.DirectionalLight(0xffffff, 0.1);
  dirLight1.castShadow = true;
  dirLight1.position.set(0, 10, 0);
  // dirLight1.shadow.mapSize.width = 512 * 10; // default
  // dirLight1.shadow.mapSize.height = 512 * 10; // default
  dirLight1.shadow.camera.near = 0.5; // default
  dirLight1.shadow.camera.far = 500;
  dirLight2.position.set(0, 0, -1);
  dirLight3.position.set(0, 0, 1);
  dirLight4.position.set(-1, 0, 0);
  dirLight5.position.set(1, 0, 0);

  scene.add(dirLight1);
  scene.add(dirLight2);
  scene.add(dirLight3);
  scene.add(dirLight4);
  scene.add(dirLight5);
}
