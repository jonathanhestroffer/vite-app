import * as THREE from "three";

export function Cube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
  const material = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    flatShading: true,
  });

  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}
