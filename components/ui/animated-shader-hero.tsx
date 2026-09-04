"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/*  Locked component — supplied in hero_section.md.                           */
/*                                                                            */
/*  The WebGL engine below (WebGLRenderer, PointerHandler, shader, and the    */
/*  useShaderBackground hook) is integrated as supplied. The only changes     */
/*  are compatibility and integration adjustments, per the approved plan:      */
/*    - the canvas is sized to its container instead of the window, so the    */
/*      hero can sit inside a sectioned page rather than alone on a fullscreen */
/*      route;                                                                */
/*    - a missing WebGL context is handled instead of crashing, leaving the   */
/*      black background and the copy readable;                               */
/*    - prefers-reduced-motion renders a settled still instead of animating.  */
/*  The content overlay is restyled to the "Event Horizon" brand system       */
/*  (approved: "Adapt overlay to brand") — left-aligned copy, light serif     */
/*  headline in white, brand pill buttons.                                    */
/* -------------------------------------------------------------------------- */

// Types for component props
interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      href?: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      href?: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

// Reusable Shader Background Hook
const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const pointersRef = useRef<PointerHandler | null>(null);

  // WebGL Renderer class
  class WebGLRenderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram | null = null;
    private vs: WebGLShader | null = null;
    private fs: WebGLShader | null = null;
    private buffer: WebGLBuffer | null = null;
    private scale: number;
    private shaderSource: string;
    private mouseMove: [number, number] = [0, 0];
    private mouseCoords: [number, number] = [0, 0];
    private pointerCoords: [number, number] = [0, 0];
    private nbrOfPointers = 0;

    private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

    private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

    constructor(canvas: HTMLCanvasElement, scale: number) {
      this.canvas = canvas;
      this.scale = scale;
      this.gl = canvas.getContext('webgl2')!;
      this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
      this.shaderSource = defaultShaderSource;
    }

    updateShader(source: string) {
      this.reset();
      this.shaderSource = source;
      this.setup();
      this.init();
    }

    updateMove(deltas: [number, number]) {
      this.mouseMove = deltas;
    }

    updateMouse(coords: [number, number]) {
      this.mouseCoords = coords;
    }

    updatePointerCoords(coords: [number, number]) {
      this.pointerCoords = coords;
    }

    updatePointerCount(nbr: number) {
      this.nbrOfPointers = nbr;
    }

    updateScale(scale: number) {
      this.scale = scale;
      this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
    }

    compile(shader: WebGLShader, source: string) {
      const gl = this.gl;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.error('Shader compilation error:', error);
      }
    }

    test(source: string) {
      let result = null;
      const gl = this.gl;
      const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        result = gl.getShaderInfoLog(shader);
      }
      gl.deleteShader(shader);
      return result;
    }

    reset() {
      const gl = this.gl;
      if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
        if (this.vs) {
          gl.detachShader(this.program, this.vs);
          gl.deleteShader(this.vs);
        }
        if (this.fs) {
          gl.detachShader(this.program, this.fs);
          gl.deleteShader(this.fs);
        }
        gl.deleteProgram(this.program);
      }
    }

    setup() {
      const gl = this.gl;
      this.vs = gl.createShader(gl.VERTEX_SHADER)!;
      this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      this.compile(this.vs, this.vertexSrc);
      this.compile(this.fs, this.shaderSource);
      this.program = gl.createProgram()!;
      gl.attachShader(this.program, this.vs);
      gl.attachShader(this.program, this.fs);
      gl.linkProgram(this.program);

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(this.program));
      }
    }

    init() {
      const gl = this.gl;
      const program = this.program!;

      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      (program as any).resolution = gl.getUniformLocation(program, 'resolution');
      (program as any).time = gl.getUniformLocation(program, 'time');
      (program as any).move = gl.getUniformLocation(program, 'move');
      (program as any).touch = gl.getUniformLocation(program, 'touch');
      (program as any).pointerCount = gl.getUniformLocation(program, 'pointerCount');
      (program as any).pointers = gl.getUniformLocation(program, 'pointers');
    }

    render(now = 0) {
      const gl = this.gl;
      const program = this.program;

      if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      gl.uniform2f((program as any).resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f((program as any).time, now * 1e-3);
      gl.uniform2f((program as any).move, ...this.mouseMove);
      gl.uniform2f((program as any).touch, ...this.mouseCoords);
      gl.uniform1i((program as any).pointerCount, this.nbrOfPointers);
      gl.uniform2fv((program as any).pointers, this.pointerCoords);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  // Pointer Handler class
  class PointerHandler {
    private scale: number;
    private active = false;
    private pointers = new Map<number, number[]>();
    private lastCoords = [0, 0];
    private moves = [0, 0];
    private listeners: Array<[string, EventListener]> = [];

    constructor(element: HTMLCanvasElement, scale: number) {
      this.scale = scale;

      const map = (element: HTMLCanvasElement, scale: number, x: number, y: number) =>
        [x * scale, element.height - y * scale];

      const on = (type: string, handler: EventListener) => {
        element.addEventListener(type, handler);
        this.listeners.push([type, handler]);
      };

      on('pointerdown', (e) => {
        const event = e as PointerEvent;
        this.active = true;
        this.pointers.set(event.pointerId, map(element, this.getScale(), event.clientX, event.clientY));
      });

      on('pointerup', (e) => {
        const event = e as PointerEvent;
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(event.pointerId);
        this.active = this.pointers.size > 0;
      });

      on('pointerleave', (e) => {
        const event = e as PointerEvent;
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(event.pointerId);
        this.active = this.pointers.size > 0;
      });

      on('pointermove', (e) => {
        const event = e as PointerEvent;
        if (!this.active) return;
        this.lastCoords = [event.clientX, event.clientY];
        this.pointers.set(event.pointerId, map(element, this.getScale(), event.clientX, event.clientY));
        this.moves = [this.moves[0] + event.movementX, this.moves[1] + event.movementY];
      });
    }

    /** Detach every canvas listener this handler attached. Without this,
     *  a StrictMode remount leaves a stale handler on the canvas. */
    destroy(element: HTMLCanvasElement) {
      for (const [type, handler] of this.listeners) {
        element.removeEventListener(type, handler);
      }
      this.listeners = [];
    }

    getScale() {
      return this.scale;
    }

    updateScale(scale: number) {
      this.scale = scale;
    }

    get count() {
      return this.pointers.size;
    }

    get move() {
      return this.moves;
    }

    get coords() {
      return this.pointers.size > 0
        ? Array.from(this.pointers.values()).flat()
        : [0, 0];
    }

    get first() {
      return this.pointers.values().next().value || this.lastCoords;
    }
  }

  // Container-relative sizing: the hero lives inside a page section, so the
  // canvas follows its own box rather than the window. (Compatibility
  // adjustment — the engine and shader are otherwise as supplied.)
  const resize = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    canvas.width = Math.max(2, rect.width * dpr);
    canvas.height = Math.max(2, rect.height * dpr);

    if (rendererRef.current) {
      rendererRef.current.updateScale(dpr);
    }
  };

  const loop = (now: number) => {
    if (!rendererRef.current || !pointersRef.current) return;

    rendererRef.current.updateMouse(pointersRef.current.first as [number, number]);
    rendererRef.current.updatePointerCount(pointersRef.current.count);
    rendererRef.current.updatePointerCoords(pointersRef.current.coords as [number, number]);
    rendererRef.current.updateMove(pointersRef.current.move as [number, number]);
    rendererRef.current.render(now);
    animationFrameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // WebGL-unsupported fallback: leave the black background and the copy.
    // (Compatibility adjustment — without this the constructor below throws.)
    if (!canvas.getContext('webgl2')) return;

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);

    rendererRef.current.setup();
    rendererRef.current.init();

    resize();

    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource);
    }

    // Reduced motion: draw one settled still and never animate.
    // (Additive safeguard required by the site's accessibility spec.)
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      rendererRef.current.render(6000);
    } else {
      loop(0);
    }

    const onResize = () => {
      resize();
      if (reduced && rendererRef.current) {
        rendererRef.current.render(6000);
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pointersRef.current) {
        pointersRef.current.destroy(canvas);
        pointersRef.current = null;
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
    // Locked component (hero_section.md): the shader classes and the mount-once
    // setup live in this hook's scope, so an exhaustive dep array would force a
    // full teardown/rebuild of the WebGL context on every render. Intentionally
    // runs once, as supplied.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return canvasRef;
};

// Reusable Hero Component — overlay restyled to the "Event Horizon" brand
// system (approved: "Adapt overlay to brand"): left-aligned reading column,
// light editorial serif headline in white, muted body copy, brand pill CTAs.
const Hero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = ""
}) => {
  const canvasRef = useShaderBackground();

  return (
    <div
      className={`relative isolate flex min-h-[92svh] w-full flex-col overflow-hidden bg-black md:min-h-[720px] ${className}`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full touch-none"
        style={{ background: 'black' }}
      />

      {/* Left edge veil so the copy keeps its contrast against the shader. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.45)_32%,transparent_60%)]"
      />

      {/* Hero content overlay — text left, vertically centered (~40%), the
          visual breathing to the right (~60%). */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-content px-6 sm:px-10 lg:px-20">
          <div className="max-w-xl">
            {trustBadge && (
              <div className="animate-fade-in-down mb-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-ash bg-surface/60 px-4 py-2 text-[0.8125rem] text-secondary backdrop-blur-sm">
                  {trustBadge.icons && (
                    <span className="text-solar-flare/90" aria-hidden="true">
                      {trustBadge.icons.join(' ')}
                    </span>
                  )}
                  {trustBadge.text}
                </span>
              </div>
            )}

            <h1 className="animate-fade-in-up animation-delay-200 font-heading text-4xl font-light leading-[1.08] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.5rem]">
              {headline.line1}
              <br />
              <span className="animate-fade-in-up animation-delay-400 block">{headline.line2}</span>
            </h1>

            <div className="animate-fade-in-up animation-delay-600 mt-6 max-w-md md:mt-7">
              <p className="text-[0.95rem] leading-relaxed text-secondary md:text-base">
                {subtitle}
              </p>
            </div>

            {buttons && (
              <div className="animate-fade-in-up animation-delay-800 mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                {buttons.primary &&
                  (buttons.primary.href ? (
                    <Link href={buttons.primary.href} className="btn-primary">
                      {buttons.primary.text}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={buttons.primary.onClick}
                      className="btn-primary"
                    >
                      {buttons.primary.text}
                    </button>
                  ))}
                {buttons.secondary &&
                  (buttons.secondary.href ? (
                    <Link href={buttons.secondary.href} className="btn-secondary">
                      {buttons.secondary.text}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={buttons.secondary.onClick}
                      className="btn-secondary"
                    >
                      {buttons.secondary.text}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

const defaultShaderSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*
*	To explore strange new worlds, to seek out new life
*	and new civilizations, to boldly go where no man has
*	gone before.
*/
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
// Returns a pseudo random number for a given point (white noise)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
// Returns a pseudo random number for a given point (value noise)
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
// Returns a pseudo random number for a given point (fractal noise)
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}
void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
	}
	O=vec4(col,1);
}`;
