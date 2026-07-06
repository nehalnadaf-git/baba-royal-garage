"use client";

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
  type OGLRenderingContext,
} from "ogl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */
export interface GalleryItem {
  image: string;
  text: string;
  /** width ÷ height of the source image; drives card aspect ratio. Defaults to 4/3. */
  aspectRatio?: number;
}

interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: GalleryItem[];
  bend?: number;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
  fontClassName?: string;
  /** Called when the user taps / clicks a gallery card. */
  onImageClick?: (item: GalleryItem) => void;
}

/* ── OGL Helper Utilities ───────────────────────────────────────────── */
function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function createTextTexture(
  gl: OGLRenderingContext,
  text: string,
  font: string,
  color: string
) {
  const canvas  = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font  = font;
  const metrics    = context.measureText(text);
  const textWidth  = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width  = textWidth  + 20;
  canvas.height = textHeight + 20;
  context.font         = font;
  context.fillStyle    = color;
  context.textBaseline = "middle";
  context.textAlign    = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

/* ── OGL Classes ────────────────────────────────────────────────────── */
class Title {
  gl: OGLRenderingContext;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({
    gl, plane, renderer, text, textColor, font,
  }: {
    gl: OGLRenderingContext; plane: Mesh; renderer: Renderer;
    text: string; textColor: string; font: string;
  }) {
    this.gl = gl; this.plane = plane; this.renderer = renderer;
    this.text = text; this.textColor = textColor; this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl, this.text, this.font, this.textColor
    );
    const geometry = new Plane(this.gl);
    const program  = new Program(this.gl, {
      vertex: `
        attribute vec3 position; attribute vec2 uv;
        uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragment: `
        precision highp float; uniform sampler2D tMap; varying vec2 vUv;
        void main() { vec4 color = texture2D(tMap,vUv); if (color.a < 0.1) discard; gl_FragColor = color; }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect     = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth  = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  gl: OGLRenderingContext;
  geometry: Plane;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  extra: number     = 0;
  widthTotal: number = 0;
  width: number     = 0;
  x: number         = 0;
  scale: number     = 1;
  padding: number   = 2;
  speed: number     = 0;
  isBefore: boolean = false;
  isAfter:  boolean = false;
  aspectRatio: number = 4 / 3;

  constructor({
    geometry, gl, image, index, length, renderer, scene,
    screen, text, viewport, bend, textColor, borderRadius = 0, font, aspectRatio = 4 / 3,
  }: {
    geometry: Plane; gl: OGLRenderingContext; image: string;
    index: number; length: number; renderer: Renderer; scene: Transform;
    screen: { width: number; height: number }; text: string;
    viewport: { width: number; height: number }; bend: number;
    textColor: string; borderRadius: number; font: string;
    aspectRatio?: number;
  }) {
    this.geometry = geometry; this.gl = gl; this.image = image;
    this.index = index; this.length = length; this.renderer = renderer;
    this.scene = scene; this.screen = screen; this.text = text;
    this.viewport = viewport; this.bend = bend; this.textColor = textColor;
    this.borderRadius = borderRadius; this.font = font;
    this.aspectRatio = aspectRatio;
    this.createShader(); this.createMesh(); this.createTitle(); this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program  = new Program(this.gl, {
      depthTest: false, depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position; attribute vec2 uv;
        uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
        uniform float uTime; uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv; vec3 p = position;
          p.z = 0.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes; uniform vec2 uPlaneSizes;
        uniform sampler2D tMap; uniform float uBorderRadius;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p)-b; return length(max(d,vec2(0.0)))+min(max(d.x,d.y),0.0)-r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.0),
            min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.0)
          );
          vec2 uv = vec2(vUv.x*ratio.x+(1.0-ratio.x)*0.5, vUv.y*ratio.y+(1.0-ratio.y)*0.5);
          vec4 color = texture2D(tMap,uv);
          float d = roundedBoxSDF(vUv-0.5, vec2(0.5-uBorderRadius), uBorderRadius);
          float alpha = 1.0-smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap:          { value: texture },
        uPlaneSizes:   { value: [0, 0] },
        uImageSizes:   { value: [0, 0] },
        uSpeed:        { value: 0 },
        uTime:         { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl, plane: this.plane, renderer: this.renderer,
      text: this.text, textColor: this.textColor, font: this.font,
    });
  }

  update(scroll: { current: number; last: number }, direction: "left" | "right") {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;
    if (this.bend === 0) {
      this.plane.position.y = 0; this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R     = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effX  = Math.min(Math.abs(x), H);
      const arc   = R - Math.sqrt(R * R - effX * effX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z =  Math.sign(x) * Math.asin(effX / R);
      }
    }
    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value  += 0.04;
    this.program.uniforms.uSpeed.value  = this.speed;
    const planeOffset    = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter  = this.plane.position.x - planeOffset >  viewportOffset;
    if (direction === "right" && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false; }
    if (direction === "left"  && this.isAfter)  { this.extra += this.widthTotal; this.isBefore = this.isAfter = false; }
  }

  onResize(
    { screen, viewport }: {
      screen?: { width: number; height: number };
      viewport?: { width: number; height: number };
    } = {}
  ) {
    if (screen)   this.screen   = screen;
    if (viewport) this.viewport = viewport;

    this.scale = this.screen.height / 1500;

    /* ── Fixed-width card sizing — works for any future aspect ratio ────
     *
     * All cards share the SAME planeW.  planeH = planeW / aspectRatio.
     *
     *   Landscape (AR>1, e.g. 4:3, 16:9) → short,  wide card
     *   Portrait  (AR<1, e.g. 3:4, 9:16) → tall, narrow card
     *
     * Because planeW is identical for every card, card.width = planeW +
     * padding is also identical — no gaps or overlaps regardless of how
     * many different aspect ratios the gallery contains.
     *
     * Coefficient 600 keeps desktop landscape cards at ≈6.6 OGL units,
     * allowing 2+ cards to be visible simultaneously in the gallery window.
     *
     * Desktop (1440×900, OGL w=26.5):
     *   refW = 6.63 OGL  → card.width≈8.75 → 3.0 cards in viewport ✓
     *   Landscape AR=1.33 → planeH=4.97 (no cap) ✓
     *   Portrait  AR=0.75 → planeH=8.84 (no cap) ✓
     * Mobile (390×844, OGL w=7.65):
     *   refW capped to 3.37 OGL → card.width≈3.98 → 1.9 cards ✓
     *   Landscape → planeH=2.53 ✓   Portrait → planeH=4.49 ✓          */
    const refW     = (this.viewport.width * (600 * this.scale)) / this.screen.width;
    const maxCardW = this.viewport.width * 0.44;   // never wider than 44 % vw
    let planeW     = Math.min(refW, maxCardW);
    let planeH     = planeW / this.aspectRatio;

    // Height cap: portrait cards must not overflow the container
    const maxCardH = this.viewport.height * 0.72;
    if (planeH > maxCardH) {
      const r = maxCardH / planeH;
      planeH  = maxCardH;
      planeW *= r;                    // narrow card slightly to preserve AR
    }

    this.plane.scale.y = planeH;
    this.plane.scale.x = planeW;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    /* Scale padding proportionally to viewport width.
     * Desktop: 0.08 × 26.5 ≈ 2.1  Mobile: 0.08 × 7.65 ≈ 0.6 */
    this.padding    = Math.max(0.4, this.viewport.width * 0.08);
    this.width      = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x          = this.width * this.index;
  }
}

