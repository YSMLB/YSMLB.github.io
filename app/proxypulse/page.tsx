'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';

/* STREAMING_CHUNK:Defining the Earth ASCII map for continent projection... */
// 64x25 ASCII карта Земли. 'X' - материки (плотные точки), пробелы - океаны (редкие точки).
const EARTH_MAP = [
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                               XXXXXX                           ",
    "         XXXXX               XXXXXXXXXX                         ",
    "       XXXXXXXXX            XXXXXXXXXXXX     XX                 ",
    "      XXXXXXXXXXX           XXXXXXXXXXXXX   XXXX                ",
    "      XXXXXXXXXXXX          XXXXXXXXXXXXXX XXXXXX               ",
    "       XXXXXXXXXX           XXXXXXXXXXXXXXXXXXXX                ",
    "        XXXXXXXXX            XXXXXXXXXXXXXXXXXX                 ",
    "          XXXXX              XXXXXXXXXXXXXXXXX                  ",
    "           XXXX              XXXXXXXXXXXXXXXX                   ",
    "            XXX               XXXXXXXXXXXXXXX                   ",
    "            XXX                XXXXXXXXXXXXX                    ",
    "             XX                XXXXXXXXXXXX                     ",
    "             XX                 XXXXXXXX                        ",
    "                                 XXXXXX                         ",
    "                                  XXXX                          ",
    "                                                                ",
    "                                                                ",
    "                                               XXXX             ",
    "                 XXXX                        XXXXXXXX           ",
    "               XXXXXXXX                     XXXXXXXXXX          ",
    "                 XXXX                        XXXXXXXX           ",
    "                                                                "
];

