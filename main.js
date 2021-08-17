import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//Scene == Container
const scene = new THREE.Scene();

//camera manage what is showing
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Make the magic happen (manage the rendering)
const renderer = new THREE.WebGL1Renderer({
   canvas: document.querySelector('#bg'),
});


renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);

renderer.render( scene, camera );

//Create a geometric element provide by ThreeJS
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//Create a wraper material to our geometric element
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 });
// Mesh combine the geometry with the material
const torus = new THREE.Mesh( geometry, material );
scene.add( torus )

//Create Light to illiminate the scene on a specifique point
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,20);
//Create a light for the entire room
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add( pointLight, ambientLight)

//Helpers for different things
//show position of pointLight
const lightHelper = new THREE.PointLightHelper(pointLight)
//Show grid in the scene to help
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper )

//Enable Control of de camera by the mouse
const controls = new OrbitControls( camera, renderer.domElement )

//Render large random object in the screen
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//Import custom object
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Avatar
const levyTexture = new THREE.TextureLoader().load('levy.png');

const levy = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: levyTexture})
)
scene.add(levy)

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( { 
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon)

moon.position.z = 30;
moon.position.setX(-10);

// Function to handler scroll Event
function moveCamera() {

  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  levy.rotation.y += 0.01;
  levy.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}

document.body.onscroll = moveCamera


// Recursive function to mechanise the rendering
function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update()

  renderer.render( scene, camera)
}

animate()