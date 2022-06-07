import * as THREE from "three";

export function addLights(scene) {
  // const ambLight = new THREE.AmbientLight(0xffffff, 0.3);
  // scene.add(ambLight);
  // directional light
  // const dirLight = new THREE.SpotLight(0xffffff, 0.5);
  // dirLight.position.set(1, 10, 1);
  // dirLight.castShadow = true;
  // dirLight.shadow.mapSize.width = 1024 * 8;
  // dirLight.shadow.mapSize.height = 1024 * 8;
  // scene.add(dirLight);

  const dirLight1 = new THREE.SpotLight(0xffffff, 1);
  dirLight1.castShadow = true;
  dirLight1.position.set(0, 5, -4);
  scene.add(dirLight1);
}
