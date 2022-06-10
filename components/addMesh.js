import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import randomColor from "./randomColor";

export async function addMesh(scene, type) {
  for (let i = 0; i < 22; i++) {
    const colors = randomColor({
      hue: "blue",
      count: 1,
      luminosity: "bright",
      seed: 3 + i,
    });

    const material = new THREE.MeshLambertMaterial({
      color: colors[0],
      emissive: colors[0],
      emissiveIntensity: 0.5,
    });

    const meshPath = "./" + type + "/Feature_" + (i + 1).toString() + ".stl";

    const loader = new STLLoader();
    loader.load(meshPath, function (geometry) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = "mesh_" + type + "_" + i.toString();
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);

      if (type == "smooth") {
        const edges = new THREE.WireframeGeometry(mesh.geometry);
        const lines = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        lines.rotation.x = -Math.PI / 2;
        lines.name = "lines_" + type + "_" + i.toString();
        scene.add(lines);
        mesh.visible = false;
        lines.visible = false;
      } else {
        const edges = new THREE.EdgesGeometry(mesh.geometry, 25);
        const lines = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        lines.rotation.x = -Math.PI / 2;
        lines.name = "lines_" + type + "_" + i.toString();
        scene.add(lines);
      }
    });
  }
}
