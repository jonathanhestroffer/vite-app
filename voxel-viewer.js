import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addLights } from "./components/addLights";
import { setupViewer } from "./components/setupViewer";
import { Ground } from "./components/Ground";
import { addMesh } from "./components/addMesh";

let singleClick;
let doubleClick;
let INTERSECTED;
var state = 0;

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg1"),
  alpha: true,
  antialias: true,
});
// renderer.outputEncoding = THREE.sRGBEncoding;
const controls = new OrbitControls(camera, renderer.domElement);
setupViewer(scene, camera, renderer, controls);

// GROUND
const ground = Ground();
ground.position.y = -1.5;
scene.add(ground);

// LIGHTS
addLights(scene, camera);

// RAYCASTER
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = 100;
mouse.y = 100;
const rect = renderer.domElement.getBoundingClientRect();

// LISTENERS
document.addEventListener("mousemove", onDocumentMouseMove);
document.addEventListener("mouseup", onDocumentMouseUp);
document.addEventListener("mousedown", onDocumentMouseDown);

// Mesh
addMesh(scene, "voxel");
// addMesh(scene, "smooth");

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

  // intersections
  raycaster.setFromCamera(mouse, camera);
  var rayObjects = [];
  scene.children.forEach(function (object) {
    if (!object.name.includes("lines")) {
      rayObjects.push(object);
    }
  });
  // const intersects = raycaster.intersectObjects(scene.children, false);
  const intersects = raycaster.intersectObjects(rayObjects, false);
  if (state == 0) {
    // find intersections, highlight if mouse not down
    if (intersects.length > 0) {
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
  }
}

function onDocumentMouseUp(event) {
  event.preventDefault();
  singleClick = false;
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  if (event.detail == 1) {
    singleClick = true;
  } else if (event.detail == 2) {
    doubleClick = true;
    onDoubleClick();
  }
}

function onDoubleClick() {
  if (state != 1) {
    if (INTERSECTED) {
      if (INTERSECTED.name.includes("mesh")) {
        // Isolate Object
        scene.children.forEach(function (object) {
          if (object.name.includes("mesh") && INTERSECTED != object) {
            object.visible = false;
          }
          if (object.name.includes("lines")) {
            if (object.name.split("_")[1] != INTERSECTED.name.split("_")[1]) {
              object.visible = false;
            }
          }
        });
        state = 1;
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }
    }
  } else {
    scene.children.forEach(function (object) {
      if (object.name.includes("_")) {
        object.visible = true;
      }
    });
    state = 0;
  }
}

function animate() {
  requestAnimationFrame(animate, renderer.domElement);
  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();