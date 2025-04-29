import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import * as CANNON from 'cannon-es';
import '../styles/LuxuryTransition.css';

const LuxuryTransition = ({ children, isVisible = false, onAnimationComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const frameRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const worldRef = useRef(null);
  const particlesRef = useRef([]);
  const bodiesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      initScene();
      startAnimation();
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isVisible]);

  const initScene = () => {
    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.7;
    
    // Create environment map for reflections
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);

    // Clear any existing canvas
    if (canvasRef.current.firstChild) {
      canvasRef.current.removeChild(canvasRef.current.firstChild);
    }
    canvasRef.current.appendChild(renderer.domElement);
    
    // Generate a procedural environment map with a gold theme
    const envScene = new THREE.Scene();
    
    // Add a gradient background
    const gradientMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDirection = normalize(vWorldPosition);
          float y = normalize(viewDirection).y;
          
          vec3 topColor = vec3(0.3, 0.25, 0.1);
          vec3 bottomColor = vec3(0.05, 0.04, 0.02);
          vec3 gradientColor = mix(bottomColor, topColor, y * 0.5 + 0.5);
          
          // Add a glow at the top for "light source"
          float glow = max(0.0, viewDirection.y);
          gradientColor += vec3(0.8, 0.7, 0.3) * pow(glow, 5.0) * 2.0;
          
          gl_FragColor = vec4(gradientColor, 1.0);
        }
      `
    });
    
    const envSphere = new THREE.Mesh(
      new THREE.SphereGeometry(100, 32, 32),
      gradientMaterial
    );
    
    envScene.add(envSphere);
    
    // Render the environment map
    cubeCamera.update(renderer, envScene);

    // Setup physics world
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    worldRef.current = world;
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    // Lighting
    setupLighting(scene);

    // Generate initial explosion
    createExplosion();

    // Start animation loop
    animate();

    // Handle window resize
    window.addEventListener('resize', handleResize);
  };

  const setupLighting = (scene) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    // Point lights for dramatic effect
    const goldLight1 = new THREE.PointLight(0xffcc00, 2.5, 60);
    goldLight1.position.set(10, 15, 10);
    scene.add(goldLight1);

    const goldLight2 = new THREE.PointLight(0xffaa00, 2.5, 60);
    goldLight2.position.set(-10, -10, 10);
    scene.add(goldLight2);
    
    // Extra accent light
    const accentLight = new THREE.PointLight(0xfffceb, 1.8, 40);
    accentLight.position.set(0, 5, 15);
    scene.add(accentLight);

    // Light rays
    createLightRays(scene);
  };

  const createLightRays = (scene) => {
    const rayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xffcc00) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 center = vec2(0.5, 0.5) - vUv;
          float dist = length(center);
          float brightness = 0.07 / dist;
          brightness *= noise(vUv + time * 0.15) * 0.6 + 0.6;
          brightness *= smoothstep(0.7, 0.2, dist);
          
          // Add pulsing effect
          brightness *= 0.8 + 0.3 * sin(time * 0.5);
          
          // Add ray streaks
          float rays = 0.0;
          float rayCount = 12.0;
          float angle = atan(center.y, center.x);
          rays = 0.3 * pow(sin(angle * rayCount + time), 2.0);
          
          brightness += rays * smoothstep(0.5, 0.2, dist);
          
          vec3 finalColor = color * brightness;
          finalColor += vec3(1.0, 0.9, 0.6) * rays * 0.2;
          
          gl_FragColor = vec4(finalColor, brightness * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // Main light rays
    const rayGeometry = new THREE.PlaneGeometry(50, 50);
    const ray = new THREE.Mesh(rayGeometry, rayMaterial);
    ray.rotation.x = Math.PI / 2;
    ray.position.y = -5;
    scene.add(ray);
    
    // Additional diagonal light rays for more dramatic effect
    const diagonalRay1 = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), rayMaterial.clone());
    diagonalRay1.rotation.x = Math.PI / 3;
    diagonalRay1.rotation.z = Math.PI / 4;
    diagonalRay1.position.set(5, 0, 5);
    scene.add(diagonalRay1);
    
    const diagonalRay2 = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), rayMaterial.clone());
    diagonalRay2.rotation.x = Math.PI / 3;
    diagonalRay2.rotation.z = -Math.PI / 4;
    diagonalRay2.position.set(-5, 0, 5);
    scene.add(diagonalRay2);

    // Update the time uniform in the animation loop
    const updateRay = () => {
      const rays = [ray, diagonalRay1, diagonalRay2];
      rays.forEach(r => {
        if (r.material.uniforms) {
          r.material.uniforms.time.value += 0.01;
        }
      });
    };

    // Add update function to animation loop
    const originalAnimate = animate;
    animate = () => {
      updateRay();
      originalAnimate();
    };
  };

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.08,
    metalness: 1.2,
    envMapIntensity: 1.5,
    envMap: cubeRenderTarget.texture
  });

  // Create bump map texture for surface details
  const bumpTexture = new THREE.DataTexture(
    generateBumpData(64, 64),
    64, 64,
    THREE.RedFormat,
    THREE.UnsignedByteType
  );
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set(2, 2);
  bumpTexture.needsUpdate = true;
  
  // Helper function to generate bump data
  function generateBumpData(width, height) {
    const size = width * height;
    const data = new Uint8Array(size);
    
    for (let i = 0; i < size; i++) {
      const stride = i * 1;
      
      // Random noise pattern with some structure
      const x = i % width;
      const y = Math.floor(i / width);
      
      // Edge highlighting
      const edgeX = Math.min(x, width - x - 1) / (width / 8);
      const edgeY = Math.min(y, height - y - 1) / (height / 8);
      const edge = Math.pow(Math.min(edgeX, edgeY), 0.5) * 255;
      
      // Noise pattern
      const noise = Math.random() * 40;
      
      // Combine patterns
      data[stride] = Math.min(255, edge + noise);
    }
    
    return data;
  }
  
  // Enhance material with bump map
  goldMaterial.bumpMap = bumpTexture;
  goldMaterial.bumpScale = 0.02;

  const createExplosion = () => {
    // Create coins
    const numCoins = 30;
    for (let i = 0; i < numCoins; i++) {
      createCoin(i);
    }

    // Create spheres
    const numSpheres = 40;
    for (let i = 0; i < numSpheres; i++) {
      createSphere(i);
    }

    // Create dust particles
    createGoldDust();
  };

  const createCoin = (index) => {
    // Coin geometry - add more segments for better quality
    const radius = Math.random() * 0.5 + 0.5;
    const height = 0.15;
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 48, 2, false);
    
    // Create a copy of the gold material for each coin for variations
    const coinMaterial = goldMaterial.clone();
    
    // Add subtle color variations to make each coin unique
    const hue = 0.12 + Math.random() * 0.03; // Gold hue with variations
    const coinColor = new THREE.Color().setHSL(hue, 0.8, 0.6);
    coinMaterial.color = coinColor;
    
    // Slight variations in material properties
    coinMaterial.roughness = 0.07 + Math.random() * 0.05;
    coinMaterial.metalness = 1.1 + Math.random() * 0.2;
    
    // Create the coin mesh
    const coin = new THREE.Mesh(geometry, coinMaterial);
    
    // Add edge beveling to coin
    const edgeGeometry = new THREE.TorusGeometry(radius, 0.03, 8, 48);
    const edge = new THREE.Mesh(edgeGeometry, coinMaterial);
    edge.rotation.x = Math.PI / 2;
    edge.position.y = height / 2;
    coin.add(edge);
    
    const edge2 = edge.clone();
    edge2.position.y = -height / 2;
    coin.add(edge2);
    
    // Add coin to scene
    sceneRef.current.add(coin);
    
    // Physics body
    const shape = new CANNON.Cylinder(
      radius, 
      radius, 
      height, 
      16
    );
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 0, 0),
      shape,
      material: new CANNON.Material()
    });

    // Initial explosion velocity
    const angle = Math.random() * Math.PI * 2;
    const strength = Math.random() * 20 + 10;
    const x = Math.cos(angle) * strength * (Math.random() - 0.5);
    const y = Math.sin(angle) * strength + 10;
    const z = Math.random() * strength * (Math.random() - 0.5);
    
    body.velocity.set(x, y, z);
    body.angularVelocity.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );

    worldRef.current.addBody(body);
    particlesRef.current.push(coin);
    bodiesRef.current.push(body);
  };

  const createSphere = (index) => {
    // Sphere geometry
    const radius = Math.random() * 0.4 + 0.2;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);

    // Apply gold material
    const sphere = new THREE.Mesh(geometry, goldMaterial);
    sceneRef.current.add(sphere);
    
    // Physics body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 0, 0),
      shape,
      material: new CANNON.Material()
    });

    // Initial explosion velocity
    const angle = Math.random() * Math.PI * 2;
    const strength = Math.random() * 15 + 5;
    const x = Math.cos(angle) * strength * (Math.random() - 0.5);
    const y = Math.sin(angle) * strength + 5;
    const z = Math.random() * strength * (Math.random() - 0.5);
    
    body.velocity.set(x, y, z);
    body.angularVelocity.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );

    worldRef.current.addBody(body);
    particlesRef.current.push(sphere);
    bodiesRef.current.push(body);
  };

  const createGoldDust = () => {
    // Dust particle system
    const particleCount = 400;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 12;
      positions[i3 + 1] = Math.random() * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 12;
      scales[i] = Math.random() * 0.6 + 0.2;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xffcc00) }
      },
      vertexShader: `
        attribute float scale;
        uniform float time;
        varying vec3 vColor;
        
        void main() {
          vColor = vec3(0.95, 0.8, 0.3) * (scale + 0.6);
          
          vec3 pos = position;
          pos.y += time * scale * 2.2;
          pos.x += sin(time * 2.2 + position.y) * scale;
          pos.z += cos(time * 2.2 + position.x) * scale;
          
          if (pos.y > 30.0) {
            pos.y = -10.0;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = scale * (350.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 0.9 * smoothstep(0.5, 0.2, dist);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    sceneRef.current.add(particleSystem);
    
    // Update time uniform in animation loop
    const updateParticles = () => {
      if (particleMaterial.uniforms) {
        particleMaterial.uniforms.time.value += 0.01;
      }
    };
    
    // Add update function to animation loop
    const originalAnimate = animate;
    animate = () => {
      updateParticles();
      originalAnimate();
    };
  };

  const animate = () => {
    animationFrameRef.current = requestAnimationFrame(animate);

    // Update physics
    worldRef.current.step(1 / 60);

    // Update particles position from physics
    for (let i = 0; i < particlesRef.current.length; i++) {
      const particle = particlesRef.current[i];
      const body = bodiesRef.current[i];
      
      particle.position.copy(body.position);
      particle.quaternion.copy(body.quaternion);
    }

    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const handleResize = () => {
    if (cameraRef.current && rendererRef.current) {
      // Update camera
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
  };

  const startAnimation = () => {
    // Camera animation
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    });

    // Initial camera position
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 40);
      
      // Move camera to final position
      timeline.to(cameraRef.current.position, {
        z: 20,
        duration: 3,
        ease: "power2.out"
      });
    }

    // Fade in content
    timeline.to({}, {
      duration: 1.5,
      onStart: () => {
        setContentVisible(true);
      }
    }, "-=1");

    // Show gold frame
    timeline.to({}, {
      duration: 0.5,
      onStart: () => {
        if (frameRef.current) {
          frameRef.current.classList.add('show');
        }
      }
    }, "-=0.5");
  };

  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Clear physics bodies
    if (worldRef.current) {
      bodiesRef.current.forEach(body => {
        worldRef.current.removeBody(body);
      });
    }

    // Clear scene
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        const object = sceneRef.current.children[0];
        sceneRef.current.remove(object);
      }
    }

    // Clear references
    particlesRef.current = [];
    bodiesRef.current = [];
  };

  return (
    <div className="ultimate-luxury-transition" ref={containerRef} style={{ display: isVisible ? 'flex' : 'none' }}>
      <div className="transition-canvas" ref={canvasRef}></div>
      
      <div className={`transition-content ${contentVisible ? 'fade-in' : ''}`} ref={contentRef}>
        {children}
      </div>
      
      <div className="gold-frame" ref={frameRef}>
        <div className="gold-corner top-left"></div>
        <div className="gold-corner top-right"></div>
        <div className="gold-corner bottom-left"></div>
        <div className="gold-corner bottom-right"></div>
        
        <div className="gold-edge top"></div>
        <div className="gold-edge right"></div>
        <div className="gold-edge bottom"></div>
        <div className="gold-edge left"></div>
      </div>
    </div>
  );
};

export default LuxuryTransition;