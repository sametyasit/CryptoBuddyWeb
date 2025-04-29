import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Lottie from 'lottie-react';
import { FaAngleRight } from 'react-icons/fa';
import '../styles/UltraLuxuryTransition.css';

// Importing animations
import goldConfettiAnimation from '../assets/animations/gold-confetti.json';

const UltraLuxuryTransition = ({ children, isVisible = false, onAnimationComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameRef = useRef(null);
  const tlRef = useRef(null);
  
  const [contentVisible, setContentVisible] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [particlesLoaded, setParticlesLoaded] = useState(false);

  // Initialize the particle system
  const particlesInit = async (engine) => {
    await loadSlim(engine);
    setParticlesLoaded(true);
  };

  // Particle configuration for luxury gold effects
  const particlesOptions = useMemo(() => ({
    fullScreen: false,
    background: {
      opacity: 0
    },
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#FFD700", "#FFC107", "#FFAB00", "#FFD54F", "#FFECB3"]
      },
      shape: {
        type: ["circle", "triangle", "polygon"],
        polygon: {
          sides: 6
        }
      },
      opacity: {
        value: 0.6,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 4,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.5,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#FFD700",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      },
      life: {
        duration: {
          value: 3,
          random: true
        },
        count: 1
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  }), []);

  // Animation spring properties
  const fadeInProps = useSpring({
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? 'scale(1)' : 'scale(0.92)',
    config: {
      mass: 1,
      tension: 280,
      friction: 30
    }
  });

  // 3D Animation setup
  useEffect(() => {
    if (isVisible) {
      initScene();
      startAnimation();
      
      // Add window resize handler
      window.addEventListener('resize', handleResize);
    } else {
      cleanup();
    }

    return () => {
      cleanup();
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  const initScene = () => {
    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.012);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 20);
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // Clear any existing canvas
    if (canvasRef.current.firstChild) {
      canvasRef.current.removeChild(canvasRef.current.firstChild);
    }
    canvasRef.current.appendChild(renderer.domElement);

    // Create environment cubemap
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);

    // Lighting setup
    setupLighting(scene);

    // Create 3D objects
    createObjects(scene, cubeRenderTarget.texture);

    // Start animation loop
    animate();
  };

  const setupLighting = (scene) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Gold accent lights
    const goldLight1 = new THREE.PointLight(0xffd700, 2, 50);
    goldLight1.position.set(10, 5, 10);
    scene.add(goldLight1);

    const goldLight2 = new THREE.PointLight(0xffcc00, 1.5, 40);
    goldLight2.position.set(-10, -5, 8);
    scene.add(goldLight2);

    // Create light rays with volumetric effect
    createLightRays(scene);
  };

  const createLightRays = (scene) => {
    // Use volumetric lighting shader for rays
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

    // Create multiple light rays for volumetric effect
    const rayGeometry = new THREE.PlaneGeometry(50, 50);
    const ray = new THREE.Mesh(rayGeometry, rayMaterial);
    ray.rotation.x = Math.PI / 2;
    ray.position.y = -5;
    scene.add(ray);
    
    // Diagonal rays for more dramatic effect
    const diagonalRay1 = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40), 
      rayMaterial.clone()
    );
    diagonalRay1.rotation.x = Math.PI / 3;
    diagonalRay1.rotation.z = Math.PI / 4;
    diagonalRay1.position.set(10, 0, 5);
    scene.add(diagonalRay1);
    
    const diagonalRay2 = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40), 
      rayMaterial.clone()
    );
    diagonalRay2.rotation.x = Math.PI / 3;
    diagonalRay2.rotation.z = -Math.PI / 4;
    diagonalRay2.position.set(-10, 0, 5);
    scene.add(diagonalRay2);

    // Update time uniform in animation
    const updateRays = () => {
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
      updateRays();
      originalAnimate();
    };
  };

  const createObjects = (scene, envMap) => {
    // Create a procedural gold material with high quality reflections
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.08,
      metalness: 1.2,
      envMap: envMap,
      envMapIntensity: 1.5,
    });

    // Add a detail bump map texture
    const bumpSize = 64;
    const bumpData = new Uint8Array(bumpSize * bumpSize);
    
    for (let i = 0; i < bumpSize; i++) {
      for (let j = 0; j < bumpSize; j++) {
        // Create fine grain pattern
        const edgeX = Math.min(i, bumpSize - i - 1) / (bumpSize / 8);
        const edgeY = Math.min(j, bumpSize - j - 1) / (bumpSize / 8);
        const edge = Math.pow(Math.min(edgeX, edgeY), 0.5) * 255;
        const noise = Math.random() * 40;
        
        bumpData[i * bumpSize + j] = Math.min(255, edge + noise);
      }
    }
    
    const bumpTexture = new THREE.DataTexture(
      bumpData,
      bumpSize,
      bumpSize,
      THREE.RedFormat
    );
    bumpTexture.needsUpdate = true;
    goldMaterial.bumpMap = bumpTexture;
    goldMaterial.bumpScale = 0.02;

    // Create floating gold rings
    createGoldRings(scene, goldMaterial);
    
    // Create floating particles
    createGoldParticles(scene);
  };

  const createGoldRings = (scene, material) => {
    // Create floating rings with animation
    const rings = [];
    
    for (let i = 0; i < 5; i++) {
      const radius = 2 + i * 0.5;
      const tube = 0.1 + i * 0.02;
      const ringGeometry = new THREE.TorusGeometry(radius, tube, 32, 100);
      const ring = new THREE.Mesh(ringGeometry, material.clone());
      
      // Randomize rotation
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      
      // Add to scene
      scene.add(ring);
      rings.push(ring);
    }
    
    // Animate rings
    const animateRings = () => {
      rings.forEach((ring, i) => {
        const time = Date.now() * 0.0005;
        ring.rotation.x += 0.002;
        ring.rotation.y += 0.003;
        
        // Gentle floating movement
        ring.position.y = Math.sin(time + i * 0.5) * 0.5;
        ring.position.x = Math.cos(time + i * 0.7) * 0.3;
      });
    };
    
    // Add to animation loop
    const originalAnimate = animate;
    animate = () => {
      animateRings();
      originalAnimate();
    };
  };

  const createGoldParticles = (scene) => {
    // Create glowing particles
    const particleCount = 300;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Distribute in a spherical volume
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 8;
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
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
          
          // Add gentle floating motion
          pos.x += sin(time * 0.7 + position.z) * 0.2;
          pos.y += cos(time * 0.8 + position.x) * 0.2;
          pos.z += sin(time * 0.9 + position.y) * 0.2;
          
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
    scene.add(particleSystem);
    
    // Update time uniform
    const updateParticles = () => {
      if (particleMaterial.uniforms) {
        particleMaterial.uniforms.time.value += 0.01;
      }
    };
    
    // Add to animation loop
    const originalAnimate = animate;
    animate = () => {
      updateParticles();
      originalAnimate();
    };
  };

  const animate = () => {
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Render the scene
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const handleResize = () => {
    if (cameraRef.current && rendererRef.current) {
      // Update camera aspect ratio
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer size
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
  };

  const startAnimation = () => {
    // Create and store the timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Enable interactive mode after animation completes
        setInteractiveMode(true);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    });
    tlRef.current = tl;

    // Initial camera movements
    if (cameraRef.current) {
      // Start from further away
      cameraRef.current.position.set(0, 0, 40);
      
      // Dramatic camera movement
      tl.to(cameraRef.current.position, {
        z: 20,
        duration: 2,
        ease: "power2.out"
      });
      
      // Add a slight rotation
      tl.to(cameraRef.current.rotation, {
        y: Math.PI * 0.05,
        duration: 1.5,
        ease: "power1.inOut"
      }, "-=1.5");
    }

    // Fade in content with delay
    tl.to({}, {
      duration: 0.5,
      onStart: () => {
        setContentVisible(true);
      }
    }, "-=0.8");
  };

  const cleanup = () => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Clear any GSAP animations
    if (tlRef.current) {
      tlRef.current.kill();
    }

    // Clear three.js resources
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    if (sceneRef.current) {
      // Traverse scene and dispose of all geometries and materials
      sceneRef.current.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }

    // Reset state
    setContentVisible(false);
    setInteractiveMode(false);
  };

  return (
    <div 
      className={`ultra-luxury-transition ${isVisible ? 'visible' : ''}`} 
      ref={containerRef}
    >
      {/* 3D Canvas */}
      <div className="transition-canvas" ref={canvasRef}></div>
      
      {/* Particles background */}
      <div className="particles-container">
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      </div>
      
      {/* Gold confetti animation */}
      <div className="confetti-container">
        <Lottie 
          animationData={goldConfettiAnimation} 
          loop={true}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: contentVisible ? 0.6 : 0
          }}
        />
      </div>
      
      {/* Content with spring animation */}
      <animated.div 
        className="transition-content"
        style={fadeInProps}
        ref={contentRef}
      >
        {/* Luxury frame */}
        <div className="luxury-frame">
          <div className="luxury-corner top-left"></div>
          <div className="luxury-corner top-right"></div>
          <div className="luxury-corner bottom-left"></div>
          <div className="luxury-corner bottom-right"></div>
          
          <div className="luxury-edge top"></div>
          <div className="luxury-edge right"></div>
          <div className="luxury-edge bottom"></div>
          <div className="luxury-edge left"></div>
        </div>
        
        {/* Content */}
        <div className="content-inner">
          {children}
        </div>
        
        {/* Continue button */}
        {interactiveMode && (
          <div className="continue-button-container">
            <button 
              className="continue-button"
              onClick={() => {
                if (onAnimationComplete) onAnimationComplete();
              }}
            >
              <span>DEVAM ET</span>
              <FaAngleRight />
            </button>
          </div>
        )}
      </animated.div>
    </div>
  );
};

export default UltraLuxuryTransition; 