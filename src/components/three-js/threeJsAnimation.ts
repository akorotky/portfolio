import * as THREE from "three";
import space from "../../assets/space.jpg";
import asteroidImage from "../../assets/asteroid.jpg";
import avatarImage from "../../assets/lion-avatar.png";
import sunImage from "../../assets/sun.jpg";

type TAvatar = {
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
};

const createAvatar = () => {
  const avatarTexture = new THREE.TextureLoader().load(avatarImage);
  const avatar = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({ map: avatarTexture })
  );
  avatar.position.set(-5, 5, 1);
  return { mesh: avatar };
};

type TSun = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
};

const createSun = (): TSun => {
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

type TAsteroid = {
  mesh: THREE.Mesh<THREE.DodecahedronGeometry, THREE.MeshStandardMaterial>;
  orbitRadius: number;
  orbitalVelocity: number;
};

const createAsteroid = (): TAsteroid => {
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

type TAsteroidState = {
  matrix: THREE.Matrix4;
  orbitRadius: number;
  orbitalVelocity: number;
};

const asteroidStateMap = new Map();

const createAsteroids = (asteroidCount: number) => {
  const asteroid = createAsteroid();
  const instancedAsteroid = new THREE.InstancedMesh(
    asteroid.mesh.geometry,
    asteroid.mesh.material,
    asteroidCount
  );

  for (let i = 0; i < asteroidCount; i++) {
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

const initMeshes = (scene: THREE.Scene) => {
  const avatar = createAvatar();
  const sun = createSun();
  const instancedAsteroid = createAsteroids(500);

  scene.add(avatar.mesh);
  scene.add(sun.mesh);
  scene.add(instancedAsteroid);

  return { avatar, sun, instancedAsteroid };
};

export const createAnimation = (canvas: HTMLCanvasElement): TAnimation => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // const ambientLight = new THREE.AmbientLight(0xffffff);
  // scene.add(pointLight, ambientLight);

  const spaceTexture = new THREE.TextureLoader().load(space);
  scene.background = spaceTexture;

  // init meshes
  const { avatar, sun, instancedAsteroid } = initMeshes(scene);

  const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
  pointLight.position.set(
    sun.mesh.position.x,
    sun.mesh.position.y,
    sun.mesh.position.z
  );
  scene.add(pointLight);
  sun.mesh.material.needsUpdate = true;

  const lightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(lightHelper);

  const onWindowResize = () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Resize renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", onWindowResize);

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

  window.onscroll = function () {
    let scrollTop = document.documentElement.scrollTop;
    let scrollPercentage = scrollTop / maxScrollTop;
    const radius = 10;

    let newZ = radius * Math.cos((scrollPercentage * Math.PI) / 2);
    let newY = (radius + 5) * Math.sin((scrollPercentage * Math.PI) / 2);

    camera.rotation.x = Math.sin((scrollPercentage * Math.PI) / 2);
    camera.position.set(camera.position.x, newY, newZ);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  };

  return { scene, camera, renderer, avatar, sun, instancedAsteroid };
};

type TAnimation = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  avatar: TAvatar;
  sun: TSun;
  instancedAsteroid: THREE.InstancedMesh<
    THREE.DodecahedronGeometry,
    THREE.MeshStandardMaterial
  >;
};

const updateInstancedAsteroidAnimationState = (
  instancedAsteroid: THREE.InstancedMesh<
    THREE.DodecahedronGeometry,
    THREE.MeshStandardMaterial
  >
) => {
  for (let i = 0; i < instancedAsteroid.count; i++) {
    const { matrix, orbitRadius, orbitalVelocity } = asteroidStateMap.get(
      i
    ) as TAsteroidState;
    const dummy = new THREE.Object3D();
    dummy.applyMatrix4(matrix);

    dummy.rotation.x += 0.005;
    dummy.rotation.y += 0.005;
    dummy.rotation.z += 0.005;

    dummy.position.x = orbitRadius * Math.sin(Date.now() * orbitalVelocity);
    dummy.position.z = orbitRadius * Math.cos(Date.now() * orbitalVelocity);

    dummy.updateMatrix();

    instancedAsteroid.setMatrixAt(i, dummy.matrix);
    asteroidStateMap.set(i, {
      ...asteroidStateMap.get(i),
      matrix: dummy.matrix,
    });
  }
  instancedAsteroid.instanceMatrix.needsUpdate = true;
};

export function animate(animation: TAnimation) {
  const { scene, camera, renderer, avatar, sun, instancedAsteroid } = animation;

  updateInstancedAsteroidAnimationState(instancedAsteroid);

  avatar.mesh.rotation.x += 0.01;
  avatar.mesh.rotation.y += 0.01;
  avatar.mesh.rotation.z += 0.01;

  sun.mesh.rotation.x += 0.001;
  sun.mesh.rotation.y += 0.001;

  renderer.render(scene, camera);
  requestAnimationFrame(() =>
    animate({ scene, camera, renderer, avatar, sun, instancedAsteroid })
  );
}

type TAnimationStateToClean = {
  renderer: THREE.WebGLRenderer;
  avatar: TAvatar;
  sun: TSun;
  instancedAsteroid: THREE.InstancedMesh<
    THREE.DodecahedronGeometry,
    THREE.MeshStandardMaterial
  >;
};

export function cleanup(animationStateToClean: TAnimationStateToClean) {
  const { renderer, avatar, sun, instancedAsteroid } = animationStateToClean;
  renderer.dispose();
  [avatar, sun].forEach((o) => {
    o.mesh.geometry.dispose();
    o.mesh.material.dispose();
  });
  instancedAsteroid.geometry.dispose();
  instancedAsteroid.material.dispose();
}
