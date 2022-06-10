import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addLights } from "./components/addLights";
import { setupViewer } from "./components/setupViewer";
import { addMesh } from "./components/addMesh";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

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
document.addEventListener("contextmenu", onContextMenu);

// Mesh
addMesh(scene, "voxel");
addMesh(scene, "smooth");

controls.target.set(0, 0, 0);

function getCenterPoint(mesh) {
  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter(center);
  mesh.localToWorld(center);
  return center;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function onContextMenu(event) {
  event.preventDefault();
  var mesh_type = "";
  let featIds = [];
  // get mesh type
  scene.children.forEach(function (object) {
    if (object.name.includes("_") && object.visible == true) {
      mesh_type = object.name.split("_")[1];
    }
  });
  // get feature ids
  scene.children.forEach(function (object) {
    if (object.name.includes(mesh_type) && object.visible) {
      object.visible = false;
      featIds.push(object.name.split("_")[2]);
    }
  });
  featIds = featIds.filter(onlyUnique);
  // make opposite model visible
  scene.children.forEach(function (object) {
    if (
      !object.name.includes(mesh_type) &&
      featIds.includes(object.name.split("_")[2])
    ) {
      object.visible = true;
    }
  });
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

  // intersections
  raycaster.setFromCamera(mouse, camera);
  var rayObjects = [];
  scene.children.forEach(function (object) {
    if (!object.name.includes("lines") && object.visible == true) {
      rayObjects.push(object);
    }
  });
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
  let mesh_type;
  if (state != 1) {
    if (INTERSECTED) {
      if (INTERSECTED.name.includes("mesh")) {
        mesh_type = INTERSECTED.name.split("_")[1];
        // Isolate Object
        scene.children.forEach(function (object) {
          if (object.name.includes("mesh") && INTERSECTED != object) {
            object.visible = false;
          } else {
          }
          if (object.name.includes("lines")) {
            if (object.name.split("_")[2] != INTERSECTED.name.split("_")[2]) {
              object.visible = false;
            }
          }
        });
        state = 1;
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        const center = getCenterPoint(INTERSECTED);
        controls.target.set(center.x, center.y, center.z);
        var camD = Math.sqrt(
          (center.x - camera.position.x) ** 2 +
            (center.y - camera.position.y) ** 2 +
            (center.z - camera.position.z) ** 2
        );
        camera.position.x *= 3.5 / camD;
        camera.position.y *= 3.5 / camD;
        camera.position.z *= 3.5 / camD;
      }
    }
  } else {
    scene.children.forEach(function (object) {
      if (object.name.includes("_") && object.visible == true) {
        mesh_type = object.name.split("_")[1];
      }
    });
    scene.children.forEach(function (object) {
      if (object.name.includes(mesh_type)) {
        object.visible = true;
      }
    });
    state = 0;
    controls.target.set(0, 0, 0);
    camera.position.set(3, 3, 5);
  }
  controls.update();
}

function animate() {
  requestAnimationFrame(animate, renderer.domElement);
  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
