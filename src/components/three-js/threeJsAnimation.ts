import * as THREE from "three";
import space from "../../assets/space.jpg";
import asteroidImage from "../../assets/asteroid.jpg";
import avatarImage from "../../assets/lion-avatar.png";
import sunImage from "../../assets/sun.jpg";

const speed = 0.005;

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
  velocity: THREE.Vector3;
  orbitRadius: number;
  orbitalVelocity: number;
};

const createAsteroid = (): TAsteroid => {
  const asteroidTexture = new THREE.TextureLoader().load(asteroidImage);
  const mesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.05, 1),
    new THREE.MeshStandardMaterial({ map: asteroidTexture })
  );

  const [x, y, z] = Array(3)
    .fill(0)
    .map((_) => THREE.MathUtils.randFloatSpread(15));

  mesh.position.set(x, THREE.MathUtils.randFloatSpread(2), z);

  const velocity = new THREE.Vector3(speed, speed, 0);
  const orbitRadius = Math.random() * 5 + 5;
  const orbitalVelocity = Math.random() / 5000;

  return { mesh, velocity, orbitRadius, orbitalVelocity };
};

const initMeshes = (scene: THREE.Scene) => {
  const avatar = createAvatar();
  const sun = createSun();
  scene.add(avatar.mesh);
  scene.add(sun.mesh);

  const asteroids = Array(500)
    .fill(0)
    .map((_) => {
      const asteroid = createAsteroid();
      scene.add(asteroid.mesh);
      return asteroid;
    });

  return { avatar, sun, asteroids };
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
  const { avatar, sun, asteroids } = initMeshes(scene);

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

  return { scene, camera, renderer, avatar, sun, asteroids };
};

type TAnimation = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  avatar: TAvatar;
  sun: TSun;
  asteroids: TAsteroid[];
};

export function animate(animation: TAnimation) {
  const { scene, camera, renderer, avatar, sun, asteroids } = animation;
  const aspectRatio = window.innerWidth / window.innerHeight;

  asteroids.forEach((a) => {
    const cameraHeight =
      2 *
      Math.tan(((camera.fov / 2) * Math.PI) / 180) *
      Math.abs(camera.position.z - a.mesh.position.z);
    const cameraWidth = cameraHeight * aspectRatio;

    a.mesh.rotation.x += 0.005;
    a.mesh.rotation.y += 0.005;
    a.mesh.rotation.z += 0.005;

    if (Math.abs(a.mesh.position.x) > cameraWidth / 2) a.velocity.x *= -1;
    if (Math.abs(a.mesh.position.y) > cameraHeight / 2) a.velocity.y *= -1;

    a.mesh.position.x =
      a.orbitRadius * Math.sin(Date.now() * a.orbitalVelocity);
    a.mesh.position.z =
      a.orbitRadius * Math.cos(Date.now() * a.orbitalVelocity);
  });

  avatar.mesh.rotation.x += 0.01;
  avatar.mesh.rotation.y += 0.01;
  avatar.mesh.rotation.z += 0.01;

  sun.mesh.rotation.x += 0.001;
  sun.mesh.rotation.y += 0.001;

  renderer.render(scene, camera);
  requestAnimationFrame(() =>
    animate({ scene, camera, renderer, avatar, sun, asteroids })
  );
}

type TAnimationStateToClean = {
  renderer: THREE.WebGLRenderer;
  avatar?: TAvatar;
  sun?: TSun;
  asteroids?: TAsteroid[];
};

export function cleanup(animationStateToClean: TAnimationStateToClean) {
  const { renderer, avatar, sun, asteroids } = animationStateToClean;
  renderer.dispose();

  [avatar, sun, asteroids].flat().forEach((o) => {
    o?.mesh.geometry.dispose();
    o?.mesh.material.dispose();
  });
}
