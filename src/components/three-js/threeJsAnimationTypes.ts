import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type TAvatar = {
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
};

type TSun = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
};

type TPlanet = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
};

type TAsteroid = {
  mesh: THREE.Mesh<THREE.DodecahedronGeometry, THREE.MeshStandardMaterial>;
  orbitRadius: number;
  orbitalVelocity: number;
};

type TAsteroidState = {
  matrix: THREE.Matrix4;
  orbitRadius: number;
  orbitalVelocity: number;
};

type TAnimation = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
};
type TAnimationStateToClean = {
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer;

};

export type {
  TAvatar,
  TSun,
  TAsteroid,
  TAnimation,
  TAnimationStateToClean,
  TAsteroidState,
  TPlanet
};
