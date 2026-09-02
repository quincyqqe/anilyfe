'use client';

import { useEffect, useRef } from 'react';

const vertSrc = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`;

const fragSrc = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_res;
uniform float u_time;
float tanh1(float x){ float e = exp(2.0*x); return (e-1.0)/(e+1.0); }
vec4 tanh4(vec4 v){ return vec4(tanh1(v.x), tanh1(v.y), tanh1(v.z), tanh1(v.w)); }
void main(){
  vec3 FC = vec3(gl_FragCoord.xy, 0.0);
  vec3 r = vec3(u_res, max(u_res.x, u_res.y));
  vec3 p = vec3(0.0), v = vec3(1.0, 2.0, 6.0);
  float i = 0.0, z = 1.0, d = 1.0, f = 1.0;
  vec4 o = vec4(0.0);
  for (; i++ < 50.0; o.rgb += (cos((p.x + z + v) * 0.1) + 1.0) / d / f / z) {
    p = z * normalize(FC * 2.0 - r.xyy);
    vec4 m = cos((p + sin(p)).y * 0.4 + vec4(0.0, 33.0, 11.0, 0.0));
    p.xz = mat2(m) * p.xz;
    p.x += u_time / 0.2;
    z += (d = length(cos(p / v) * v + v.zxx / 7.0) / (f = 2.0 + d / exp(p.y * 0.2)));
  }
  o = tanh4(0.2 * o); o.a = 1.0; fragColor = o;
}`;

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Shader compilation failed';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

export default function ShaderDemo_ATC() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
    if (!gl) return;

    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let animationFrame = 0;

    try {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertSrc);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
      program = gl.createProgram();
      if (!program) throw new Error('Unable to create shader program');
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader link failed');
      gl.useProgram(program);

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      const resolution = gl.getUniformLocation(program, 'u_res');
      const time = gl.getUniformLocation(program, 'u_time');
      const resize = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
        const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform2f(resolution, width, height);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      resize();
      const startedAt = performance.now();
      const draw = (now: number) => {
        gl.uniform1f(time, (now - startedAt) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrame = requestAnimationFrame(draw);
      };
      animationFrame = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(animationFrame);
        observer.disconnect();
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
      };
    } catch {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    }
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />;
}
