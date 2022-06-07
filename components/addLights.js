import * as THREE from "three";

export function addLights(scene) {
  // directional light
  const dirLight = new THREE.SpotLight(0xffffff, 1);
  dirLight.position.set(1, 10, 1);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024 * 8;
  dirLight.shadow.mapSize.height = 1024 * 8;
  scene.add(dirLight);
}
