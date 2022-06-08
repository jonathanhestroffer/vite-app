import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import randomColor from "./randomColor";

export async function addMesh(scene, type) {
  var edges;
  var emiInt;
  if (type == "smooth") {
    emiInt = 1;
  } else emiInt = 0.5;

  const colors = randomColor({
    hue: "blue",
    count: 22,
    luminosity: "bright",
    seed: 26,
  });

  for (let i = 0; i < 22; i++) {
    if (i == 18) {
      console.log(colors[i]);
    }
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
      mesh.name = "mesh_" + i.toString();
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);

      if (type == "smooth") {
        edges = new THREE.WireframeGeometry(mesh.geometry, 25);
      } else {
        edges = new THREE.EdgesGeometry(mesh.geometry, 25);
      }
      const lines = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      lines.rotation.x = -Math.PI / 2;
      lines.name = "lines_" + i.toString();
      scene.add(lines);
    });
  }
}
