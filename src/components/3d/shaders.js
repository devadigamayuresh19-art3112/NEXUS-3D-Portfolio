export const portalVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const portalFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float angle = atan(p.y, p.x);
    float n = noise(vec2(angle * 2.5 + uTime * 0.2, r * 4.0 - uTime * 0.35));
    float swirl = sin(angle * 9.0 + uTime * 0.9 + r * 11.0 + n * 3.0) * 0.5 + 0.5;
    float ring = smoothstep(1.02, 0.78, r) * smoothstep(0.12, 0.4, r);
    float core = smoothstep(0.72, 0.0, r) * 0.5;
    vec3 color = mix(uColorA, uColorB, swirl * 0.8 + r * 0.2);
    float alpha = (ring * (0.28 + swirl * 0.5) + core * 0.3) * uIntensity;
    alpha *= smoothstep(1.0, 0.94, r);
    gl_FragColor = vec4(color, alpha);
  }
`

export const fresnelVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const fresnelFragmentShader = /* glsl */ `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform vec3 uColor;
  uniform vec3 uColorB;
  uniform float uIntensity;
  uniform float uPower;

  void main() {
    float fresnel = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0), uPower);
    vec3 color = mix(uColor, uColorB, fresnel);
    gl_FragColor = vec4(color, fresnel * uIntensity);
  }
`

export const energyVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const energyFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;

  void main() {
    float band = smoothstep(0.48, 0.5, vUv.y) * smoothstep(0.52, 0.5, vUv.y);
    float pulse = 0.5 + 0.5 * sin(vUv.x * 40.0 + uTime * 2.0);
    float alpha = (band * 0.9 + 0.04) * uIntensity * (0.5 + pulse * 0.5);
    gl_FragColor = vec4(uColor, alpha);
  }
`