/* ─────────────────────────────────────────────────────────────────────
 * App — Hybrid auto + manual sliding
 *
 * Behaviour:
 *  • Auto-slides slowly and continuously when the user is idle.
 *  • Drag (mouse / touch) gives direct positional control.
 *  • Releasing a drag applies momentum (fling) in the drag direction.
 *  • Wheel scroll adds a burst that decays with friction.
 *  • After RESUME_DELAY ms of no interaction auto-slide resumes
 *    seamlessly from wherever the scroll stopped.
 * ───────────────────────────────────────────────────────────────────── */
class App {
  container:    HTMLElement;
  autoSpeed:    number;   /* units/frame — slow ambient drift */
  scrollSpeed:  number;   /* multiplier for manual input */
  scroll:       { ease: number; current: number; target: number; last: number };

  /* drag / tap state */
  isDown:          boolean = false;
  dragStart:       number  = 0;
  dragStartTarget: number  = 0;
  lastDragX:       number  = 0;
  velocity:        number  = 0;   /* px/frame at release */
  wheelMomentum:   number  = 0;   /* residual wheel velocity */
  clickStartX:     number  = 0;
  clickStartY:     number  = 0;
  onImageClick?:   (item: GalleryItem) => void;

  /* auto-slide state */
  isUserActive: boolean = false;
  resumeTimer:  ReturnType<typeof setTimeout> | null = null;
  static readonly RESUME_DELAY = 2000; /* ms */