/* STREAMING_CHUNK:Initializing the main morphing component and arrays... */
const MorphingParticles = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const scroll = useScroll();

    const { positions, targetPositions, colors, hollows, alphas } = useMemo(() => {
        const numPoints = 22000; // Оптимальное количество для читаемой текстуры

        const positions = new Float32Array(numPoints * 3);
        const targetPositions = new Float32Array(numPoints * 3);
        const colors = new Float32Array(numPoints * 3);
        const hollows = new Float32Array(numPoints);
        const alphas = new Float32Array(numPoints);

        const palette = [
            new THREE.Color('#ffb142'), // Золотой
            new THREE.Color('#ffd700'), // Желтый
            new THREE.Color('#ffb142'), // Золотой (повышаем шанс)
            new THREE.Color('#8c7ae6'), // Фиолетовый
            new THREE.Color('#4cd137'), // Зеленый
            new THREE.Color('#ffffff'), // Белый
        ];

        /* STREAMING_CHUNK:Calculating math for Brain and Planet morphologies... */
        for (let i = 0; i < numPoints; i++) {
            const i3 = i * 3;

            // ГЕНЕРАЦИЯ БАЗОВОЙ СФЕРЫ (Сфера Фибоначчи для равномерного распределения)
            const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            // Нормализованные координаты на сфере
            const nx = Math.sin(phi) * Math.cos(theta);
            const ny = Math.cos(phi);
            const nz = Math.sin(phi) * Math.sin(theta);

            // --- 1. ПЛАНЕТА ЗЕМЛЯ (Target) ---
            const planetRadius = 6.5;
            const offsetY = -4.0; // Сдвигаем планету сильно вниз, как на референсе
            const offsetX = 1.0;  // Немного вправо

            targetPositions[i3] = nx * planetRadius + offsetX;
            targetPositions[i3 + 1] = ny * planetRadius + offsetY;
            targetPositions[i3 + 2] = nz * planetRadius;

            // Проекция координат на карту материков
            const u = 0.5 + Math.atan2(nz, nx) / (2 * Math.PI);
            const v = 0.5 - Math.asin(ny) / Math.PI;
            const mapX = Math.floor(u * 64) % 64;
            const mapY = Math.floor(v * EARTH_MAP.length);
            const safeY = Math.max(0, Math.min(EARTH_MAP.length - 1, mapY));

            const isLand = EARTH_MAP[safeY][mapX] === 'X';

            // Логика Океана: оставляем только 10% точек в воде, остальные делаем прозрачными (alpha = 0)
            if (isLand) {
                alphas[i] = 1.0;
            } else {
                alphas[i] = Math.random() > 0.9 ? 0.4 : 0.0; // Редкая тусклая сетка в океане
            }

            // --- 2. ФОРМА МОЗГА (Source) ---
            let bx = nx;
            let by = ny;
            let bz = nz;

            const part = i / numPoints; // Распределяем точки по частям мозга

            if (part < 0.82) {
                // ОСНОВНЫЕ ПОЛУШАРИЯ (Cerebrum)
                bx *= 2.8;
                by *= 2.2;
                bz *= 3.6;

                // Разделение полушарий (продольная щель)
                const ax = Math.abs(bx);
                if (ax < 0.35 && by > -1.0) {
                    bx += Math.sign(bx) * (0.35 - ax); // Расталкиваем от центра
                }

                // Извилины (глубокий высокочастотный шум)
                const noise = Math.sin(bx * 3.5) * Math.sin(by * 3.5) * Math.sin(bz * 3.5);
                bx -= bx * noise * 0.15;
                by -= by * noise * 0.15;
                bz -= bz * noise * 0.15;

            } else if (part < 0.95) {
                // МОЗЖЕЧОК (Cerebellum) - сзади снизу
                bx = nx * 1.5;
                by = ny * 0.8 - 1.8;
                bz = nz * 1.5 + 1.8; // Сдвиг назад (+z)

                const cNoise = Math.sin(bx * 8) * Math.sin(by * 8) * Math.sin(bz * 8);
                bx -= bx * cNoise * 0.08;
            } else {
                // СТВОЛ МОЗГА (Brain stem) - снизу по центру
                bx = nx * 0.5;
                by = ny * 1.5 - 2.8; // Вытянут вниз
                bz = nz * 0.5 + 0.2;
            }

            // Общий наклон мозга для красивого ракурса
            positions[i3] = bx;
            positions[i3 + 1] = by * 0.95 - bz * 0.1; // Легкий наклон
            positions[i3 + 2] = bz * 0.95 + by * 0.1;

            // --- 3. ЦВЕТА И СТИЛИ ТРЕУГОЛЬНИКОВ ---
            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Половина треугольников "полые" внутри
            hollows[i] = Math.random() > 0.5 ? 1.0 : 0.0;
        }

        return { positions, targetPositions, colors, hollows, alphas };
    }, []);

    /* STREAMING_CHUNK:Setting up uniforms and animation frame... */
    const uniforms = useMemo(() => ({
        uProgress: { value: 0 },
        uTime: { value: 0 }
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            // Синхронизация прогресса морфинга со скроллом
            materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uProgress.value,
                scroll.offset,
                0.1
            );
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
        if (pointsRef.current) {
            // Медленное вращение модели
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
        }
    });

    /* STREAMING_CHUNK:Rendering shaders and component tree... */
    return (
        <group position={[2.5, 0, 0]}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                    <bufferAttribute attach="attributes-targetPosition" count={targetPositions.length / 3} array={targetPositions} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
                    <bufferAttribute attach="attributes-hollow" count={hollows.length} array={hollows} itemSize={1} />
                    <bufferAttribute attach="attributes-targetAlpha" count={alphas.length} array={alphas} itemSize={1} />
                </bufferGeometry>

                <shaderMaterial
                    ref={materialRef}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    uniforms={uniforms}
                    vertexShader={`
            uniform float uProgress;
            uniform float uTime;
            
            attribute vec3 targetPosition;
            attribute vec3 color;
            attribute float hollow;
            attribute float targetAlpha;
            
            varying vec3 vColor;
            varying float vHollow;
            varying float vAlpha;

            // Функция шума для создания "роя" при морфинге
            vec3 curlNoise(vec3 p) {
              return vec3(
                sin(p.y * 2.0 + uTime) * cos(p.z * 2.0),
                sin(p.z * 2.0 + uTime) * cos(p.x * 2.0),
                sin(p.x * 2.0 + uTime) * cos(p.y * 2.0)
              ) * 0.8;
            }

            void main() {
              vColor = color;
              vHollow = hollow;
              
              // Плавное исчезновение "лишних" точек в океане
              vAlpha = mix(1.0, targetAlpha, uProgress);
              
              // Турбулентность активна только во время перехода (скролла)
              float turbulence = sin(uProgress * 3.14159); 
              vec3 noise = curlNoise(position) * turbulence;
              
              vec3 pos = mix(position, targetPosition, uProgress) + noise;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              
              // Крупные, читаемые треугольники
              gl_PointSize = 35.0 * (1.0 / -mvPosition.z); 
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
                    fragmentShader={`
            varying vec3 vColor;
            varying float vHollow;
            varying float vAlpha;

            void main() {
              if (vAlpha < 0.05) discard; 

              vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
              
              // Поворачиваем треугольник
              float angle = 0.5; 
              float s = sin(angle), c = cos(angle);
              uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
              
              // Математика равностороннего треугольника
              float a = atan(uv.x, uv.y) + 3.14159;
              float r = 3.14159 * 2.0 / 3.0;
              float d = cos(floor(0.5 + a / r) * r - a) * length(uv);
              
              // Идеально острые края
              float alpha = 1.0 - step(0.45, d); 
              
              // Вырезаем центр для полых треугольников
              if (vHollow > 0.5) {
                alpha -= 1.0 - step(0.25, d);
              }
              
              if (alpha < 0.1) discard;
              
              gl_FragColor = vec4(vColor, alpha * vAlpha * 0.9);
            }
          `}
                />
            </points>
        </group>
    );
};

/* STREAMING_CHUNK:Main page component with HTML overlay... */
export default function Page() {
    return (
        <main className="w-full h-screen bg-[#070709] overflow-hidden relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <color attach="background" args={['#070709']} />

                <ScrollControls pages={2} damping={0.25}>
                    <MorphingParticles />

                    <Scroll html style={{ width: '100%' }}>
                        <div className="relative w-full h-[200vh] text-zinc-300 font-sans">

                            {/* НАВИГАЦИЯ */}
                            <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 md:px-16 lg:px-24 py-8 pointer-events-auto z-50">
                                <div className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
                                    <div className="w-5 h-5 flex flex-wrap gap-[1px]">
                                        <div className="w-[9px] h-[9px] bg-[#6c5ce7] rounded-tl-sm"></div>
                                        <div className="w-[9px] h-[9px] bg-[#4cd137] rounded-tr-sm"></div>
                                        <div className="w-[9px] h-[9px] bg-[#ffb142] rounded-bl-sm"></div>
                                        <div className="w-[9px] h-[9px] bg-white rounded-br-sm"></div>
                                    </div>
                                    Dala
                                </div>
                                <div className="hidden md:flex gap-8 text-[11px] font-bold tracking-widest items-center text-zinc-400">
                                    <a href="#" className="hover:text-white transition">MANIFESTO</a>
                                    <a href="#" className="hover:text-white transition">TEAM</a>
                                    <a href="#" className="hover:text-white transition">BLOG</a>
                                    <button className="bg-[#8c7ae6] text-white px-6 py-2.5 rounded-full hover:bg-[#7b6ad5] transition">
                                        REQUEST ACCESS
                                    </button>
                                </div>
                            </nav>

                            {/* ЭКРАН 1: МОЗГ */}
                            <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pointer-events-none">
                                <div className="max-w-2xl mt-12 pointer-events-auto relative z-10">
                                    <h1 className="text-6xl lg:text-8xl font-medium text-white mb-6 leading-[0.95] tracking-tight">
                                        Unlock <br />
                                        collective <br />
                                        wisdom.
                                    </h1>

                                    <div className="mt-12">
                                        <p className="text-[10px] text-[#ffb142] font-bold tracking-widest mb-4 uppercase">
                                            Stop managing knowledge. Start using it.
                                        </p>
                                        <p className="max-w-[400px] text-zinc-400 text-sm leading-relaxed mb-8 font-light">
                                            Plug into your team's shared brainpower. Ask Dala to instantly find anything or anyone from any workplace system. Focus on doing your best work with context, conviction and clarity.
                                        </p>
                                        <button className="bg-[#8c7ae6] text-white px-7 py-3 rounded-full text-xs font-bold tracking-wider hover:bg-[#7b6ad5] transition">
                                            REQUEST ACCESS
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ЭКРАН 2: ПЛАНЕТА */}
                            <div className="absolute top-[100vh] left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pointer-events-none">
                                <div className="max-w-xl pointer-events-auto relative z-10">
                                    <h2 className="text-5xl lg:text-6xl font-medium text-white mb-8 leading-tight tracking-tight">
                                        Build a better world <br /> of work
                                    </h2>
                                    <p className="max-w-[400px] text-zinc-400 text-sm leading-relaxed mb-6 font-light">
                                        Our mission is to make work more coherent and delightful—reframing productivity from <span className="text-zinc-200 italic font-medium">doing more</span> to <span className="text-[#ffb142] italic font-medium">being better</span>.
                                    </p>
                                    <p className="max-w-[400px] text-zinc-400 text-sm leading-relaxed mb-6 font-light">
                                        Your happiest and most purposeful moments at work are when you're in flow, intellectually alive and deeply connected to your team.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </Scroll>
                </ScrollControls>
            </Canvas>
        </main>
    );
}
