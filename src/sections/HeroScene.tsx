import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Full-bleed WebGL hero canvas:
 * procedural pastel cyan/periwinkle/mint gradient shader background
 * plus floating glossy 3D polymer pellets (cylinders) drifting slowly.
 * Falls back silently: the CSS gradient behind the canvas shows on failure.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.z = 9

    // Gradient shader backdrop (fullscreen quad, positioned far behind)
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
    }
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 36),
      new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms,
        vertexShader: `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uRes;
          vec3 c1 = vec3(0.70, 0.88, 1.00);  // pastel cyan
          vec3 c2 = vec3(0.97, 0.99, 1.00);  // off white
          vec3 c3 = vec3(0.70, 0.75, 1.00);  // periwinkle
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
          float noise(vec2 p){
            vec2 i = floor(p), f = fract(p);
            f = f*f*(3.0-2.0*f);
            return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
                       mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
          }
          void main(){
            vec2 uv = vUv;
            float n = noise(uv*3.0 + uTime*0.06) * 0.5 + noise(uv*7.0 - uTime*0.04)*0.25;
            float t = clamp(uv.y + (n - 0.4) * 0.5, 0.0, 1.0);
            vec3 col = mix(c3, c1, smoothstep(0.0, 0.5, t));
            col = mix(col, c2, smoothstep(0.45, 1.0, t));
            // soft vignette to keep edges airy
            float d = distance(uv, vec2(0.5));
            col = mix(col, vec3(0.99,1.0,1.0), smoothstep(0.55, 0.95, d)*0.6);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    )
    bg.position.z = -12
    scene.add(bg)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9))
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(4, 6, 8)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x9adfff, 0.8)
    rim.position.set(-6, -2, 4)
    scene.add(rim)

    // Floating polymer pellets (small glossy cylinders)
    const pelletGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.4, 32)
    const palette = [0x8fdcf5, 0xb3c0fe, 0xffffff, 0x6fc8ea, 0xd9f7ff]
    const pellets: { m: THREE.Mesh; r: THREE.Vector3; s: number; o: number }[] = []
    const group = new THREE.Group()
    for (let i = 0; i < 26; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: palette[i % palette.length],
        roughness: 0.18,
        metalness: 0.05,
        clearcoat: 0.9,
        clearcoatRoughness: 0.25,
      })
      const m = new THREE.Mesh(pelletGeo, mat)
      const x = (Math.random() - 0.5) * 11
      const y = (Math.random() - 0.5) * 6
      const z = (Math.random() - 0.5) * 4 - 1
      m.position.set(x, y, z)
      m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      group.add(m)
      pellets.push({
        m,
        r: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
        s: 0.25 + Math.random() * 0.45,
        o: Math.random() * Math.PI * 2,
      })
    }
    scene.add(group)

    let mx = 0
    let my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      uniforms.uRes.value.set(w, h)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let raf = 0
    const tick = () => {
      const t = clock.getElapsedTime()
      if (!reduce) {
        uniforms.uTime.value = t
        pellets.forEach((p) => {
          p.m.rotation.x += 0.002 * p.s * 3
          p.m.rotation.y += 0.003 * p.s * 3
          p.m.position.y += Math.sin(t * p.s + p.o) * 0.0022
          p.m.position.x += Math.cos(t * p.s * 0.7 + p.o) * 0.0015
        })
        group.rotation.y += (mx * 0.12 - group.rotation.y) * 0.03
        group.rotation.x += (my * 0.08 - group.rotation.x) * 0.03
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      pelletGeo.dispose()
      pellets.forEach((p) => (p.m.material as THREE.Material).dispose())
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 90% at 70% 20%, #d9f7ff 0%, #eef8ff 45%, #ffffff 100%)',
      }}
    />
  )
}
