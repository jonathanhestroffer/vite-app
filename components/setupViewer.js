import * as THREE from "three";

export function setupViewer(scene, camera, renderer, controls) {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.render(scene, camera);
  renderer.shadowMap.enabled = true;

  camera.position.set(0, 3, 5);
  camera.lookAt(0, 0, 0);

  controls.maxPolarAngle = Math.PI / 2;

  controls.update();
}
