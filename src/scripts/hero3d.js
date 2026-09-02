/*
  Scena 3D hero: proceduralny klimatyzator split (jednostka ścienna),
  intro kamery, otwierająca się żaluzja, strumień chłodnego powietrza
  (cząsteczki), delikatny parallax za kursorem.
  Ładowana dynamicznie tylko na stronie głównej; przy prefers-reduced-motion
  renderuje pojedynczą klatkę bez animacji.
*/
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Raycaster,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer
} from 'three';

const BG = 0x0d1117;

function roundedBox(w, h, d, r) {
  const shape = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3,
    curveSegments: 10
  });
  geo.translate(0, 0, -d / 2);
  return geo;
}

function labelTexture(text, { size = 64, color = '#9aa3ad', weight = 600, tracking = 8 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (tracking > 0) {
    const chars = text.split('');
    const widths = chars.map((c) => ctx.measureText(c).width + tracking);
    const total = widths.reduce((a, b) => a + b, 0) - tracking;
    let cx = (canvas.width - total) / 2;
    chars.forEach((c, i) => {
      ctx.fillText(c, cx + (widths[i] - tracking) / 2, canvas.height / 2);
      cx += widths[i];
    });
  } else {
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

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

  // Przezroczysta kanwa: tło daje CSS sekcji, a POD kanwą prześwituje
  // "szklany" napis FRIGAC (.hero-ghost).
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(BG, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  stage.appendChild(renderer.domElement);

  const scene = new Scene();

  const camera = new PerspectiveCamera(34, 1, 0.1, 60);

  // ---------- światła ----------
  scene.add(new AmbientLight(0xffffff, 0.55));

  const key = new DirectionalLight(0xffffff, 3.6);
  key.position.set(3, 5, 6);
  scene.add(key);

  const rim = new DirectionalLight(0x56b7ff, 1.7);
  rim.position.set(-6, 2, -4);
  scene.add(rim);

  const fill = new DirectionalLight(0xd4e4f7, 0.9);
  fill.position.set(-2, -3, 5);
  scene.add(fill);

  const glow = new PointLight(0x2f9dff, 14, 18, 2);
  glow.position.set(0, -2.4, 1.6);
  scene.add(glow);

  // ---------- jednostka ----------
  const unit = new Group();

  const bodyMat = new MeshPhysicalMaterial({
    color: 0xf9fbfd,
    roughness: 0.3,
    metalness: 0.04,
    clearcoat: 0.6,
    clearcoatRoughness: 0.35
  });

  const body = new Mesh(roundedBox(4.6, 1.5, 1.0, 0.34), bodyMat);
  unit.add(body);

  // zaokrąglony front (panel)
  const panel = new Mesh(roundedBox(4.44, 1.34, 0.16, 0.3), bodyMat.clone());
  panel.material.color.set(0xffffff);
  panel.position.z = 0.52;
  unit.add(panel);

  // szczelina wylotu powietrza
  const ventMat = new MeshStandardMaterial({ color: 0x2a3038, roughness: 0.7, metalness: 0.1 });
  const vent = new Mesh(roundedBox(3.9, 0.24, 0.1, 0.1), ventMat);
  vent.position.set(0, -0.56, 0.58);
  unit.add(vent);

  // żaluzja — otwiera się w intro
  const louver = new Mesh(roundedBox(3.86, 0.2, 0.05, 0.08), bodyMat.clone());
  louver.position.set(0, -0.56, 0.62);
  louver.geometry.translate(0, 0.1, 0);
  unit.add(louver);

  // pasek LED + wyświetlacz temperatury
  const ledMat = new MeshBasicMaterial({ color: 0x56b7ff });
  const led = new Mesh(roundedBox(0.5, 0.05, 0.02, 0.02), ledMat);
  led.position.set(-1.7, 0.42, 0.62);
  unit.add(led);

  const tempTex = labelTexture('21°', { size: 78, color: '#56b7ff', weight: 600, tracking: 0 });
  const temp = new Mesh(
    new PlaneGeometry(0.9, 0.225),
    new MeshBasicMaterial({ map: tempTex, transparent: true })
  );
  temp.position.set(1.55, 0.42, 0.625);
  unit.add(temp);

  const brandTex = labelTexture(brand, { size: 60, color: '#9aa7b3', weight: 700, tracking: 16 });
  const brandLabel = new Mesh(
    new PlaneGeometry(1.5, 0.375),
    new MeshBasicMaterial({ map: brandTex, transparent: true, opacity: 0.95 })
  );
  brandLabel.position.set(0, -0.18, 0.625);
  unit.add(brandLabel);

  scene.add(unit);

  // ---------- strumień powietrza: świetlny stożek + miękkie kłęby mgły ----------
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
  beam.position.set(0, -0.62, 0.62);
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
        // fala wędrująca w dół strumienia + poszerzanie się nawiewu
        const wave = Math.sin(u * 7.5 - t * def.speed + def.phase) * def.amp * (0.25 + u);
        const px = def.x0 + def.drift * u + wave;
        const py = -0.66 - 2.7 * u * u + Math.sin(u * 11 - t * def.speed * 1.35 + def.phase) * 0.04;
        const pz = 0.62 + 2.3 * u;
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
  // Poniżej 900 px jednostka schodzi POD tekst (układ pionowy).
  // Od 900 px w górę pozycja i skala są liczone z realnej szerokości kolumny
  // tekstu (.hero-inner), tak aby model NIGDY nie nachodził na tekst i
  // zawsze miał zapas co najmniej GAP_PX.
  const GAP_PX = 44;
  const UNIT_EFFECTIVE_W = 5.2; // szerokość jednostki w świecie, z zapasem na obrót
  let comp = { unitX: 2.6, unitY: 0.35, rotY: -0.38, camY: 0.1, camZ: 8.6, lookX: 0, scale: 0.88 };

  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;

    if (w < 900) {
      comp = { unitX: 0, unitY: -2.45, rotY: -0.15, camY: -0.5, camZ: 11.5, lookX: 0, scale: 0.62 };
    } else {
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

      comp = { unitX, unitY: 0.35, rotY: -0.38, camY, camZ, lookX: 0, scale };
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
    targetRY = nx * 0.16;
    targetRX = ny * 0.08;
  };
  if (!prefersReduced) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }

  const resize = () => layout();
  window.addEventListener('resize', resize);

  // ---------- animacja ----------
  const t0 = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  let rafId = 0;
  let running = true;

  let userPaused = false;

  // Pauza renderu, gdy hero poza ekranem
  const io = new IntersectionObserver((entries) => {
    running = entries[0].isIntersecting;
    if (running && !prefersReduced && !userPaused) {
      rafId = requestAnimationFrame(tick);
    }
  });
  io.observe(stage);

  function tick() {
    if (!running || userPaused) return;
    const t = (performance.now() - t0) / 1000;

    // intro: 0-2.2 s — kamera dolatuje, jednostka obraca się do pozycji
    const intro = easeOut(Math.min(t / 2.2, 1));
    const spin = (1 - intro) * -1.3;

    camera.position.set(
      (1 - intro) * 2.2,
      comp.camY + (1 - intro) * 1.4,
      comp.camZ + (1 - intro) * 4.0
    );
    camera.lookAt(comp.lookX, comp.camY, 0);

    unit.rotation.y = comp.rotY + spin + targetRY * intro + Math.sin(t * 0.4) * 0.02;
    unit.rotation.x = targetRX * intro + Math.cos(t * 0.55) * 0.012;
    unit.position.x = comp.unitX;
    unit.position.y = comp.unitY + Math.sin(t * 0.8) * 0.02;

    // żaluzja otwiera się po dolocie kamery (1.6-2.6 s)
    const open = easeOut(Math.min(Math.max((t - 1.6) / 1.0, 0), 1));
    louver.rotation.x = open * 0.9;

    // puls LED
    led.material.color.setHSL(0.58, 1, 0.6 + Math.sin(t * 2.2) * 0.12);
    glow.intensity = 10 + open * 6 + Math.sin(t * 1.8) * 2;

    // strumień powietrza: stożek pulsuje, faliste wstęgi płyną z wylotu
    beam.material.opacity = open * (0.12 + Math.sin(t * 1.9) * 0.03);
    updateStreams(t, open);

    renderer.render(scene, camera);
    if (!prefersReduced) {
      rafId = requestAnimationFrame(tick);
    }
  }

  if (prefersReduced) {
    // pojedyncza, gotowa klatka: żaluzja otwarta, bez ruchu
    louver.rotation.x = 0.9;
    beam.material.opacity = 0.1;
    updateStreams(0, 0.8);
    unit.rotation.y = comp.rotY;
    unit.position.set(comp.unitX, comp.unitY, 0);
    camera.position.set(0, comp.camY, comp.camZ);
    camera.lookAt(comp.lookX, comp.camY, 0);
    renderer.render(scene, camera);
  } else {
    rafId = requestAnimationFrame(tick);
  }

  // Trafianie w samą jednostkę, żeby kliknięcie w puste tło hero nic nie robiło.
  const raycaster = new Raycaster();
  const pointerNdc = new Vector2();

  return {
    hitTest(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;

      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);

      return raycaster.intersectObject(unit, true).length > 0;
    },
    setPaused(paused) {
      userPaused = paused;
      if (!paused && running && !prefersReduced) {
        rafId = requestAnimationFrame(tick);
      }
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
