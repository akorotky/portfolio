import * as THREE from "three";
import asteroidImage from "../../assets/asteroid.jpg";
import avatarImage from "../../assets/lion-avatar.png";
import sunImage from "../../assets/sun.jpg";
import { TSun, TAsteroid, TAsteroidState } from "./threeJsAnimationTypes";

export const createAvatar = () => {
  const avatarTexture = new THREE.TextureLoader().load(avatarImage);
  const avatar = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({ map: avatarTexture })
  );
  avatar.position.set(-5, 5, 1);
  return { mesh: avatar };
};

export const createSun = (): TSun => {
  const sunTexture = new THREE.TextureLoader().load(sunImage);
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(4, 64, 32),
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
    const [x, y, z] = [15, 2, 15].map((n) =>
      THREE.MathUtils.randFloatSpread(n)
    );

    const matrix = new THREE.Matrix4();
    matrix.setPosition(x, y, z);
    instancedAsteroid.setMatrixAt(i, matrix);

    // save state for each asteroid
    asteroidStateMap.set(i, {
      matrix: matrix,
      orbitRadius: Math.random() * 5 + 5,
      orbitalVelocity: Math.random() / 5000,
    } as TAsteroidState);
  }
  return instancedAsteroid;
};

export const initMeshes = (scene: THREE.Scene) => {
  const avatar = createAvatar();
  const sun = createSun();
  const instancedAsteroid = createAsteroids(500);

  // add meshes to the scene
  scene.add(avatar.mesh);
  scene.add(sun.mesh);
  scene.add(instancedAsteroid);

  return { avatar, sun, instancedAsteroid };
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

  let scrollTop = document.documentElement.scrollTop;
  let scrollPercentage = scrollTop / maxScrollTop;
  const radius = 10; // distance from the sun

  // update camera coordinates
  let newZ = radius * Math.cos((scrollPercentage * Math.PI) / 2);
  let newY = (radius + 5) * Math.sin((scrollPercentage * Math.PI) / 2);

  camera.rotation.x = Math.sin((scrollPercentage * Math.PI) / 2);
  camera.position.set(camera.position.x, newY, newZ);

  // make camera look always at the sun
  camera.lookAt(new THREE.Vector3(0, 0, 0));
};
