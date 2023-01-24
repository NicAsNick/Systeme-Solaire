import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Functions

const lightHelper = (planeteId) => {
  return new THREE.PointLightHelper(planeteId, 0.2);
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const soleil = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshStandardMaterial({ color: 0xFFC500 })
);
soleil.position.y = 5;
scene.add(soleil);

// sol
const sol = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20), // 20x20
  new THREE.MeshBasicMaterial({ color: "gray" })
);
sol.rotation.x = -Math.PI * 0.5;
sol.position.y = 0;
//scene.add(sol);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Galaxy

/* GALAXY */
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 3,
  spin: 7,
  branche: 3,
  randomness: 10,
  randomnessPower: 1,
  insideColor: "#ff28423",
  outsideColor: "#8234FA",
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const spin = parameters.spin * radius;
    const branchAngle =
      ((i % parameters.branche) / parameters.branche) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    positions[i3] = Math.cos(branchAngle + spin) * radius +randomX;
    positions[i3 + 1] = randomY + 5;
    positions[i3 + 2] = Math.sin(branchAngle + spin) * radius + randomZ;

    /* COLORS */
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius); // lerp permet de faire une interpolation entre deux couleurs

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /* MATERIAL */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /* POINTS */
  points = new THREE.Points(geometry, material);

  /* SCENE */
  scene.add(points);
};

generateGalaxy();

// light
const planetes = new Array();
const Mercure = new THREE.PointLight(0xc0c0c0, 0.5);
const Venus = new THREE.PointLight(0xffa500, 0.45);
const Mars = new THREE.PointLight(0xff4500, 0.4);
const Jupiter = new THREE.PointLight(0xf5a623, 0.35);
const Saturne = new THREE.PointLight(0xfdb813, 0.3);
const Uranus = new THREE.PointLight(0x00ff7f, 0.25);
const Neptune = new THREE.PointLight(0x87cefa, 0.2);

const MOON = new THREE.PointLight("white", 7)

planetes.push(Mercure, Venus, Mars, Jupiter, Saturne, Uranus, Neptune);

planetes.forEach((planete) => {
    planete.position.y = 3
  scene.add(planete, lightHelper(planete));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
); // field of view, aspect ratio, near, far
camera.position.z = 15;
camera.position.y = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// tick
const clock = new THREE.Clock();

const planeteRotation = (planete, timePassed, duree, distance) => {
  planete.position.x = Math.sin(Math.PI * timePassed * duree) * distance;
  planete.position.z = Math.cos(Math.PI * timePassed * duree ) * distance;
  planete.position.y =  5;
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime(); // Permet de récupérer le temps écoulé depuis le début de l'animation
  // update objects

  planeteRotation(Mercure, elapsedTime, 1/88 * 100, 3);
  planeteRotation(Venus, elapsedTime, 1/225 * 100, 4);
  planeteRotation(Mars, elapsedTime, 1/685 * 100, 5);
  planeteRotation(Jupiter, elapsedTime, 1/4345 * 100, 6);
  planeteRotation(Saturne, elapsedTime, 1/10767 * 100, 7);
  planeteRotation(Uranus, elapsedTime, 1/30660 * 100, 8);
  planeteRotation(Neptune, elapsedTime, 1/59860 * 100, 9);
  

  // render
  renderer.render(scene, camera);
  // call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/* 
Mercure : 88 jours -> 0,2410958904
Vénus : 225 jours -> 0,6164383562
Mars : 687 jours -> 1,8821917808
Jupiter : 4 343,5 jours -> 11,9
Saturne : 10 767,5 jours -> 29.5
Uranus : 30 660 jours -> 84
Neptune : 59 860 jours -> 164

Plus la valeur est élevé moins il prends de temps sur la terre
Mais sur le base de temps, plus le valeur de temps est élevé plus il va vite donc il faut inversé les valeurs
*/