  /**
   * isPaused — when true the rAF render loop is suspended.
   * Set to true by visibilitychange (tab hidden) and IntersectionObserver
   * (gallery scrolled off-screen). This prevents the 60fps WebGL loop
   * from burning CPU/GPU while the user reads other sections.
   */
  isPaused: boolean = false;

  renderer!:      Renderer;
  gl!:            OGLRenderingContext;
  camera!:        Camera;
  scene!:         Transform;
  planeGeometry!: Plane;
  mediasImages!:  GalleryItem[];
  medias!:        Media[];
  screen!:        { width: number; height: number };
  viewport!:      { width: number; height: number };
  raf!:           number;

  /* bound handlers (kept for clean removal) */
  boundOnResize!:           () => void;
  boundOnTouchDown!:        (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!:        (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!:          (e: MouseEvent | TouchEvent) => void;
  boundOnVisibilityChange!: () => void;
  intersectionObserver!:    IntersectionObserver;

  constructor(
    container: HTMLElement,
    { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, onImageClick }: {
      items?: GalleryItem[]; bend: number; textColor: string;
      borderRadius: number; font: string; scrollSpeed: number; scrollEase: number;
      onImageClick?: (item: GalleryItem) => void;
    }
  ) {
    this.onImageClick = onImageClick;
    this.container   = container;
    this.autoSpeed   = scrollSpeed * 0.012; /* dreamy slow drift */
    this.scrollSpeed = scrollSpeed;
    this.scroll      = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    /* ── Viewport-relative bend ──────────────────────────────────────────
     * The arc formula: R = (H² + B²) / (2B), where H = viewport.width/2.
     * Rotation per card = Math.asin(effX / R).
     *
     * On mobile H is much smaller than desktop, making R tiny and producing
     * huge rotation angles (55°+) even for slightly off-center cards.
     *
     * Fix: scale B so R/H stays constant across all screen sizes.
     * If B = k·H then R = H·(1+k²)/(2k) → R/H is constant → same angles.
     *
     * We pick REFERENCE_HALF_W = the typical desktop OGL half-viewport-width.
     * Camera: fov=45°, z=20 → ogl_height = 2·tan(22.5°)·20 ≈ 16.57
     * At 1440×900 (aspect 1.6): ogl_width = 16.57·1.6 = 26.5 → H ≈ 13.25
     *
     * With REFERENCE_HALF_W=13:
     *   Desktop (H≈13): scaledBend = 2·(13/13) = 2.0  → R≈39 → rot≈18°
     *   iPhone14 (H≈3.8): scaledBend = 2·(3.8/13) = 0.58 → R≈12.7 → rot≈17°
     * Rotation angles match on every device. */
    const REFERENCE_HALF_W = 13.0;
    const scaledBend = bend * (this.viewport.width / 2) / REFERENCE_HALF_W;
    this.createMedias(items, scaledBend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  /* ── Setup ─────────────────────────────────────────────────────────── */

  createRenderer() {
    /* Disable antialiasing on touch/mobile devices.
     * antialias:true allocates a multi-sample buffer that uses ~4× more GPU
     * memory per context. Safari on iPhone 8/SE/older iPads enforces a hard
     * limit of ~8 concurrent WebGL contexts — exceeding it silently returns
     * null and the canvas goes blank. Mobile screens are also high-DPI enough
     * that the visual difference vs no-antialias is imperceptible. */
    const isMobile = typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    try {
      this.renderer = new Renderer({
        alpha:     true,
        antialias: !isMobile,
        dpr:       Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2),
      });
      this.gl = this.renderer.gl;
      this.gl.clearColor(0, 0, 0, 0);
      this.container.appendChild(this.gl.canvas);
    } catch (err) {
      /* WebGL context creation failed — re-throw so the useEffect
       * try/catch can catch it and keep the page functional. */
      throw err;
    }
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene()    { this.scene = new Transform(); }
  createGeometry() {
    /* Reduce geometry on touch/mobile devices.
     * Full desktop: 50×100 = 5000 triangles per card → great curve quality.
     * Mobile:        20×40  =  800 triangles per card → same visual result
     * at smaller physical sizes; saves ~80 % GPU vertex work per card.
     * The bend curve is barely perceptible at these resolutions anyway. */
    const isMobile = typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: isMobile ? 20 : 50,
      widthSegments:  isMobile ? 40 : 100,
    });
  }

  createMedias(
    items: GalleryItem[] | undefined,
    bend: number, textColor: string, borderRadius: number, font: string
  ) {
    const defaultItems: GalleryItem[] = [
      { image: "https://picsum.photos/seed/1/800/600", text: "Workshop" },
      { image: "https://picsum.photos/seed/2/800/600", text: "Service"  },
      { image: "https://picsum.photos/seed/3/800/600", text: "Gallery"  },
    ];
    const galleryItems   = items && items.length > 0 ? items : defaultItems;
    this.mediasImages    = [...galleryItems, ...galleryItems];
    this.medias          = this.mediasImages.map((data, index) => new Media({
      geometry: this.planeGeometry, gl: this.gl, image: data.image, index,
      length: this.mediasImages.length, renderer: this.renderer, scene: this.scene,
      screen: this.screen, text: data.text, viewport: this.viewport,
      bend, textColor, borderRadius, font,
      aspectRatio: data.aspectRatio ?? (4 / 3),
    }));
    /* Fix positions now that all card widths are known. */
    this.updateCumulativePositions();
  }

  /**
   * updateCumulativePositions
   *
   * Because cards can have different widths (landscape vs portrait), the
   * simple formula  x = index × ownWidth  breaks: each card uses its own
   * width as a spacing unit, causing overlaps and gaps.
   *
   * This pass replaces that with proper cumulative positions:
   *   card[0].x = 0
   *   card[1].x = card[0].width
   *   card[2].x = card[0].width + card[1].width   ... etc.
   *
   * widthTotal (used for infinite-scroll wrapping) is set to the SUM of
   * ALL 2N cards so every card wraps by exactly the same distance.
   */
  private updateCumulativePositions() {
    if (!this.medias || this.medias.length === 0) return;
    const totalW = this.medias.reduce((sum, m) => sum + m.width, 0);
    let cumulX = 0;
    this.medias.forEach(m => {
      m.x         = cumulX;
      m.widthTotal = totalW;
      cumulX      += m.width;
    });
  }

  /* ── Interaction state helpers ─────────────────────────────────────── */

  private activateUser() {
    this.isUserActive = true;
    if (this.resumeTimer !== null) { clearTimeout(this.resumeTimer); this.resumeTimer = null; }
  }

  private scheduleResume() {
    if (this.resumeTimer !== null) clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => { this.isUserActive = false; }, App.RESUME_DELAY);
  }

  /* ── Event handlers ────────────────────────────────────────────────── */

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.activateUser();
    this.isDown          = true;
    this.wheelMomentum   = 0;         /* cancel any wheel drift */
    const clientX        = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY        = "touches" in e ? e.touches[0].clientY : e.clientY;
    this.dragStart       = clientX;
    this.clickStartX     = clientX;
    this.clickStartY     = clientY;
    this.dragStartTarget = this.scroll.target;
    this.lastDragX       = clientX;
    this.velocity        = 0;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const clientX      = "touches" in e ? e.touches[0].clientX : e.clientX;
    const delta        = (this.dragStart - clientX) * (this.scrollSpeed * 0.025);
    this.velocity      = clientX - this.lastDragX;   /* signed px/frame */
    this.lastDragX     = clientX;
    this.scroll.target = this.dragStartTarget + delta;
  }

