import * as THREE from "three";
import asteroidImage from "../../assets/asteroid.jpg";
import avatarImage from "../../assets/lion-avatar.png";
import sunImage from "../../assets/sun.jpg";
import earthImage from "../../assets/earth.jpg";
import jupiterImage from "../../assets/jupiter.jpg";
import neptuneImage from "../../assets/neptune.jpg";
import uranusImage from "../../assets/uranus.jpg";
import marsImage from "../../assets/mars.jpg";
import venusImage from "../..//assets/venus.jpg";
import mercuryImage from "../..//assets/mercury.jpg";
import saturnImage from "../../assets/saturn.jpg";
import moonImage from "../../assets/moon.jpg";

import {
  TSun,
  TAsteroid,
  TAsteroidState,
  TPlanet,
} from "./threeJsAnimationTypes";

export const createAvatar = () => {
  const avatarTexture = new THREE.TextureLoader().load(avatarImage);
  const avatar = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.1),
    new THREE.MeshBasicMaterial({ map: avatarTexture })
  );
  avatar.position.set(-0.4, 0.18, 12.6);
  return { mesh: avatar };
};

export const createSun = (): TSun => {
  const sunTexture = new THREE.TextureLoader().load(sunImage);
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5, 64, 32),
    new THREE.MeshStandardMaterial({
      map: sunTexture,
      emissive: 0xffc500,
      emissiveMap: sunTexture,
      emissiveIntensity: 1.3,
      metalness: 1,
      roughness: 0,
    })
  );
  return { mesh: sun };
};

export const createPlanet = (radius: number, image: string): TPlanet => {
  const planetTexture = new THREE.TextureLoader().load(image);
  const planetMesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 32),
    new THREE.MeshStandardMaterial({
      map: planetTexture,
    })
  );
  return { mesh: planetMesh };
};

export const createAsteroid = (): TAsteroid => {
  const asteroidTexture = new THREE.TextureLoader().load(asteroidImage);
  const mesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.05, 1),
    new THREE.MeshStandardMaterial({ map: asteroidTexture })
  );

  const [x, y, z] = [15, 2, 15].map((n) => THREE.MathUtils.randFloatSpread(n));

  mesh.position.set(x, y, z);

  const orbitRadius = Math.random() * 5 + 5;
  const orbitalVelocity = Math.random() / 5000;

  return { mesh, orbitRadius, orbitalVelocity };
};

const asteroidStateMap = new Map();

export const createAsteroids = (asteroidCount: number) => {
  const asteroid = createAsteroid();
  const instancedAsteroid = new THREE.InstancedMesh(
    asteroid.mesh.geometry,
    asteroid.mesh.material,
    asteroidCount
  );

  for (let i = 0; i < asteroidCount; i++) {
    // generate random position coordinates
    const pos = (n: number) => THREE.MathUtils.randFloatSpread(n);
    const matrix = new THREE.Matrix4();
    matrix.setPosition(20, pos(1.7), 20);
    instancedAsteroid.setMatrixAt(i, matrix);

    // save state for each asteroid
    asteroidStateMap.set(i, {
      matrix: matrix,
      orbitRadius: Math.random() * 5 + 15,
      orbitalVelocity: Math.random() / 5000,
    } as TAsteroidState);
  }
  return instancedAsteroid;
};

export const initMeshes = (scene: THREE.Scene) => {
  const avatar = createAvatar();
  const sun = createSun();
  const instancedAsteroid = createAsteroids(500);
  const earth = createPlanet(0.5, earthImage);
  const moon = createPlanet(0.15, moonImage);
  const mercury = createPlanet(0.21, mercuryImage);
  const venus = createPlanet(0.48, venusImage);
  const mars = createPlanet(0.26, marsImage);
  const jupiter = createPlanet(1.7, jupiterImage);
  const saturn = createPlanet(1.4, saturnImage);
  const uranus = createPlanet(0.8, uranusImage);
  const neptune = createPlanet(0.7, neptuneImage);

  // define names for objects to be able to retrieve them from the scene
  mercury.mesh.name = "Mercury";
  venus.mesh.name = "Venus";
  earth.mesh.name = "Earth";
  moon.mesh.name = "Moon";
  mars.mesh.name = "Mars";
  jupiter.mesh.name = "Jupiter";
  saturn.mesh.name = "Saturn";
  uranus.mesh.name = "Uranus";
  neptune.mesh.name = "Neptune";

  sun.mesh.name = "Sun";
  avatar.mesh.name = "Avatar";
  instancedAsteroid.name = "Asteroids";

  // add meshes to the scene
  scene.add(sun.mesh);
  scene.add(mercury.mesh);
  scene.add(venus.mesh);
  scene.add(earth.mesh);
  scene.add(moon.mesh);
  scene.add(mars.mesh);
  scene.add(jupiter.mesh);
  scene.add(saturn.mesh);
  scene.add(neptune.mesh);
  scene.add(uranus.mesh);

  scene.add(avatar.mesh);
  scene.add(instancedAsteroid);
};

export const updateInstancedAsteroidAnimationState = (
  instancedAsteroid: THREE.InstancedMesh<
    THREE.DodecahedronGeometry,
    THREE.MeshStandardMaterial
  >
) => {
  for (let i = 0; i < instancedAsteroid.count; i++) {
    const { matrix, orbitRadius, orbitalVelocity } = asteroidStateMap.get(
      i
    ) as TAsteroidState;
    // create dummy object to hold new state
    const dummy = new THREE.Object3D();

    // place current state into the dummy object
    dummy.applyMatrix4(matrix);

    dummy.rotation.x += 0.005;
    dummy.rotation.y += 0.005;
    dummy.rotation.z += 0.005;

    dummy.position.x = orbitRadius * Math.sin(Date.now() * orbitalVelocity);
    dummy.position.z = orbitRadius * Math.cos(Date.now() * orbitalVelocity);

    // update dummy's matrix to paply the transformations
    dummy.updateMatrix();

    // update the state in the instanced mesh from the dummy object's state
    instancedAsteroid.setMatrixAt(i, dummy.matrix);

    // update the hash map with new state
    asteroidStateMap.set(i, {
      ...asteroidStateMap.get(i),
      matrix: dummy.matrix,
    });
  }
  // request an update of the instanced mesh
  instancedAsteroid.instanceMatrix.needsUpdate = true;
};

export const keepAnimationWindowSizeConstant = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  // update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  // update camera projection matrix
  camera.updateProjectionMatrix();
  // resize renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
};

export const changeCameraPerspactiveOnScroll = (
  camera: THREE.PerspectiveCamera
) => {
  const body = document.body;
  const html = document.documentElement;

  const maxScrollTop =
    Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    ) - window.innerHeight;

  const scrollTop = document.documentElement.scrollTop;
  const scrollPercentage = scrollTop / maxScrollTop;
  const radius = 13; // distance from the sun

  // update camera coordinates
  const newZ = radius * Math.cos((scrollPercentage * Math.PI) / 2);
  const newY = (radius + 25) * Math.sin((scrollPercentage * Math.PI) / 2);
  const newX = Math.sin((scrollPercentage * Math.PI) / 2);

  camera.position.set(newX, newY, newZ);

  // make camera look always at the sun
  camera.lookAt(new THREE.Vector3(0, 0, 0));
};
