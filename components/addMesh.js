import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import randomColor from "./randomColor";

export async function addMesh(scene, type) {
  const colors = randomColor({
    hue: "blue",
    count: 22,
    luminosity: "bright",
    seed: 26,
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
      mesh.name = "mesh_" + type + "_" + i.toString();
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);

      if (type == "smooth") {
        const edges1 = new THREE.EdgesGeometry(mesh.geometry, 25);
        const edges2 = new THREE.WireframeGeometry(mesh.geometry);
        const lines1 = new THREE.LineSegments(
          edges1,
          new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        const lines2 = new THREE.LineSegments(
          edges2,
          new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        lines1.rotation.x = -Math.PI / 2;
        lines2.rotation.x = -Math.PI / 2;
        lines1.name = "lines1_" + type + "_" + i.toString();
        lines2.name = "lines2_" + type + "_" + i.toString();
        scene.add(lines1);
        scene.add(lines2);
        mesh.visible = false;
        lines1.visible = false;
        lines2.visible = false;
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
