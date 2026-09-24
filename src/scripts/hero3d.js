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

function streamTexture(isMobile = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  // jasność wzdłuż wstęgi: rodzi się przy wylocie, wygasa na końcu
  const h = ctx.createLinearGradient(0, 0, 256, 0);
  h.addColorStop(0, 'rgba(255,255,255,0)');
  if (isMobile) {
    // Najjaśniejsza część poza obudową; wygaszenie dopiero przy końcu.
    h.addColorStop(0.15, 'rgba(255,255,255,0.55)');
    h.addColorStop(0.38, 'rgba(255,255,255,0.95)');
    h.addColorStop(0.7, 'rgba(255,255,255,0.85)');
    h.addColorStop(0.87, 'rgba(255,255,255,0.4)');
  } else {
    h.addColorStop(0.15, 'rgba(255,255,255,0.9)');
    h.addColorStop(0.55, 'rgba(255,255,255,0.4)');
  }
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

function beamTexture(isMobile = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(128, 0, 10, 128, 0, 250);
  g.addColorStop(0, 'rgba(190,225,255,0.55)');
  g.addColorStop(0.5, isMobile ? 'rgba(175,220,255,0.36)' : 'rgba(150,205,255,0.18)');
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
  const initialMobile = stage.clientWidth < 900;

  // Przezroczysta kanwa: tło daje CSS sekcji, a POD kanwą prześwituje
  // "szklany" napis FRIGAC (.hero-ghost).
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(BG, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = isKaisai ? 1.05 : 1.35;
  stage.appendChild(renderer.domElement);

  const scene = new Scene();

  const camera = new PerspectiveCamera(34, 1, 0.1, 60);

  // ---------- światła ----------
  const ambient = new AmbientLight(0xffffff, isKaisai ? 0.8 : 1.05);
  const hemisphere = new HemisphereLight(0xffffff, 0x17212c, isKaisai ? 1 : 1.25);
  scene.add(ambient, hemisphere);

  const key = new DirectionalLight(0xffffff, isKaisai ? 3.6 : 4.4);
  key.position.set(3, 5, 6);
  scene.add(key);

  const rim = new DirectionalLight(0x8fd0ff, isKaisai ? 0.65 : 0.8);
  rim.position.set(-6, 2, -4);
  scene.add(rim);

  const fill = new DirectionalLight(0xf2f7ff, isKaisai ? 1.35 : 1.8);
  fill.position.set(-2, -3, 5);
  scene.add(fill);

  // Osobne światło od góry i od strony kamery wyrównuje jasność górnej
  // powierzchni na mobile. Na desktopie pozostaje wyłączone.
  const mobileTopFill = new DirectionalLight(0xffffff, 0);
  mobileTopFill.position.set(0, 8, 2);
  scene.add(mobileTopFill);

  function applyLightingProfile(isMobile) {
    if (!isMobile) {
      renderer.toneMappingExposure = isKaisai ? 1.05 : 1.35;
      ambient.intensity = isKaisai ? 0.8 : 1.05;
      hemisphere.intensity = isKaisai ? 1 : 1.25;
      key.intensity = isKaisai ? 3.6 : 4.4;
      rim.intensity = isKaisai ? 0.65 : 0.8;
      fill.intensity = isKaisai ? 1.35 : 1.8;
      mobileTopFill.intensity = 0;
      return;
    }

    // Na mobile canvas znajduje się w węższym, ciemnym pasie HERO. Nieco
    // mocniejsze światło rozproszone przywraca naturalną biel bez przepaleń.
    renderer.toneMappingExposure = isKaisai ? 1.14 : 1.42;
    ambient.intensity = isKaisai ? 1 : 1.18;
    hemisphere.intensity = isKaisai ? 1.16 : 1.38;
    key.intensity = isKaisai ? 3.9 : 4.65;
    rim.intensity = isKaisai ? 0.72 : 0.85;
    fill.intensity = isKaisai ? 1.55 : 2;
    mobileTopFill.intensity = isKaisai ? 1.65 : 1.5;
  }

  const glow = new PointLight(0x2f9dff, 9, 18, 2);
  glow.position.set(0, -2.4, 1.6);
  scene.add(glow);

  // ---------- jednostka ----------
  const unit = new Group();
  scene.add(unit);
  let loadedModel = null;
  let modelLoaded = false;
  let introStartedAt = null;

  // Modele producentów są normalizowane do tej samej szerokości, dzięki czemu
  // zachowują wspólną responsywną kompozycję HERO.
  const modelConfig = brandName === 'GREE'
    ? { path: '/modele3d/pular_pro2.glb', rotationY: 0 }
    : brandName === 'KAISAI'
      ? {
          path: initialMobile
            ? '/modele3d/kaisai-mobile.glb'
            : '/modele3d/kaisai aktualne-to-3d-texture.glb',
          rotationY: Math.PI
        }
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
      map: beamTexture(initialMobile),
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
  // Na małym ekranie 28 segmentów zachowuje miękki kształt wstęg, a istotnie
  // ogranicza liczbę pozycji przeliczanych podczas każdej klatki.
  const SEG = initialMobile ? 28 : 44;
  const streamTex = streamTexture(initialMobile);
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
  let airflowBottomNdc = -1;
  const airflowProbe = new Vector3();

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
    if (isMobileLayout) {
      // Dopasuj koniec nawiewu do kapsuły także podczas obrotu urządzenia.
      // Pozycja kapsuły jest mierzona w layout(), bez odczytów DOM w animacji.
      camera.updateMatrixWorld();
      unit.updateMatrixWorld(true);
      let low = 0;
      let high = 1.8;
      for (let i = 0; i < 12; i++) {
        const length = (low + high) / 2;
        let bottom = 1;
        for (const x of [-2.3, 0, 2.3]) {
          airflowProbe.set(x, airProfile.outletY - 0.08 - 2.7 * length * length,
            airProfile.outletZ + 2.3 * length);
          airflowProbe.applyMatrix4(unit.matrixWorld).project(camera);
          bottom = Math.min(bottom, airflowProbe.y);
        }
        if (bottom >= airflowBottomNdc) low = length;
        else high = length;
      }
      airflowLength = low;
    }
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
      mesh.material.opacity = (isMobileLayout ? 0.65 : 0.26) * flow;
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
  let isMobileLayout = false;
  let stageDocumentTop = 0;
  let scrollTravel = 1;

  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const isMobile = w < 900;
    isMobileLayout = isMobile;
    // DPR 1.25 zachowuje czytelny produkt na małym ekranie, a zmniejsza
    // liczbę renderowanych pikseli o około 61% względem DPR 2.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    applyLightingProfile(isMobile);

    if (isMobile) {
      airflowLength = 0.48;
      beam.scale.y = airflowLength;
      const camZ = 11.5;
      const camY = -0.5;
      const worldH = 2 * camZ * Math.tan(((34 / 2) * Math.PI) / 180);
      const worldW = worldH * (w / h);
      const stageRect = stage.getBoundingClientRect();
      stageDocumentTop = stageRect.top + window.scrollY;
      scrollTravel = Math.max(h * 0.46, 1);
      const slotRect = document.querySelector('[data-hero-model-slot]')?.getBoundingClientRect();
      const chipRect = stage.closest('.hero')?.querySelector('.brand-chip-mobile')?.getBoundingClientRect();
      const airflowBottomPx = (chipRect?.top ?? slotRect?.bottom ?? stageRect.bottom) - stageRect.top - 14;
      airflowBottomNdc = 1 - (airflowBottomPx / h) * 2;
      const slotTop = slotRect ? slotRect.top - stageRect.top : h * 0.38;
      // Stała szerokość wizualna względem viewportu zachowuje obecną skalę
      // również na 320 px, mimo że HERO jest teraz wyższe.
      const scale = Math.min(0.62, (worldW * 0.9) / 4.7);
      const modelHalfPx = (0.9 * scale * h) / worldH;
      const centerPx = slotTop + modelHalfPx + 22;
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
  let scrollTargetX = 0;
  let scrollTargetY = 0;
  let scrollTargetZ = 0;
  let scrollRotationX = 0;
  let scrollRotationY = 0;
  let scrollRotationZ = 0;
  const onPointer = (e) => {
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    targetRY = nx * 0.34;
    targetRX = ny * 0.16;
  };

  const onScroll = () => {
    if (!isMobileLayout) {
      scrollTargetX = 0;
      scrollTargetY = 0;
      scrollTargetZ = 0;
      return;
    }

    // W czasie scrolla korzystamy z wartości zapisanych podczas layoutu.
    // Brak getBoundingClientRect() eliminuje wymuszane pomiary DOM.
    const progress = MathUtils.clamp((window.scrollY - stageDocumentTop + 60) / scrollTravel, 0, 1);
    // W układzie grupy jednostki oś Y daje wizualny ruch front → bok.
    // Pozostałe osie tylko wspierają wrażenie głębi.
    scrollTargetY = progress * 0.52;
    scrollTargetX = progress * 0.14;
    scrollTargetZ = progress * 0.018;
  };

  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }
  if (!prefersReduced) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const resize = () => {
    layout();
    onScroll();
  };
  window.addEventListener('resize', resize);

  // ---------- animacja ----------
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  let rafId = 0;
  let running = true;
  let lastRenderedAt = 0;

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
    if (prefersReduced) {
      beam.material.opacity = isMobileLayout ? 0.15 : 0.1;
      unit.rotation.set(comp.rotX, comp.rotY, 0);
      unit.position.set(comp.unitX, comp.unitY, 0);
      camera.position.set(0, comp.camY, comp.camZ);
    } else {
      beam.material.opacity = 0;
      unit.rotation.set(comp.rotX, comp.rotY - 0.25, 0);
      unit.position.set(comp.unitX, comp.unitY, 0);
      camera.position.set(2.2, comp.camY + 1.4, comp.camZ + 4);
    }
    camera.lookAt(comp.lookX, comp.camY, 0);
    updateStreams(0, prefersReduced ? 0.8 : 0);
    // Przygotuj shadery i pierwsze bufory/tekstury, gdy canvas jest jeszcze
    // ukryty. Koszt pierwszego renderu nie może zużywać czasu intro.
    await renderer.compileAsync(scene, camera);
    renderer.render(scene, camera);
    modelLoaded = true;
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

  function tick(now = performance.now()) {
    rafId = 0;
    if (!running || userPaused) return;
    if (!modelLoaded) {
      requestTick();
      return;
    }
    const isMobile = isMobileLayout;
    // Zegar startuje dopiero w pierwszej klatce gotowej, odsłoniętej sceny.
    if (introStartedAt === null) introStartedAt = now;
    const t = (now - introStartedAt) / 1000;
    // Dolot kamery i uruchomienie nawiewu korzystają z każdej klatki ekranu.
    // Limit oszczędzający GPU obowiązuje dopiero po całym intro. Zachowanie
    // reszty czasu zapobiega spadaniu do 20 FPS przy odświeżaniu 60 Hz.
    if (isMobile && t >= 2.6 && lastRenderedAt) {
      const interval = 1000 / 30;
      const elapsed = now - lastRenderedAt;
      if (elapsed < interval - 0.5) {
        requestTick();
        return;
      }
      lastRenderedAt = now - (Math.max(0, elapsed - interval) % interval);
    } else {
      lastRenderedAt = now;
    }
    scrollRotationY = MathUtils.lerp(scrollRotationY, isMobile ? scrollTargetY : 0, 0.13);
    scrollRotationX = MathUtils.lerp(scrollRotationX, isMobile ? scrollTargetX : 0, 0.11);
    scrollRotationZ = MathUtils.lerp(scrollRotationZ, isMobile ? scrollTargetZ : 0, 0.09);

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
      comp.rotY + spin + targetRY * intro + scrollRotationY * intro + Math.sin(t * 0.4) * 0.035,
      -0.58,
      isMobile ? 0.52 : 0.38
    );
    unit.rotation.x = MathUtils.clamp(
      comp.rotX + targetRX * intro + scrollRotationX * intro + Math.cos(t * 0.55) * 0.02,
      -0.18,
      isMobile ? 0.38 : 0.18
    );
    unit.rotation.z = MathUtils.clamp(scrollRotationZ * intro, -0.025, 0.025);
    unit.position.x = comp.unitX;
    unit.position.y = comp.unitY + Math.sin(t * 0.8) * 0.02;

    // Nawiew uruchamia się po dolocie kamery (1.6-2.6 s).
    const open = easeOut(Math.min(Math.max((t - 1.6) / 1.0, 0), 1));
    glow.intensity = 10 + open * 6 + Math.sin(t * 1.8) * 2;

    // strumień powietrza: stożek pulsuje, faliste wstęgi płyną z wylotu
    beam.material.opacity = open * (isMobile
      ? 0.18 + Math.sin(t * 1.9) * 0.04
      : 0.12 + Math.sin(t * 1.9) * 0.03);
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
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    }
  };
}