  onTouchUp(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    this.isDown = false;

    /* ── Tap detection: if X travel < 8 px it was a tap, not a drag ── */
    const endX   = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const deltaX = Math.abs(endX - this.clickStartX);
    if (deltaX < 8 && this.onImageClick) {
      const hit = this.hitTest(this.clickStartX, this.clickStartY);
      if (hit) this.onImageClick(hit);
    }

    /* Fling: apply drag momentum to target */
    this.scroll.target -= this.velocity * (this.scrollSpeed * 0.15);
    /* Resume auto-slide immediately */
    this.isUserActive = false;
    if (this.resumeTimer !== null) { clearTimeout(this.resumeTimer); this.resumeTimer = null; }
  }

  /**
   * hitTest — pixel-space AABB check against every card.
   *
   * OGL origin is at center of canvas; Y axis is UP (opposite to CSS).
   * Converts click coordinates (CSS pixels, top-left origin) to OGL
   * units, then checks each plane's bounding box.
   *
   * Because the arc vertex shader only bends the plane in the Z axis,
   * the XY footprint in OGL space is still a flat rectangle — so the
   * AABB test is accurate enough for a click target.
   */
  private hitTest(startX: number, startY: number): GalleryItem | null {
    const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
    const rect   = canvas.getBoundingClientRect();

    /* CSS-pixel offset within the canvas */
    const canvasX = startX - rect.left;
    const canvasY = startY - rect.top;

    /* 1 OGL unit = (screen.width / viewport.width) CSS pixels */
    const ratio   = this.screen.width / this.viewport.width;

    /* Convert to OGL space: origin at centre, Y flipped */
    const oglX = (canvasX - this.screen.width  / 2) / ratio;
    const oglY = -(canvasY - this.screen.height / 2) / ratio;

    for (const media of this.medias) {
      const mx = media.plane.position.x;
      const my = media.plane.position.y;
      const hw = media.plane.scale.x / 2;
      const hh = media.plane.scale.y / 2;

      if (oglX >= mx - hw && oglX <= mx + hw && oglY >= my - hh && oglY <= my + hh) {
        /* mediasImages is doubled; map back to the original item */
        const originalLen = this.mediasImages.length / 2;
        return this.mediasImages[media.index % originalLen];
      }
    }
    return null;
  }

