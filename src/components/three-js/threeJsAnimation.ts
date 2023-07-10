import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import space from "../../assets/space.jpg";
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
  camera.position.set(0, 0, 10);

  // set renderer
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // add orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxDistance = 20;
  controls.minDistance = 5;

  // set background
  const spaceTexture = new THREE.TextureLoader().load(space);
  scene.background = spaceTexture;

  // create meshes and add them to scene
  const { avatar, sun, instancedAsteroid } = initMeshes(scene);

  // add light coming from the sun
  const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
  pointLight.position.set(
    sun.mesh.position.x,
    sun.mesh.position.y,
    sun.mesh.position.z
  );
  scene.add(pointLight);

  // add event listeners
  window.onresize = () => keepAnimationWindowSizeConstant(camera, renderer);
  window.onscroll = () => changeCameraPerspactiveOnScroll(camera);

  return { scene, camera, renderer, avatar, sun, instancedAsteroid, controls };
};

export function animate(animation: TAnimation) {
  const { scene, camera, renderer, avatar, sun, instancedAsteroid, controls } =
    animation;

  // update asteroids
  updateInstancedAsteroidAnimationState(instancedAsteroid);

  // update avatar
  avatar.mesh.rotation.x += 0.01;
  avatar.mesh.rotation.y += 0.01;
  avatar.mesh.rotation.z += 0.01;

  // update the sun
  sun.mesh.rotation.x += 0.001;
  sun.mesh.rotation.y += 0.001;

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
      avatar,
      sun,
      instancedAsteroid,
      controls,
    })
  );
}

export function cleanup(animationStateToClean: TAnimationStateToClean) {
  const { renderer, avatar, sun, instancedAsteroid } = animationStateToClean;

  // clear renderer
  renderer.dispose();

  // clear objects
  [avatar, sun].forEach((obj) => {
    obj.mesh.geometry.dispose();
    obj.mesh.material.dispose();
  });
  instancedAsteroid.geometry.dispose();
  instancedAsteroid.material.dispose();

  // clear event listeners
  window.onresize = null;
  window.onscroll = null;
}
