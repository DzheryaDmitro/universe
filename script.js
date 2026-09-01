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

// 2. ДАНІ КАРТОК (12 елементів: 6 фото та 6 відео)
const cardsData = [
  { title: "Фора",  image: photo1, icon: "❤️" },
  { title: "Хмельницький тт", video: video1, icon: "🎬" },
  { title: "Урок противогази", image: photo2, icon: "💕" },
  { title: "Луна кава",  video: video2, icon: "🎵" },
  { title: "Випивка ДО",  image: photo3, icon: "✨" },
  { title: "Прогулка з Матьохою", video: video3, icon: "✈️" },
  { title: "Дім офіцерів",  image: photo4, icon: "🌸" },
  { title: "Осінь листя",  video: video4, icon: "🎥" },
  { title: "Старий бондар",  image: photo5, icon: "👑" },
  { title: "Люди-Бумбокс",  video: video5, icon: "♾️" },
  { title: "Парк",  image: photo6, icon: "💎" },
  { title: "Especial", video: video6, icon: "⭐" }
];

// 3. THREE.JS ГОЛОВНА АНІМАЦІЯ
function init3DUniverse() {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  container.innerHTML = '';

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 18, 38);
  camera.lookAt(0, 2, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const galaxyGroup = new THREE.Group();
  scene.add(galaxyGroup);

  // ГРУПА РЕАЛІСТИЧНОЇ САКУРИ
  const sakuraFlowerGroup = new THREE.Group();

  // А1. ПЕЛЮСТКИ САКУРИ (ЯСКРАВО-РОЖЕВІ ПЕЛЮСТКИ, ЯК БУЛО РАНІШЕ)
  const petalCount = 18000;
  const sakuraGeo = new THREE.BufferGeometry();
  const sakuraPos = new Float32Array(petalCount * 3);
  const sakuraColors = new Float32Array(petalCount * 3);

  const colCenter = new THREE.Color(0xff007f); // Темний рожевий
  const colMid = new THREE.Color(0xff69b4);    // Яскраво-рожевий
  const colEdge = new THREE.Color(0xffb6c1);   // Ніжно-рожевий світлий край

  for (let i = 0; i < petalCount; i++) {
    let angle = Math.random() * Math.PI * 2;
    
    // Форма 5 окремих пелюсток з виїмками
    let petalSector = (angle * 5) % (Math.PI * 2);
    let petalShape = Math.sin(petalSector / 2);
    
    let rMax = 8.0 * Math.pow(petalShape, 0.7);
    
    if (Math.abs(petalSector - Math.PI) < 0.2) {
      rMax *= 0.82;
    }

    let dist = Math.sqrt(Math.random()) * rMax;
    if (dist < 0.5) dist = 0.5;

    let x = dist * Math.cos(angle);
    let y = dist * Math.sin(angle);

    let wave = Math.sin(dist * 1.5) * 0.4;
    let cupShape = Math.pow(dist / 8.0, 1.8) * 2.2;
    let z = cupShape + wave + (Math.random() - 0.5) * 0.35;

    let noise = (Math.random() - 0.5) * 0.12;

    sakuraPos[i * 3] = x + noise;
    sakuraPos[i * 3 + 1] = y + noise;
    sakuraPos[i * 3 + 2] = z + noise;

    // Класичний градієнт пелюсток
    let normDist = dist / 8.0;
    let mixedColor;

    if (normDist < 0.2) {
      mixedColor = colCenter.clone().lerp(colMid, normDist / 0.2);
    } else {
      mixedColor = colMid.clone().lerp(colEdge, (normDist - 0.2) / 0.8);
    }

    sakuraColors[i * 3] = mixedColor.r;
    sakuraColors[i * 3 + 1] = mixedColor.g;
    sakuraColors[i * 3 + 2] = mixedColor.b;
  }

  sakuraGeo.setAttribute('position', new THREE.BufferAttribute(sakuraPos, 3));
  sakuraGeo.setAttribute('color', new THREE.BufferAttribute(sakuraColors, 3));

  const sakuraMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });

  const sakuraMesh = new THREE.Points(sakuraGeo, sakuraMat);
  sakuraFlowerGroup.add(sakuraMesh);

  // А2. ТИЧИНКИ ТА ПИЛЯКИ В СЕРЕДИНІ (ЯСКРАВО-РОЖЕВІ)
  const stamenCount = 800;
  const stamenGeo = new THREE.BufferGeometry();
  const stamenPos = new Float32Array(stamenCount * 3);
  const stamenColors = new Float32Array(stamenCount * 3);

  const colStamenFilament = new THREE.Color(0xff1493); // Яскравий малиново-рожевий
  const colStamenAnther = new THREE.Color(0xff69b4);   // Насичено-рожевий

  for (let i = 0; i < stamenCount; i++) {
    let stamenAngle = Math.random() * Math.PI * 2;
    let stamenRadius = Math.random() * 1.8;
    let heightProgress = Math.random();

    let x = stamenRadius * Math.cos(stamenAngle) * heightProgress;
    let y = stamenRadius * Math.sin(stamenAngle) * heightProgress;
    let z = heightProgress * 2.4;

    stamenPos[i * 3] = x;
    stamenPos[i * 3 + 1] = y;
    stamenPos[i * 3 + 2] = z;

    let color = heightProgress > 0.75 ? colStamenAnther : colStamenFilament;
    stamenColors[i * 3] = color.r;
    stamenColors[i * 3 + 1] = color.g;
    stamenColors[i * 3 + 2] = color.b;
  }

  stamenGeo.setAttribute('position', new THREE.BufferAttribute(stamenPos, 3));
  stamenGeo.setAttribute('color', new THREE.BufferAttribute(stamenColors, 3));

  const stamenMat = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });

  const stamenMesh = new THREE.Points(stamenGeo, stamenMat);
  sakuraFlowerGroup.add(stamenMesh);

  // Розвертаємо квітку горизонтально
  sakuraFlowerGroup.rotation.x = -Math.PI / 2;
  sakuraFlowerGroup.position.y = 0.5;
  galaxyGroup.add(sakuraFlowerGroup);

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
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const galaxyMesh = new THREE.Points(galaxyGeo, galaxyMat);
  galaxyGroup.add(galaxyMesh);

  // В. НАПИСИ
  const labels = ["Волейбол", "Теніс", "Піаніно", "Пенсія", "Шпиндик", "Обізяна", "Панорама", "Тьома", "Фотосесія"]

  function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 64;
    ctx.font = 'Bold 30px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = 14;
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

  // Г. 12 САТЕЛІТІВ (ФОТО ТА ВІДЕО)
  const interactiveObjects = [];

  cardsData.forEach((data, index) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;

    ctx.fillStyle = 'rgba(255, 20, 147, 0.95)';
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

    let radius = 12 + (index % 3) * 3; 
    let angle = (index / cardsData.length) * Math.PI * 2;

    sprite.position.set(radius * Math.cos(angle), 1, radius * Math.sin(angle));
    sprite.scale.set(3.2, 3.2, 1);

    sprite.userData = data;
    galaxyGroup.add(sprite);
    interactiveObjects.push(sprite);
  });

  // Д. КЛІК
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
    
    sakuraFlowerGroup.rotation.z += 0.002;
    let pulse = 1 + Math.sin(Date.now() * 0.0018) * 0.035;
    sakuraFlowerGroup.scale.set(pulse, pulse, pulse);

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