  /* ── Core loop ─────────────────────────────────────────────────────── */

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov    = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width  = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(m => m.onResize({ screen: this.screen, viewport: this.viewport }));
      /* Re-run cumulative positions after every resize: card widths change
       * on orientation changes / window resize, so positions must follow. */
      this.updateCumulativePositions();
    }
  }

  /* ── Pause / Resume ────────────────────────────────────────────── */

  pause() {
    if (this.isPaused) return;
    this.isPaused = true;
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  update() {
    /* 1. Auto-slide when user is idle */
    if (!this.isUserActive) {
      this.scroll.target += this.autoSpeed;
    }

    /* 2. Lerp current toward target */
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) this.medias.forEach(m => m.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    /* Only schedule next frame if not paused — this allows the loop to
     * be suspended by visibilitychange / IntersectionObserver. */
    if (!this.isPaused) {
      this.raf = window.requestAnimationFrame(this.update.bind(this));
    }
  }

  /* ── Lifecycle ─────────────────────────────────────────────────────── */

  addEventListeners() {
    this.boundOnResize    = this.onResize.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp   = this.onTouchUp.bind(this);

    window.addEventListener("resize",    this.boundOnResize);
    this.container.addEventListener("mousedown",  this.boundOnTouchDown as EventListener);
    window.addEventListener("mousemove", this.boundOnTouchMove as EventListener);
    window.addEventListener("mouseup",   this.boundOnTouchUp as EventListener);
    this.container.addEventListener("touchstart", this.boundOnTouchDown as EventListener, { passive: true });
    window.addEventListener("touchmove", this.boundOnTouchMove as EventListener, { passive: true });
    window.addEventListener("touchend",  this.boundOnTouchUp as EventListener);

    /* ── Pause rAF loop when tab is hidden (saves battery on iOS) ── */
    this.boundOnVisibilityChange = () => {
      if (document.hidden) this.pause();
      else this.resume();
    };
    document.addEventListener("visibilitychange", this.boundOnVisibilityChange);

    /* ── Pause rAF loop when gallery scrolls off-screen ───────────
     * rootMargin:"200px" means we resume 200px BEFORE the gallery
     * enters the viewport so textures / positions are ready.      */
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) this.resume();
        else this.pause();
      },
      { rootMargin: "200px" }
    );
    this.intersectionObserver.observe(this.container);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    if (this.resumeTimer !== null) clearTimeout(this.resumeTimer);
    window.removeEventListener("resize",    this.boundOnResize);
    this.container.removeEventListener("mousedown",  this.boundOnTouchDown as EventListener);
    window.removeEventListener("mousemove", this.boundOnTouchMove as EventListener);
    window.removeEventListener("mouseup",   this.boundOnTouchUp as EventListener);
    this.container.removeEventListener("touchstart", this.boundOnTouchDown as EventListener);
    window.removeEventListener("touchmove", this.boundOnTouchMove as EventListener);
    window.removeEventListener("touchend",  this.boundOnTouchUp as EventListener);
    document.removeEventListener("visibilitychange", this.boundOnVisibilityChange);
    this.intersectionObserver?.disconnect();
    if (this.renderer?.gl?.canvas?.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

/* ── React Component ────────────────────────────────────────────────── */
const CircularGallery = ({
  items,
  bend         = 3,
  borderRadius = 0.05,
  scrollSpeed  = 2,
  scrollEase   = 0.06,
  onImageClick,
  className,
  fontClassName,
  ...props
}: CircularGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    let app: App | null = null;
    let destroyed = false;

    /* Double-rAF: wait for two paint frames so the browser has finished
     * laying out sticky containers and clip-paths before OGL measures the
     * canvas dimensions. Without this, clientWidth/Height can be 0 or stale
     * on mobile, causing the viewport/bend calculation to produce extreme
     * rotation angles on first load (but not after a refresh). */
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        if (destroyed) return;

        const computedStyle = getComputedStyle(el);
        const color         = computedStyle.color      || "#ffffff";
        const weight        = computedStyle.fontWeight || "bold";
        const size          = computedStyle.fontSize   || "24px";
        const family        = computedStyle.fontFamily;
        const font          = `${weight} ${size} ${family}`;

        try {
          app = new App(el, {
            items, bend, textColor: color, borderRadius, font, scrollSpeed, scrollEase, onImageClick,
          });
        } catch (err) {
          /* WebGL initialisation failed (context limit, low GPU memory, etc.).
           * The gallery is hidden but the rest of the page stays functional. */
          console.warn("[CircularGallery] WebGL init failed — gallery disabled:", err);
        }
      });

      return () => cancelAnimationFrame(raf2);
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf1);
      app?.destroy();
    };
  }, [items, bend, borderRadius, scrollSpeed, scrollEase, fontClassName, onImageClick]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden cursor-grab active:cursor-grabbing",
        "text-white font-bold text-[24px]",
        fontClassName,
        className,
      )}
      {...props}
    />
  );
};

export { CircularGallery };