import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import space from "../../assets/milky_way.jpg";
import { TAnimation, TAnimationStateToClean } from "./threeJsAnimationTypes";
import {
  changeCameraPerspactiveOnScroll,
  initMeshes,
  keepAnimationWindowSizeConstant,
  updateInstancedAsteroidAnimationState,
} from "./threeJsAnimationUtils";

export const createAnimation = (canvas: HTMLCanvasElement): TAnimation => {
  // set scene
  const scene = new THREE.Scene();

  // set camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 13);

  // set renderer
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // add orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 7;
  controls.maxDistance = 40;

  // set background
  const spaceTexture = new THREE.TextureLoader().load(space);
  scene.background = spaceTexture;

  // create meshes and add them to scene
  initMeshes(scene);

  // add light coming from the sun
  const sun = scene.getObjectByName("Sun")!;
  const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
  pointLight.position.set(sun.position.x, sun.position.y, sun.position.z);
  scene.add(pointLight);

  // add weak ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
  scene.add(ambientLight);

  // add event listeners
  window.onresize = () => keepAnimationWindowSizeConstant(camera, renderer);
  window.onscroll = () => changeCameraPerspactiveOnScroll(camera);

  return { scene, camera, renderer, controls };
};

export function animate(animation: TAnimation) {
  const { scene, camera, renderer, controls } = animation;

  // update asteroids
  const instancedAsteroid = scene.getObjectByName(
    "Asteroids"
  )! as THREE.InstancedMesh<
    THREE.DodecahedronGeometry,
    THREE.MeshStandardMaterial
  >;
  updateInstancedAsteroidAnimationState(instancedAsteroid);

  // update avatar
  const avatar = scene.getObjectByName("Avatar")!;
  avatar.rotation.x += 0.01;
  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  // update the sun
  const sun = scene.getObjectByName("Sun")!;
  sun.rotation.x += 0.0005;
  sun.rotation.y += 0.001;

  const mercury = scene.getObjectByName("Mercury")!;
  mercury.rotation.x += 0.001;
  mercury.rotation.y += 0.001;
  mercury.position.x = 7 * Math.sin(Date.now() * 0.00024);
  mercury.position.z = 7 * Math.cos(Date.now() * 0.00024);

  const venus = scene.getObjectByName("Venus")!;
  venus.rotation.y += 0.01;
  venus.position.x = 9 * Math.sin(Date.now() * 0.00021);
  venus.position.z = 9 * Math.cos(Date.now() * 0.00021);

  const earth = scene.getObjectByName("Earth")!;
  earth.rotation.y += 0.01;
  earth.position.x = 11 * Math.sin(Date.now() * 0.0002);
  earth.position.z = 11 * Math.cos(Date.now() * 0.0002);

  const moon = scene.getObjectByName("Moon")!;
  moon.rotation.y += 0.03;
  moon.position.x = earth.position.x + 1 * Math.sin(Date.now() * 0.001);
  moon.position.z = earth.position.z + 1 * Math.cos(Date.now() * 0.001);

  const mars = scene.getObjectByName("Mars")!;
  mars.rotation.y += 0.01;
  mars.position.x = 13 * Math.sin(Date.now() * 0.00018);
  mars.position.z = 13 * Math.cos(Date.now() * 0.00018);

  const jupiter = scene.getObjectByName("Jupiter")!;
  jupiter.rotation.y += 0.01;
  jupiter.position.x = 24 * Math.sin(Date.now() * 0.00012);
  jupiter.position.z = 24 * Math.cos(Date.now() * 0.00012);

  const saturn = scene.getObjectByName("Saturn")!;
  saturn.rotation.y += 0.01;
  saturn.position.x = 26 * Math.sin(Date.now() * 0.0001);
  saturn.position.z = 26 * Math.cos(Date.now() * 0.0001);

  const uranus = scene.getObjectByName("Uranus")!;
  uranus.rotation.y += 0.01;
  uranus.position.x = 28 * Math.sin(Date.now() * 0.00008);
  uranus.position.z = 28 * Math.cos(Date.now() * 0.00008);

  const neptune = scene.getObjectByName("Neptune")!;
  neptune.rotation.y += 0.01;
  neptune.position.x = 30 * Math.sin(Date.now() * 0.00005);
  neptune.position.z = 30 * Math.cos(Date.now() * 0.00005);

  // update orbit controls
  controls.update();

  // render changes
  renderer.render(scene, camera);

  //  request animation frame
  requestAnimationFrame(() =>
    animate({
      scene,
      camera,
      renderer,
      controls,
    })
  );
}

export function cleanup(animationStateToClean: TAnimationStateToClean) {
  const { scene, renderer } = animationStateToClean;

  // clear renderer
  renderer.dispose();

  // clear objects
  scene.children
    .filter((o) => o.name !== "" && o instanceof THREE.Mesh)
    .forEach((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose());
      } else {
        mesh.material.dispose();
      }
    });

  // clear event listeners
  window.onresize = null;
  window.onscroll = null;
}
