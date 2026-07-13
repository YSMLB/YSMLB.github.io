// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Text, Hud, OrthographicCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// Глобальные стейты для синхронизации вращения
const sharedRotation = new THREE.Euler();
let forceResetRotation = false;

// 1. Идеальная монолитная буква Y (Адаптивный скейл)
function SolidGlassY() {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.4, -1.5);
    shape.lineTo(0.4, -1.5);
    shape.lineTo(0.4, 0);
    shape.lineTo(1.5, 1.8);
    shape.lineTo(0.7, 1.8);
    shape.lineTo(0, 0.4);
    shape.lineTo(-0.7, 1.8);
    shape.lineTo(-1.5, 1.8);
    shape.lineTo(-0.4, 0);
    shape.lineTo(-0.4, -1.5);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    }).center();
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      if (forceResetRotation) {
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1);
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
        if (Math.abs(group.current.rotation.x) < 0.01) forceResetRotation = false;
      } else {
        group.current.rotation.y += delta * 2.8;
        group.current.rotation.x += delta * 1.5;

        // На мобилках параллакс от мыши/тапа слабее
        const isMobile = viewport.width < 5;
        const targetX = (state.pointer.y * Math.PI) / (isMobile ? 6 : 3);
        const targetZ = -(state.pointer.x * Math.PI) / (isMobile ? 6 : 3);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, group.current.rotation.x + targetX, 0.05);
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetZ, 0.05);
      }

      sharedRotation.copy(group.current.rotation);
    }
  });

  // Динамический скейл: на телефоне делаем крупнее (относительно узкого экрана)
  const isMobile = viewport.width < 5;
  const scale = isMobile ? viewport.width / 3.5 : Math.min(viewport.width / 8, 1.5);

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={group} scale={scale}>
        <mesh geometry={geometry}>
          <MeshTransmissionMaterial
            background={new THREE.Color("#000000")}
            thickness={6.0}
            roughness={0.0}
            transmission={1}
            ior={1.35}
            chromaticAberration={1.5}
            anisotropy={0.8}
            clearcoat={1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// 2. ФОН: LED Билборды
const LedBillboardWall = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(state.pointer.x, state.pointer.y),
        0.05
      );
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    
    void main() {
      vec2 gridScale = vec2(80.0, 40.0); 
      vec2 uv = vUv * gridScale;
      vec2 panelId = floor(uv);
      vec2 panelUv = fract(uv);

      float border = step(0.08, panelUv.x) * step(panelUv.x, 0.92) * 
                     step(0.08, panelUv.y) * step(panelUv.y, 0.92);

      vec3 color = vec3(0.02, 0.02, 0.03);

      vec2 mouseMapped = vec2(uMouse.x * 0.5 + 0.5, (uMouse.y) * 0.5 + 0.5);
      float distToMouse = distance(vUv, mouseMapped);

      float ripple = sin(distToMouse * 15.0 - uTime * 3.0) * 0.5 + 0.5;
      float glowIntensity = smoothstep(0.4, 0.0, distToMouse) * ripple;

      float rand = fract(sin(dot(panelId, vec2(12.9898, 78.233))) * 43758.5453);
      vec3 neonColor = mix(vec3(0.5, 0.0, 0.8), vec3(0.0, 0.8, 0.4), step(0.5, rand));
      neonColor = mix(neonColor, vec3(0.0, 0.4, 1.0), step(0.8, rand)); 

      color += neonColor * glowIntensity * 0.4;
      color *= border; 

      float distFromCenter = distance(vUv, vec2(0.5));
      color *= smoothstep(0.8, 0.2, distFromCenter);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <cylinderGeometry args={[25, 25, 30, 64, 32, true, -Math.PI / 2.5, Math.PI / 1.25]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) }
        }}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

function BackgroundText() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  return (
    <Text
      position={[0, 0, -8]}
      fontSize={isMobile ? viewport.width / 1.5 : viewport.width / 2.2}
      color="#ffffff"
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf"
      fontWeight={900}
      letterSpacing={-0.08}
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.8}
    >
      YSM
    </Text>
  );
}

