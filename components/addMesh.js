import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import randomColor from "./randomColor";

export async function addMesh(scene, type) {
  var edges;
  var lines;

  const colors = randomColor({
    hue: "blue",
    count: 22,
    luminosity: "bright",
    seed: 2,
  });

  for (let i = 0; i < 22; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 0.5,
    });
    const meshPath = "./" + type + "/Feature_" + (i + 1).toString() + ".stl";
    const loader = new STLLoader();
    loader.load(meshPath, function (geometry) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.name = "mesh_" + type;
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);
    });
  }
}
