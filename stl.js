import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addLights } from "./components/addLights";
import { setupViewer } from "./components/setupViewer";
import { Ground } from "./components/Ground";
import { addMesh } from "./components/addMesh";

let leftClick;
let rightClick;
let INTERSECTED;
let objects;
var state = 0;

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
addMesh(scene, "./models94.stl", false);
addMesh(scene, "./models94_Vox.stl", false);

// GROUND
const ground = Ground();
ground.position.y = -1.5;
scene.add(ground);

// LIGHTS
addLights(scene, camera);
scene.add(camera);
console.log(camera.children);

function getObjects() {
  objects = scene.children;
  return objects;
}

// RAYCASTER
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const rect = renderer.domElement.getBoundingClientRect();

function resetMouse() {
  mouse.x = 100;
  mouse.y = 100;
}

resetMouse();

// LISTENEERS
document.addEventListener("mousemove", onDocumentMouseMove);
document.addEventListener("mouseup", onDocumentMouseUp);
document.addEventListener("mousedown", onDocumentMouseDown);
document.addEventListener("contextmenu", onContextMenu);

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

  // intersections
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  if (state == 0) {
    // find intersections, highlight if mouse not down
    if (intersects.length > 0 && !leftClick) {
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
  leftClick = false;
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  leftClick = true;
}

function onContextMenu(event) {
  event.preventDefault();
  objects = getObjects();
  rightClick = true;
  if (state != 1) {
    if (INTERSECTED) {
      if (INTERSECTED.name == "mesh") {
        // Isolate Object
        objects.forEach(function (object) {
          if (object.name == "mesh" && INTERSECTED != object) {
            console.log(state);
            console.log(object.name);
            scene.remove(object);
          }
        });
        state = 1;
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }
    }
  } else {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    if (intersects[0]) {
      const object = intersects[0].object;
      console.log(object);
      if (object.name == "mesh") {
        state = 1;
        console.log(state);
        console.log(object.name);
      } else {
        Repopulate();
        state = 0;
      }
    } else {
      Repopulate();
      state = 0;
    }
  }

  function Repopulate() {
    // Remove All Objects
    objects.forEach(function (object) {
      if (object.name == "mesh") {
        scene.remove(object);
      }
    });
    // Repopulate
    addMesh(scene, "./models94.stl", false);
    addMesh(scene, "./models94_Vox.stl", false);
  }
  return false;
}

//   // Isolate
//   objects.forEach(function (object) {
//     if (object.name == "mesh" && INTERSECTED != object) {
//       console.log(object.name);
//       scene.remove(object);
//       // object.visible = false;
//     }
//   });
//   INTERSECTED.material.emissive.setHex(null);
//   var bbox = new THREE.Box3().setFromObject(INTERSECTED);
// }
//
// ifelse {
//   // Remove
//   objects.forEach(function (object) {
//     if (object.name == "mesh") {
//       scene.remove(object);
//     }
//   });
//   addMesh(scene, "./models94.stl", false);
//   addMesh(scene, "./models94_Vox.stl", false);
//   state = 0;

function animate() {
  requestAnimationFrame(animate, renderer.domElement);
  render();
}

function render() {
  // render
  renderer.render(scene, camera);
}

animate();