function TrackingAxes() {
  const { size } = useThree();
  const axesRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // На мобилках скрываем оси, чтобы не перегружать мелкий экран
  if (size.width < 768) return null;

  const zoom = 50;
  useFrame(() => {
    if (axesRef.current && !forceResetRotation) {
      axesRef.current.rotation.copy(sharedRotation);
    } else if (axesRef.current && forceResetRotation) {
      axesRef.current.rotation.set(0, 0, 0);
    }
  });

  const xPos = (size.width / 2) / zoom - 3.5;
  const yPos = (size.height / 2) / zoom - 2.5;

  return (
    <group
      position={[xPos, yPos, 0]}
      onClick={() => { forceResetRotation = true; }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 0.8}
    >
      <group ref={axesRef}>
        <mesh position={[0.5, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 1]} /><meshBasicMaterial color={hovered ? "#ffffff" : "#ff2222"} /></mesh>
        <Text position={[1.2, 0, 0]} fontSize={0.3} color={hovered ? "#ffffff" : "#ff2222"}>X</Text>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 1]} /><meshBasicMaterial color={hovered ? "#ffffff" : "#22ff22"} /></mesh>
        <Text position={[0, 1.2, 0]} fontSize={0.3} color={hovered ? "#ffffff" : "#22ff22"}>Y</Text>
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 1]} /><meshBasicMaterial color={hovered ? "#ffffff" : "#2222ff"} /></mesh>
        <Text position={[0, 0, 1.2]} fontSize={0.3} color={hovered ? "#ffffff" : "#2222ff"}>Z</Text>
        <mesh><sphereGeometry args={[0.08]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>
      <mesh visible={false}>
        <boxGeometry args={[3, 3, 3]} />
      </mesh>
      <Text position={[0, -1.5, 0]} fontSize={0.15} color={hovered ? "#ffffff" : "#888888"} letterSpacing={0.1}>
        CLICK TO RESET
      </Text>
    </group>
  );
}

