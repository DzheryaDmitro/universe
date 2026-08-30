// 1. ПЕРЕХОДИ МІЖ ЕКРАНАМИ
const chatScreen = document.getElementById('chat-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const universeScreen = document.getElementById('universe-screen');

document.getElementById('open-file-btn').addEventListener('click', () => {
  chatScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
});

document.getElementById('enter-btn').addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  universeScreen.classList.remove('hidden');
  init3DUniverse();
});

// 2. ДАНІ КАРТОК (10 елементів: 5 фото та 5 відео)
const cardsData = [
  { title: "Amor de mi Vida", desc: "Nuestro primer recuerdo mágico.", image: photo1, icon: "❤️" },
  { title: "Momento Especial", desc: "La vez que no parábamos de reír.", video: video1, icon: "🎬" },
  { title: "Para Siempre", desc: "Un instante inolvidable juntos.", image: photo2, icon: "💕" },
  { title: "Nuestra Canción", desc: "Bailando bajo las estrellas.", video: video2, icon: "🎵" },
  { title: "Mi Sol", desc: "Tu sonrisa ilumina mi mundo.", image: photo3, icon: "✨" },
  { title: "Aventura", desc: "El mejor viaje de nuestras vidas.", video: video3, icon: "✈️" },
  { title: "Eres Magia", desc: "Contigo todo es mejor.", image: photo4, icon: "🌸" },
  { title: "Pura Alegría", desc: "Pequeños momentos de gran felicidad.", video: video4, icon: "🎥" },
  { title: "Nuestro Universo", desc: "Un amor que no tiene fin.", image: photo5, icon: "👑" },
  { title: "Infinito", desc: "Por muchos más recuerdos como este.", video: video5, icon: "♾️" }
];

// 3. THREE.JS ГОЛОВНА АНІМАЦІЯ
function init3DUniverse() {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  container.innerHTML = '';

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 18, 35);
  camera.lookAt(0, 2, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const galaxyGroup = new THREE.Group();
  scene.add(galaxyGroup);

  // А. СЕРЦЕ З ЧАСТИНОК
  const heartCount = 10000;
  const heartGeo = new THREE.BufferGeometry();
  const heartPos = new Float32Array(heartCount * 3);
  const heartColors = new Float32Array(heartCount * 3);

  const colorInner = new THREE.Color(0xff1493);
  const colorOuter = new THREE.Color(0xffb6c1);

  for (let i = 0; i < heartCount; i++) {
    let t = Math.PI * (Math.random() * 2 - 1);
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    let scale = 0.65;
    let thickness = (Math.random() - 0.5) * 3.5;

    heartPos[i * 3] = x * scale + (Math.random() - 0.5) * 0.5;
    heartPos[i * 3 + 1] = y * scale + 6 + (Math.random() - 0.5) * 0.5; 
    heartPos[i * 3 + 2] = thickness;

    let mixedColor = colorInner.clone().lerp(colorOuter, Math.random());
    heartColors[i * 3] = mixedColor.r;
    heartColors[i * 3 + 1] = mixedColor.g;
    heartColors[i * 3 + 2] = mixedColor.b;
  }

  heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
  heartGeo.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));

  const heartMat = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const heartMesh = new THREE.Points(heartGeo, heartMat);
  galaxyGroup.add(heartMesh);

  // Б. ГАЛАКТИКА
  const galaxyCount = 12000;
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPos = new Float32Array(galaxyCount * 3);

  for (let i = 0; i < galaxyCount; i++) {
    let r = 4 + Math.random() * 22;
    let theta = r * 1.5 + Math.random() * 0.5;

    galaxyPos[i * 3] = r * Math.cos(theta);
    galaxyPos[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
    galaxyPos[i * 3 + 2] = r * Math.sin(theta);
  }

  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
  const galaxyMat = new THREE.PointsMaterial({
    size: 0.18,
    color: 0xff69b4,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const galaxyMesh = new THREE.Points(galaxyGeo, galaxyMat);
  galaxyGroup.add(galaxyMesh);

  // В. НАПИСИ
  const labels = ["HAPPY BIRTHDAY", "ERES MAGIA", "MI AMOR ETERNO", "TE ADORO"];

  function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 64;
    ctx.font = 'Bold 30px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = 12;
    ctx.textAlign = 'center';
    ctx.fillText(text, 256, 42);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(8, 1.2, 1);
    return sprite;
  }

  labels.forEach((text, i) => {
    const sprite = createTextSprite(text);
    let radius = 10 + (i % 2) * 5;
    let angle = (i / labels.length) * Math.PI * 2;
    sprite.position.set(radius * Math.cos(angle), (Math.random() - 0.5) * 2, radius * Math.sin(angle));
    galaxyGroup.add(sprite);
  });

  // Г. 10 САТЕЛІТІВ (по колу для 10 елементів)
  const interactiveObjects = [];

  cardsData.forEach((data, index) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;

    ctx.fillStyle = 'rgba(255, 20, 147, 0.9)';
    ctx.beginPath();
    ctx.arc(64, 64, 55, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = '45px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.icon, 64, 66);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);

    // Змінений радіус для 10 елементів, щоб не перекривали один одного
    let radius = 12 + (index % 2) * 4; 
    let angle = (index / cardsData.length) * Math.PI * 2;

    sprite.position.set(radius * Math.cos(angle), 1, radius * Math.sin(angle));
    sprite.scale.set(3.2, 3.2, 1);

    sprite.userData = data;
    galaxyGroup.add(sprite);
    interactiveObjects.push(sprite);
  });

  // Д. КЛІК (РОЗПІЗНАВАННЯ ФОТО ЧИ ВІДЕО)
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const modal = document.getElementById('info-modal');
  const modalImg = document.getElementById('modal-img');
  const modalVideo = document.getElementById('modal-video');

  window.addEventListener('click', (event) => {
    if (universeScreen.classList.contains('hidden')) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
      const clickedData = intersects[0].object.userData;
      document.getElementById('modal-title').innerText = clickedData.title;
      document.getElementById('modal-desc').innerText = clickedData.desc;

      if (clickedData.video) {
        modalImg.style.display = "none";
        modalVideo.style.display = "block";
        modalVideo.src = clickedData.video;
        modalVideo.play();
      } else {
        modalVideo.pause();
        modalVideo.style.display = "none";
        modalImg.style.display = "block";
        modalImg.style.backgroundImage = `url("${clickedData.image}")`;
        modalImg.style.backgroundSize = "cover";
        modalImg.style.backgroundPosition = "center";
      }

      modal.classList.remove('hidden');
    }
  });

  // Е. ЦИКЛ АНІМАЦІЇ
  function animate() {
    requestAnimationFrame(animate);
    galaxyGroup.rotation.y += 0.003;
    heartMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.15;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// 4. ЗАКРИТТЯ МОДАЛЬНОГО ВІКНА
document.getElementById('close-modal-btn').addEventListener('click', () => {
  const modalVideo = document.getElementById('modal-video');
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
  }
  document.getElementById('info-modal').classList.add('hidden');
});