import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addLights } from "./components/addLights";
import { setupViewer } from "./components/setupViewer";
import { Ground } from "./components/Ground";
import { addMesh } from "./components/addMesh";

let hold;
let INTERSECTED;

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg1"),
  alpha: true,
  antialias: true,
});
const controls = new OrbitControls(camera, renderer.domElement);
setupViewer(scene, camera, renderer, controls);

// MESH
addMesh(scene, "/smooth94.stl", false);

// GROUND
const ground = Ground();
ground.position.y = -1.5;
scene.add(ground);

// LIGHTS
addLights(scene);

// RAYCASTER
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = 100;
mouse.y = 100;

// LISTENEERS
document.addEventListener("mousemove", onDocumentMouseMove);
document.addEventListener("mouseup", onDocumentMouseUp);
document.addEventListener("mousedown", onDocumentMouseDown);

function onDocumentMouseMove(event) {
  event.preventDefault();
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
}

function onDocumentMouseUp(event) {
  event.preventDefault();
  hold = false;
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  hold = true;
}

function animate() {
  requestAnimationFrame(animate, renderer.domElement);
  render();
}

function render() {
  raycaster.setFromCamera(mouse, camera);

  // find intersections
  const intersects = raycaster.intersectObjects(scene.children, false);
  if (intersects.length > 0 && !hold) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) {
        if (INTERSECTED.material.emissive) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        }
      }
      INTERSECTED = intersects[0].object;
      if (INTERSECTED.material.emissive) {
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex(0xff0000);
      }
    }
  } else {
    if (INTERSECTED) {
      if (INTERSECTED.material.emissive) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }
    }
    INTERSECTED = null;
  }

  // render
  renderer.render(scene, camera);
}

animate();
