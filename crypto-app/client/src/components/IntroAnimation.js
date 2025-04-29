import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import '../styles/IntroAnimation.css';

const IntroAnimation = ({ onComplete }) => {
  const mountRef = useRef(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  
  // Three.js nesnelerini tutacak ref'ler
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // Ref'lere ata
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Background and lighting
    scene.background = new THREE.Color('#111111');
    
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffd700, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xffc107, 2);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // Create a group of particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xffd700,
      transparent: true,
      opacity: 0.6,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create a sphere representing a crypto coin
    const cryptoGeometry = new THREE.SphereGeometry(1, 32, 32);
    const cryptoMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 1,
      roughness: 0.1,
    });
    
    const cryptoMesh = new THREE.Mesh(cryptoGeometry, cryptoMaterial);
    cryptoMesh.position.set(0, 0, 0);
    scene.add(cryptoMesh);
    
    // Add Bitcoin Symbol using a Circle
    const symbolGeometry = new THREE.CircleGeometry(0.5, 32);
    const symbolMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const symbolMesh = new THREE.Mesh(symbolGeometry, symbolMaterial);
    symbolMesh.position.set(0, 0, 1.01);
    scene.add(symbolMesh);
    
    // Position the camera
    camera.position.z = 5;
    
    // Animation setup
    const animate = () => {
      const animId = requestAnimationFrame(animate);
      animationRef.current = animId;
      
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      
      cryptoMesh.rotation.y += 0.01;
      symbolMesh.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Intro sequence with GSAP
    const timeline = gsap.timeline();
    
    // Initial animation - süreleri kısalttım
    timeline.fromTo(cryptoMesh.position, { z: -20 }, { z: 0, duration: 1, ease: 'power3.out' }); // 2 saniyeden 1 saniyeye
    timeline.fromTo(cryptoMesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3'); // 1 saniyeden 0.6 saniyeye
    
    // Camera movement - süreleri kısalttım
    timeline.to(camera.position, { z: 3, duration: 0.8, ease: 'power2.inOut' }, '+=0.1'); // 1.5 saniyeden 0.8 saniyeye
    timeline.to(cryptoMesh.rotation, { y: Math.PI * 2, duration: 0.8, ease: 'power1.inOut' }, '-=0.8'); // 1 saniyeden 0.8 saniyeye
    
    // Show the enter button - hemen göster
    timeline.call(() => setShowEnterButton(true), [], '+=0.1'); // 0.5 saniyeden 0.1 saniyeye
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Animation döngüsünü durdur
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // DOM elementini kaldır
      if (mountRef.current && rendererRef.current && rendererRef.current.domElement && 
          mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Kaynakları temizle
      if (sceneRef.current) {
        scene.remove(particlesMesh);
        scene.remove(cryptoMesh);
        scene.remove(symbolMesh);
      }
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      cryptoGeometry.dispose();
      cryptoMaterial.dispose();
      symbolGeometry.dispose();
      symbolMaterial.dispose();
      
      // Renderer'ı temizle
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  const handleEnter = () => {
    // Önce state'i güncelle, sonra callback'i çağır
    setIsComplete(true);
    
    // Geçiş animasyonu için gecikme ekle
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1000); // Fadeout animasyonu süresi
  };
  
  return (
    <div className={`intro-animation ${isComplete ? 'fade-out' : ''}`}>
      <div ref={mountRef} className="canvas-container"></div>
      
      <div className="intro-content">
        <h1 className="intro-title">CryptoBuddy</h1>
        <p className="intro-subtitle">Kripto dünyasına adım atın</p>
        
        {showEnterButton && (
          <button className="enter-button" onClick={handleEnter}>
            KEŞFET
          </button>
        )}
      </div>
    </div>
  );
};

export default IntroAnimation; 