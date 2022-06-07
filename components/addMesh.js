import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

export async function addMesh(scene, meshPath, wireframe = false) {
  var edges;
  var lines;

  const material = new THREE.MeshLambertMaterial({
    color: 0x156289,
    emissive: 0x156289,
  });

  const loader = new STLLoader();
  loader.load(meshPath, function (geometry) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.name = "mesh";
    scene.add(mesh);

    // WireFrame
    if (wireframe) {
      edges = new THREE.WireframeGeometry(mesh.geometry);
      lines = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      lines.rotation.x = -Math.PI / 2;
      scene.add(lines);
    }
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
  });
}
