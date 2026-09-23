/*
  Scena 3D hero: aktualny model producenta, intro kamery, strumień
  chłodnego powietrza i delikatny parallax za kursorem.
  Ładowana dynamicznie tylko na stronie głównej; przy prefers-reduced-motion
  renderuje pojedynczą klatkę bez animacji. Canvas pozostaje ukryty,
  dopóki właściwy model i jego tekstury nie są gotowe.
*/
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  Box3,
  CanvasTexture,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Raycaster,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BG = 0x0d1117;

function streamTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  // jasność wzdłuż wstęgi: rodzi się przy wylocie, wygasa na końcu
  const h = ctx.createLinearGradient(0, 0, 256, 0);
  h.addColorStop(0, 'rgba(255,255,255,0)');
  h.addColorStop(0.15, 'rgba(255,255,255,0.9)');
  h.addColorStop(0.55, 'rgba(255,255,255,0.4)');
  h.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = h;
  ctx.fillRect(0, 0, 256, 64);
  // miękkie krawędzie w poprzek wstęgi
  const v = ctx.createLinearGradient(0, 0, 0, 64);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(0.5, 'rgba(0,0,0,1)');
  v.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, 256, 64);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function beamTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(128, 0, 10, 128, 0, 250);
  g.addColorStop(0, 'rgba(190,225,255,0.55)');
  g.addColorStop(0.5, 'rgba(150,205,255,0.18)');
  g.addColorStop(1, 'rgba(150,205,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export function initHero3D(stage, { brand = 'GREE' } = {}) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const brandName = brand.toUpperCase();
  const isKaisai = brandName === 'KAISAI';

  // Przezroczysta kanwa: tło daje CSS sekcji, a POD kanwą prześwituje
  // "szklany" napis FRIGAC (.hero-ghost).
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(BG, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = isKaisai ? 1.05 : 1.35;
  stage.appendChild(renderer.domElement);

  const scene = new Scene();

  const camera = new PerspectiveCamera(34, 1, 0.1, 60);

  // ---------- światła ----------
  scene.add(new AmbientLight(0xffffff, isKaisai ? 0.8 : 1.05));
  scene.add(new HemisphereLight(0xffffff, 0x17212c, isKaisai ? 1 : 1.25));

  const key = new DirectionalLight(0xffffff, isKaisai ? 3.6 : 4.4);
  key.position.set(3, 5, 6);
  scene.add(key);

  const rim = new DirectionalLight(0x8fd0ff, isKaisai ? 0.65 : 0.8);
  rim.position.set(-6, 2, -4);
  scene.add(rim);

  const fill = new DirectionalLight(0xf2f7ff, isKaisai ? 1.35 : 1.8);
  fill.position.set(-2, -3, 5);
  scene.add(fill);

  const glow = new PointLight(0x2f9dff, 9, 18, 2);
  glow.position.set(0, -2.4, 1.6);
  scene.add(glow);

  // ---------- jednostka ----------
  const unit = new Group();
  scene.add(unit);
  let loadedModel = null;
  let modelLoaded = false;
  let introStartedAt = performance.now();

  // Modele producentów są normalizowane do tej samej szerokości, dzięki czemu
  // zachowują wspólną responsywną kompozycję HERO.
  const modelConfig = brandName === 'GREE'
    ? { path: '/modele3d/pular_pro2.glb', rotationY: 0 }
    : brandName === 'KAISAI'
      ? { path: '/modele3d/kaisai aktualne-to-3d-texture.glb', rotationY: Math.PI }
      : null;

  // ---------- strumień powietrza: świetlny stożek + miękkie kłęby mgły ----------
  const airProfile = brandName === 'GREE'
    ? { outletY: -0.64, outletZ: 0.59, spread: 1.08 }
    : brandName === 'KAISAI'
      ? { outletY: -0.79, outletZ: 0.61, spread: 1.05 }
      : { outletY: -0.62, outletZ: 0.62, spread: 1 };
  const beam = new Mesh(
    new PlaneGeometry(3.6, 3.0),
    new MeshBasicMaterial({
      map: beamTexture(),
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
      side: 2
    })
  );
  beam.geometry.translate(0, -1.5, 0);
  beam.position.set(0, airProfile.outletY, airProfile.outletZ);
  beam.rotation.x = -0.85;
  unit.add(beam);

  // Faliste wstęgi powietrza płynące z wylotu — fala wędruje wzdłuż wstęgi,
  // co daje wrażenie ciągłego nawiewu.
  const SEG = 44;
  const streamTex = streamTexture();
  const STREAMS = [];
  const streamDefs = [
    { x0: -1.5, drift: -0.35, phase: 0.0, speed: 2.4, amp: 0.16, width: 0.34 },
    { x0: -0.9, drift: 0.15, phase: 1.7, speed: 2.0, amp: 0.12, width: 0.26 },
    { x0: -0.3, drift: -0.1, phase: 3.1, speed: 2.7, amp: 0.18, width: 0.3 },
    { x0: 0.35, drift: 0.25, phase: 4.4, speed: 2.2, amp: 0.13, width: 0.28 },
    { x0: 1.0, drift: -0.2, phase: 5.6, speed: 2.5, amp: 0.17, width: 0.32 },
    { x0: 1.55, drift: 0.35, phase: 0.9, speed: 2.1, amp: 0.12, width: 0.24 }
  ];
  let airflowLength = 1;

  for (const def of streamDefs) {
    const geo = new PlaneGeometry(1, 1, SEG, 1);
    const mat = new MeshBasicMaterial({
      map: streamTex,
      color: 0x9ed2ff,
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
      side: DoubleSide
    });
    const mesh = new Mesh(geo, mat);
    mesh.frustumCulled = false;
    unit.add(mesh);
    STREAMS.push({ def, mesh });
  }

  function updateStreams(t, flow) {
    for (const { def, mesh } of STREAMS) {
      const pos = mesh.geometry.attributes.position.array;
      for (let i = 0; i <= SEG; i++) {
        const u = i / SEG;
        const travel = u * airflowLength;
        // fala wędrująca w dół strumienia + poszerzanie się nawiewu
        const wave = Math.sin(travel * 7.5 - t * def.speed + def.phase) * def.amp * (0.25 + travel);
        const px = (def.x0 + def.drift * travel + wave) * airProfile.spread;
        const py = airProfile.outletY - 0.04 - 2.7 * travel * travel + Math.sin(travel * 11 - t * def.speed * 1.35 + def.phase) * 0.04;
        const pz = airProfile.outletZ + 2.3 * travel;
        const w = def.width * (0.45 + u * 1.1);
        // górna i dolna krawędź wstęgi
        pos[i * 3] = px - w / 2;
        pos[i * 3 + 1] = py;
        pos[i * 3 + 2] = pz;
        const j = (SEG + 1 + i) * 3;
        pos[j] = px + w / 2;
        pos[j + 1] = py;
        pos[j + 2] = pz;
      }
      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.material.opacity = 0.26 * flow;
    }
  }

  // ---------- responsywna kompozycja ----------
  // Poniżej 900 px jednostka zajmuje własny slot między ceną a opisem.
  // Od 900 px w górę pozycja i skala są liczone z realnej szerokości kolumny
  // tekstu (.hero-inner), tak aby model NIGDY nie nachodził na tekst i
  // zawsze miał zapas co najmniej GAP_PX.
  const GAP_PX = 44;
  const UNIT_EFFECTIVE_W = 5.2; // szerokość jednostki w świecie, z zapasem na obrót
  let comp = { unitX: 2.6, unitY: 0.35, rotX: 0, rotY: -0.18, camY: 0.1, camZ: 8.6, lookX: 0, scale: 0.88 };

  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;

    if (w < 900) {
      airflowLength = 0.48;
      beam.scale.y = airflowLength;
      const camZ = 11.5;
      const camY = -0.5;
      const worldH = 2 * camZ * Math.tan(((34 / 2) * Math.PI) / 180);
      const worldW = worldH * (w / h);
      const stageRect = stage.getBoundingClientRect();
      const slotRect = document.querySelector('[data-hero-model-slot]')?.getBoundingClientRect();
      const slotTop = slotRect ? slotRect.top - stageRect.top : h * 0.38;
      // Stała szerokość wizualna względem viewportu zachowuje obecną skalę
      // również na 320 px, mimo że HERO jest teraz wyższe.
      const scale = Math.min(0.62, (worldW * 0.9) / 4.7);
      const modelHalfPx = (0.9 * scale * h) / worldH;
      const centerPx = slotTop + modelHalfPx + 10;
      const unitY = camY - ((centerPx - h / 2) / h) * worldH + 0.08;

      comp = { unitX: 0, unitY, rotX: -0.08, rotY: -0.04, camY, camZ, lookX: 0, scale };
    } else {
      airflowLength = 1;
      beam.scale.y = 1;
      const camZ = 8.6;
      const camY = 0.1;
      // wymiary świata w płaszczyźnie jednostki (z = 0), kamera patrzy na wprost
      const worldH = 2 * camZ * Math.tan(((34 / 2) * Math.PI) / 180);
      const worldW = worldH * (w / h);
      const worldPerPx = worldW / w;

      // krawędzie kolumny tekstu i kontenera w pikselach ekranu
      const inner = document.querySelector('.hero-inner');
      const containerEl = document.querySelector('.hero .container');
      const textRightPx = inner ? inner.getBoundingClientRect().right : w * 0.45;
      const containerRect = containerEl ? containerEl.getBoundingClientRect() : null;
      // prawy margines modelu = lewy margines tekstu (symetria kompozycji)
      const rightMarginPx = containerRect ? containerRect.left : 20;

      // pas dostępny dla modelu: od tekstu + odstęp do prawej krawędzi kontenera
      const bandLeftPx = Math.min(textRightPx + GAP_PX, w * 0.72);
      const bandRightPx = w - rightMarginPx;
      const bandPx = Math.max(bandRightPx - bandLeftPx, 120);
      const bandWorld = bandPx * worldPerPx;

      // skala tak, aby model mieścił się w pasie
      let scale = (bandWorld * 0.96) / UNIT_EFFECTIVE_W;
      scale = Math.min(scale, 0.92);
      scale = Math.max(scale, 0.5);

      // model dosunięty do PRAWEJ krawędzi pasa: margines prawy == margines lewy tekstu
      const unitRightWorld = (bandRightPx - w / 2) * worldPerPx;
      const unitX = unitRightWorld - (UNIT_EFFECTIVE_W / 2) * scale;

      comp = { unitX, unitY: 0.35, rotX: 0, rotY: -0.18, camY, camZ, lookX: 0, scale };
    }

    unit.scale.setScalar(comp.scale);
    glow.position.set(comp.unitX, comp.unitY - 2.4 * comp.scale, 1.6);
    camera.updateProjectionMatrix();
  }
  layout();
  // przelicz po doładowaniu fontów (szerokość tekstu może się zmienić)
  window.addEventListener('load', layout);

  // ---------- interakcja ----------
  let targetRX = 0;
  let targetRY = 0;
  const onPointer = (e) => {
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    targetRY = nx * 0.34;
    targetRX = ny * 0.16;
  };
  if (!prefersReduced) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }

  const resize = () => layout();
  window.addEventListener('resize', resize);

  // ---------- animacja ----------
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  let rafId = 0;
  let running = true;

  let userPaused = false;

  const ready = (async () => {
    if (!modelConfig) throw new Error(`Brak aktualnego modelu HERO dla marki ${brandName}`);

    const gltf = await new GLTFLoader().loadAsync(modelConfig.path);
    const model = gltf.scene;
    const whiteShellMaterial = new MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3
    });

    model.rotation.y = modelConfig.rotationY;
    const initialBox = new Box3().setFromObject(model);
    const size = initialBox.getSize(new Vector3());
    const modelScale = size.x > 0 ? 4.7 / size.x : 1;
    model.scale.setScalar(modelScale);
    model.updateMatrixWorld(true);

    const normalizedBox = new Box3().setFromObject(model);
    const center = normalizedBox.getCenter(new Vector3());
    model.position.sub(center);
    model.updateMatrixWorld(true);

    model.traverse((object) => {
      if (!object.isMesh) return;
      if (brandName === 'GREE' && object.material?.name === 'Spray') {
        object.material = whiteShellMaterial;
      }
      if (brandName === 'KAISAI' && object.material) {
        object.material = object.material.clone();
        object.material.metalness = 0;
        object.material.roughness = 0.58;
        object.material.envMapIntensity = 0.2;
      }
      object.castShadow = false;
      object.receiveShadow = false;
    });

    loadedModel = model;
    unit.add(model);

    if (brandName === 'KAISAI') {
      const logoTexture = await new TextureLoader().loadAsync('/modele3d/kaisai-logo.png');
      logoTexture.colorSpace = SRGBColorSpace;
      const logo = new Mesh(
        new PlaneGeometry(0.43, 0.108),
        new MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          depthWrite: false,
          toneMapped: false
        })
      );
      logo.position.set(0, -0.365, 0.613);
      logo.renderOrder = 1;
      unit.add(logo);
    }

    layout();
    introStartedAt = performance.now();
    modelLoaded = true;

    if (prefersReduced) {
      beam.material.opacity = 0.1;
      updateStreams(0, 0.8);
      unit.rotation.set(comp.rotX, comp.rotY, 0);
      unit.position.set(comp.unitX, comp.unitY, 0);
      camera.position.set(0, comp.camY, comp.camZ);
    } else {
      beam.material.opacity = 0;
      updateStreams(0, 0);
      unit.rotation.set(comp.rotX, comp.rotY - 0.25, 0);
      unit.position.set(comp.unitX, comp.unitY, 0);
      camera.position.set(2.2, comp.camY + 1.4, comp.camZ + 4);
    }
    camera.lookAt(comp.lookX, comp.camY, 0);
    renderer.render(scene, camera);
  })();

  // Pauza renderu, gdy hero poza ekranem
  const io = new IntersectionObserver((entries) => {
    running = entries[0].isIntersecting;
    if (running && !prefersReduced && !userPaused) {
      requestTick();
    }
  });
  io.observe(stage);

  function requestTick() {
    if (!rafId && !prefersReduced && running && !userPaused) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick() {
    rafId = 0;
    if (!running || userPaused) return;
    if (!modelLoaded) {
      requestTick();
      return;
    }
    const t = (performance.now() - introStartedAt) / 1000;

    // intro: 0-2.2 s — kamera dolatuje, jednostka obraca się do pozycji
    const intro = easeOut(Math.min(t / 2.2, 1));
    const spin = (1 - intro) * -0.25;

    camera.position.set(
      (1 - intro) * 2.2,
      comp.camY + (1 - intro) * 1.4,
      comp.camZ + (1 - intro) * 4.0
    );
    camera.lookAt(comp.lookX, comp.camY, 0);

    // Urządzenie pozostaje zwrócone frontem do użytkownika. Ograniczenie
    // obejmuje intro, parallax kursora i delikatny ruch spoczynkowy.
    unit.rotation.y = MathUtils.clamp(
      comp.rotY + spin + targetRY * intro + Math.sin(t * 0.4) * 0.035,
      -0.58,
      0.38
    );
    unit.rotation.x = MathUtils.clamp(
      comp.rotX + targetRX * intro + Math.cos(t * 0.55) * 0.02,
      -0.18,
      0.18
    );
    unit.position.x = comp.unitX;
    unit.position.y = comp.unitY + Math.sin(t * 0.8) * 0.02;

    // Nawiew uruchamia się po dolocie kamery (1.6-2.6 s).
    const open = easeOut(Math.min(Math.max((t - 1.6) / 1.0, 0), 1));
    glow.intensity = 10 + open * 6 + Math.sin(t * 1.8) * 2;

    // strumień powietrza: stożek pulsuje, faliste wstęgi płyną z wylotu
    beam.material.opacity = open * (0.12 + Math.sin(t * 1.9) * 0.03);
    updateStreams(t, open);

    renderer.render(scene, camera);
    requestTick();
  }

  requestTick();

  // Trafianie w samą jednostkę, żeby kliknięcie w puste tło hero nic nie robiło.
  const raycaster = new Raycaster();
  const pointerNdc = new Vector2();

  return {
    ready,
    hitTest(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!loadedModel || !rect.width || !rect.height) return false;

      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);

      return raycaster.intersectObject(loadedModel, true).length > 0;
    },
    setPaused(paused) {
      userPaused = paused;
      if (!paused) requestTick();
    },
    dispose() {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('load', layout);
      window.removeEventListener('pointermove', onPointer);
      renderer.dispose();
    }
  };
}
