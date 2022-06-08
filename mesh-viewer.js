import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addLights } from "./components/addLights";
import { setupViewer } from "./components/setupViewer";
import { Ground } from "./components/Ground";
import { addMesh } from "./components/addMesh";

let singleClick_M;
let doubleClick_M;
let INTERSECTED_M;
var state_M = 0;

const camera_M = new THREE.PerspectiveCamera(40, 1, 0.1, 100000);
const scene_M = new THREE.Scene();
const renderer_M = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg2"),
  alpha: true,
  antialias: true,
});
// renderer_M.outputEncoding = THREE.sRGBEncoding;
const controls_M = new OrbitControls(camera_M, renderer_M.domElement);
setupViewer(scene_M, camera_M, renderer_M, controls_M);

// GROUND
const ground_M = Ground();
ground_M.position.y = -1.5;
scene_M.add(ground_M);

// LIGHTS
addLights(scene_M, camera_M);

// RAYCASTER
const raycaster_M = new THREE.Raycaster();
const mouse_M = new THREE.Vector2();
mouse_M.x = 100;
mouse_M.y = 100;
const rect_M = renderer_M.domElement.getBoundingClientRect();

// LISTENERS
document.addEventListener("mousemove", onDocumentMouseMove_M);
document.addEventListener("mouseup", onDocumentMouseUp_M);
document.addEventListener("mousedown", onDocumentMouseDown_M);

// Mesh
// addMesh(scene, "voxel");
addMesh(scene_M, "smooth");

function onDocumentMouseMove_M(event) {
  event.preventDefault();
  mouse_M.x =
    ((event.clientX - rect_M.left) / (rect_M.right - rect_M.left)) * 2 - 1;
  mouse_M.y =
    -((event.clientY - rect_M.top) / (rect_M.bottom - rect_M.top)) * 2 + 1;

  // intersections
  raycaster_M.setFromCamera(mouse_M, camera_M);
  var rayObjects_M = [];
  scene_M.children.forEach(function (object) {
    if (!object.name.includes("lines")) {
      rayObjects_M.push(object);
    }
  });
  const intersects_M = raycaster_M.intersectObjects(rayObjects_M, false);
  if (state_M == 0) {
    // find intersections, highlight if mouse not down
    if (intersects_M.length > 0) {
      if (INTERSECTED_M != intersects_M[0].object) {
        if (INTERSECTED_M) {
          if (INTERSECTED_M.material.emissive) {
            INTERSECTED_M.material.emissive.setHex(INTERSECTED_M.currentHex);
          }
        }
        INTERSECTED_M = intersects_M[0].object;
        if (INTERSECTED_M.material.emissive) {
          INTERSECTED_M.currentHex = INTERSECTED_M.material.emissive.getHex();
          INTERSECTED_M.material.emissive.setHex(0xff0000);
        }
      }
    } else {
      if (INTERSECTED_M) {
        if (INTERSECTED_M.material.emissive) {
          INTERSECTED_M.material.emissive.setHex(INTERSECTED_M.currentHex);
        }
      }
      INTERSECTED_M = null;
    }
  }
}

function onDocumentMouseUp_M(event) {
  event.preventDefault();
  singleClick_M = false;
}

function onDocumentMouseDown_M(event) {
  event.preventDefault();
  if (event.detail == 1) {
    singleClick_M = true;
  } else if (event.detail == 2) {
    doubleClick_M = true;
    onDoubleClick_M();
  }
}

function onDoubleClick_M() {
  if (state_M != 1) {
    if (INTERSECTED_M) {
      if (INTERSECTED_M.name.includes("mesh")) {
        // Isolate Object
        scene_M.children.forEach(function (object) {
          if (object.name.includes("mesh") && INTERSECTED_M != object) {
            object.visible = false;
          }
          if (object.name.includes("lines")) {
            if (object.name.split("_")[1] != INTERSECTED_M.name.split("_")[1]) {
              object.visible = false;
            }
          }
        });
        state_M = 1;
        INTERSECTED_M.material.emissive.setHex(INTERSECTED_M.currentHex);
      }
    }
  } else {
    scene_M.children.forEach(function (object) {
      if (object.name.includes("_")) {
        object.visible = true;
      }
    });
    state_M = 0;
  }
}

function animate_M() {
  requestAnimationFrame(animate_M, renderer_M.domElement);
  render_M();
}

function render_M() {
  renderer_M.render(scene_M, camera_M);
}

animate_M();