function PostEffects() {
  const effects = (
    <EffectComposer disableNormalPass>
      <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.5} />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.003, 0.003)} />
      <Noise opacity={0.08} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
  return effects;
}

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<'hero' | 'bio' | 'projects'>('hero');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCursorHovered, setIsCursorHovered] = useState(false);

  const [maskPos, setMaskPos] = useState({ x: 0, y: 0 });
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isPhotoClicked, setIsPhotoClicked] = useState(false);

  const [userData, setUserData] = useState({ ip: "DETECTING...", loc: "CALCULATING..." });
  const [githubProjects, setGithubProjects] = useState<any[]>([{ title: "LOADING REPOS...", desc: "Connecting to GitHub API", date: "..." }]);
  const [newsIndex, setNewsIndex] = useState(0);

  const cursorX = useSpring(0, { stiffness: 400, damping: 28, mass: 0.5 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 28, mass: 0.5 });

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setUserData({
          ip: data.ip || "UNKNOWN",
          loc: data.latitude ? `${data.latitude}°N, ${data.longitude}°E (${data.city})` : "LOCATION RESTRICTED"
        });
      })
      .catch(() => setUserData({ ip: "CONNECTION_FAILED", loc: "OFFLINE_MODE" }));
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/users/YSMLB/repos?sort=updated&per_page=5')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formattedRepos = data.map(repo => ({
            title: repo.name,
            desc: repo.description || "System architecture component / No description provided.",
            date: new Date(repo.updated_at).toLocaleDateString('ru-RU').replace(/\./g, '.'),
            url: repo.html_url
          }));
          setGithubProjects(formattedRepos);
        } else {
          setGithubProjects([{ title: "NO REPOS FOUND", desc: "No public repositories available.", date: "SYS.ERR" }]);
        }
      })
      .catch(err => {
        console.error("GitHub API Error", err);
        setGithubProjects([{ title: "API_TIMEOUT", desc: "Failed to connect to GitHub. Check rate limits.", date: "SYS.ERR" }]);
      });
  }, []);

  useEffect(() => {
    const duration = 10000;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setLoadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (githubProjects.length > 1) {
      const newsInterval = setInterval(() => {
        setNewsIndex((prev) => (prev + 1) % githubProjects.length);
      }, 5000);
      return () => clearInterval(newsInterval);
    }
  }, [githubProjects]);

  useEffect(() => {
    // Отключаем кастомный курсор на тач-устройствах, чтобы не ломать тапы
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - (isCursorHovered ? 24 : 16));
      cursorY.set(e.clientY - (isCursorHovered ? 24 : 16));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY, isCursorHovered]);

  const projects = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    title: `System Layer 0${i + 1}`,
    category: "Backend / Logic",
  }));

  return (
    <div className="bg-[#050505] text-[#f5f5f5] min-h-screen h-screen overflow-hidden font-sans selection:bg-[#ffffff] selection:text-black cursor-auto md:cursor-none">

      {/* КУРСОР (Скрыт на мобильных устройствах) */}
      <motion.div
        className="hidden md:flex fixed top-0 left-0 border rounded-full pointer-events-none z-[999] mix-blend-difference items-center justify-center backdrop-invert-[0.1]"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          width: isCursorHovered ? 48 : 32,
          height: isCursorHovered ? 48 : 32,
          backgroundColor: isCursorHovered ? "rgba(255, 255, 255, 0.1)" : "transparent",
          borderColor: isCursorHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)"
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div className="bg-white rounded-full" animate={{ width: isCursorHovered ? 0 : 4, height: isCursorHovered ? 0 : 4 }} />
      </motion.div>

      {/* ПРЕЛОАДЕР */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            exit={{ opacity: 0, scale: 1.02, transition: { duration: 1.5, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202] px-6"
          >
            <div className="flex flex-col items-center justify-center w-full max-w-2xl">
              <div className="w-full flex justify-between items-end mb-4 font-mono text-[10px] md:text-xs uppercase tracking-widest text-gray-500">
                <div className="flex flex-col gap-1">
                  <span>System Boot</span>
                  <span className="text-[#888888]">IP: {userData.ip}</span>
                  <span className="text-[#888888] hidden md:block">LOC: {userData.loc}</span>
                </div>
                <span className="text-white text-xl md:text-2xl">{Math.floor(loadProgress)}%</span>
              </div>

              <div className="w-full h-[1px] bg-gray-900 relative overflow-hidden mb-12 md:mb-16">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_#ffffff]"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 1, duration: 1 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-4 md:mb-6">AMIR</h1>
                <h2 className="text-lg md:text-2xl font-light text-gray-400 mb-4 tracking-tight">Backend & Web Developer</h2>

                <div className="flex flex-wrap justify-center gap-2 md:gap-4 font-mono text-[8px] md:text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-8 md:mt-10">
                  <span className="border border-gray-800 px-3 py-2 md:px-4 md:py-2 rounded-sm backdrop-blur-sm bg-white/5">GitHub: YSMLB</span>
                  <span className="border border-gray-800 px-3 py-2 md:px-4 md:py-2 rounded-sm backdrop-blur-sm bg-white/5">Stack: Golang // C#</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D СЦЕНА */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 40 }} dpr={[1, 2]}>
          <LedBillboardWall />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={4} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={2} color="#ffffff" />
          <Environment preset="studio" environmentIntensity={1.0} />
          <BackgroundText />
          <SolidGlassY />
          <PostEffects />
          <Hud>
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
            <ambientLight intensity={1} />
            <TrackingAxes />
          </Hud>
        </Canvas>
      </div>

      {/* ЗАТЕМНЕНИЕ */}
      <AnimatePresence>
        {activeSection !== 'hero' && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(15px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-20 bg-black/80 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* АДАПТИВНАЯ НАВИГАЦИЯ */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: !isLoading ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.2 }}
        className="fixed inset-0 pointer-events-none z-50 p-6 md:p-8 flex flex-col justify-between"
      >
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center md:items-start font-mono text-[10px] uppercase tracking-widest text-gray-400 gap-y-6">

          <button onClick={() => setActiveSection('hero')} onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className="font-bold text-white text-sm tracking-[0.2em] pointer-events-auto cursor-auto md:cursor-none hover:text-white transition-colors">
            YSM.
          </button>

          {/* Центр меню (переносится на новую строку на смартфонах) */}
          <div className="flex gap-6 md:gap-8 pointer-events-auto w-full md:w-auto justify-center order-3 md:order-none md:pr-32 pt-4 md:pt-0">
            {['hero', 'bio', 'projects'].map((item) => (
              <button key={item} onClick={() => setActiveSection(item as any)} onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className={`cursor-auto md:cursor-none transition-colors relative group text-[10px] ${activeSection === item ? 'text-white' : 'hover:text-white'}`}>
                <span className="relative z-10">{item === 'hero' ? 'Home' : item}</span>
                <span className={`absolute -bottom-2 left-1/2 h-[1px] bg-white transition-all ${activeSection === item ? 'w-full -translate-x-1/2' : 'w-0 group-hover:w-full group-hover:-translate-x-1/2'}`} />
              </button>
            ))}
          </div>

          <button onClick={() => setIsContactOpen(true)} onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className="pointer-events-auto cursor-auto md:cursor-none hover:text-white transition-colors order-2 md:order-none">
            Contact
          </button>
        </div>

        {/* НИЖНЯЯ ПАНЕЛЬ С НОВОСТЯМИ */}
        <AnimatePresence>
          {activeSection === 'hero' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-between items-end font-mono w-full">

              {/* Скрыто на мобилках */}
              <div className="hidden md:flex flex-col gap-1 text-[9px] uppercase tracking-[0.2em] text-gray-500">
                <span className="text-gray-300">System Core</span>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-16 h-[1px] bg-gray-800 relative overflow-hidden">
                    <motion.div className="absolute top-0 left-0 h-full bg-white" animate={{ width: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                  </div>
                  <span>STATUS_ OK // IP_ {userData.ip}</span>
                </div>
              </div>

              {/* РЕАЛЬНЫЙ GITHUB WIDGET (100% ширины на телефоне) */}
              <div className="pointer-events-auto flex flex-col items-start w-full md:w-64 md:border-l border-gray-800 md:pl-4 cursor-auto md:cursor-none" onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)}>
                <h4 className="text-[10px] text-white tracking-[0.2em] uppercase mb-4 border-b border-gray-800 pb-2 w-full">GitHub / YSMLB</h4>

                <div className="relative h-20 md:h-24 w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={newsIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex flex-col gap-1 hover:opacity-70 transition-opacity"
                    >
                      <span className="text-[9px] text-[#00ffcc] tracking-widest">{githubProjects[newsIndex]?.date}</span>
                      <a href={githubProjects[newsIndex]?.url} target="_blank" rel="noreferrer" className="text-[10px] md:text-xs text-white uppercase tracking-wider font-bold truncate">
                        {githubProjects[newsIndex]?.title}
                      </a>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed line-clamp-2">
                        {githubProjects[newsIndex]?.desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* КОНТЕНТ РАЗДЕЛОВ */}
      <AnimatePresence mode="wait">
        {activeSection === 'bio' && (
          <motion.section
            key="bio"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }}
            className="absolute inset-0 z-30 flex items-center justify-center px-6 md:px-20 pointer-events-auto overflow-y-auto"
          >
            {/* Добавлен большой отступ сверху для мобилок, чтобы текст не залезал под меню */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mt-40 md:mt-0 pb-20 md:pb-0">

              <div>
                <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-6 md:mb-8">01 / Biography</h2>
                <h3 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 md:mb-8 text-white leading-snug">
                  Я создаю продукты, которые решают задачи через чистый код и глубокую логику.
                </h3>
                <p className="text-gray-400 font-light text-sm md:text-lg mb-4">
                  Full-stack разработка — это не просто написание строчек на Go или React. Это проектирование миров, которые работают безупречно.
                </p>
                <button onClick={() => setIsContactOpen(true)} onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className="group relative px-6 py-3 md:px-8 md:py-4 bg-white text-black font-medium overflow-hidden rounded-sm cursor-auto md:cursor-none pointer-events-auto mt-6 md:mt-10 text-sm md:text-base">
                  <span className="relative z-10">Связаться со мной</span>
                  <div className="absolute inset-0 bg-gray-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </button>
              </div>

              {/* ФОТО */}
              <div
                className="relative w-full aspect-square md:aspect-[4/5] bg-[#0a0a0a] rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center pointer-events-auto cursor-auto md:cursor-none mt-8 md:mt-0"
                onMouseEnter={() => { setIsCursorHovered(true); setIsPhotoHovered(true); }}
                onMouseLeave={() => { setIsCursorHovered(false); setIsPhotoHovered(false); }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMaskPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onClick={() => setIsPhotoClicked(!isPhotoClicked)}
              >
                <img
                  src="/my_photo.jpg"
                  alt="Amir Blurred"
                  className="absolute inset-0 w-full h-full object-cover grayscale blur-md opacity-60"
                />
                <img
                  src="/my_photo.jpg"
                  alt="Amir Clear"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{
                    WebkitMaskImage: isPhotoClicked
                      ? 'none'
                      : isPhotoHovered
                        ? `radial-gradient(circle 100px at ${maskPos.x}px ${maskPos.y}px, black 20%, transparent 100%)`
                        : 'none',
                    maskImage: isPhotoClicked
                      ? 'none'
                      : isPhotoHovered
                        ? `radial-gradient(circle 100px at ${maskPos.x}px ${maskPos.y}px, black 20%, transparent 100%)`
                        : 'none',
                    opacity: isPhotoClicked || isPhotoHovered ? 1 : 0
                  }}
                />
                {!isPhotoClicked && !isPhotoHovered && (
                  <p className="font-mono text-gray-400 text-[10px] md:text-xs tracking-[0.2em] uppercase z-10 pointer-events-none absolute mix-blend-difference text-center px-4">
                    [ HOVER TO REVEAL / CLICK TO OPEN ]
                  </p>
                )}
              </div>

            </div>
          </motion.section>
        )}

        {/* ПРОЕКТЫ */}
        {activeSection === 'projects' && (
          <motion.section
            key="projects"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }}
            className="absolute inset-0 z-30 overflow-y-auto pt-32 md:pt-32 px-6 md:px-20 pb-20 pointer-events-auto"
          >
            <div className="max-w-6xl mx-auto mt-12 md:mt-0">
              <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-8 md:mb-12">02 / Selected Works</h2>
              <div className="flex flex-col border-t border-gray-800/50">
                {projects.map((project) => (
                  <div key={project.id} onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className="group flex flex-col md:flex-row justify-between items-start md:items-center py-6 md:py-10 border-b border-gray-800/50 cursor-auto md:cursor-none hover:bg-white/5 transition-colors duration-500 px-4 md:px-6 -mx-4 md:-mx-6 rounded-lg pointer-events-auto">
                    <h4 className="text-xl md:text-4xl font-medium tracking-tight text-gray-400 group-hover:text-white transition-colors duration-300 flex items-center">
                      <span className="text-[10px] md:text-sm mr-4 text-gray-600 font-light font-mono mt-1 md:mt-0">0{project.id}</span>
                      {project.title}
                    </h4>
                    <div className="mt-2 md:mt-0 text-left md:text-right w-full md:w-auto pl-8 md:pl-0">
                      <p className="text-white font-mono uppercase tracking-[0.2em] text-[8px] md:text-xs mb-1 md:opacity-0 group-hover:opacity-100 transition-opacity">Launch</p>
                      <p className="text-gray-500 font-light uppercase tracking-widest text-[8px] md:text-[10px]">{project.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* МОДАЛКА КОНТАКТОВ */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto cursor-auto md:cursor-none px-4" onClick={() => setIsContactOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#050505] border border-gray-800 p-8 md:p-12 rounded-xl max-w-sm md:max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsContactOpen(false)} onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-4 text-gray-500 hover:text-white font-mono text-[10px] md:text-xs uppercase cursor-auto md:cursor-none pointer-events-auto">Close [x]</button>
              <h2 className="text-xl md:text-2xl font-medium mb-8 text-white">Initialize Connection</h2>
              <div className="flex flex-col gap-6 font-mono text-xs md:text-sm">

                <a href="mailto:amirsaga4@gmail.com?subject=Contact Request&body=Привет, Амир! Пишу с твоего портфолио." onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className="pointer-events-auto group block cursor-auto md:cursor-none">
                  <p className="text-gray-500 mb-1 transition-colors group-hover:text-[#00ffcc]">Email</p>
                  <p className="text-white transition-colors group-hover:text-gray-300 break-words">amirsaga4@gmail.com</p>
                </a>

                <a href="https://t.me/JAPYSM_vey?text=Привет,%20Амир!%20Пишу%20с%20твоего%20портфолио." target="_blank" rel="noreferrer" onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className="pointer-events-auto group block cursor-auto md:cursor-none">
                  <p className="text-gray-500 mb-1 transition-colors group-hover:text-[#00ffcc]">Telegram</p>
                  <p className="text-white transition-colors group-hover:text-gray-300">@JAPYSM_vey</p>
                </a>

                <a href="https://github.com/YSMLB" target="_blank" rel="noreferrer" onMouseEnter={() => setIsCursorHovered(true)} onMouseLeave={() => setIsCursorHovered(false)} className="pointer-events-auto group block cursor-auto md:cursor-none">
                  <p className="text-gray-500 mb-1 transition-colors group-hover:text-[#00ffcc]">GitHub</p>
                  <p className="text-white transition-colors group-hover:text-gray-300">github.com/YSMLB</p>
                </a>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}