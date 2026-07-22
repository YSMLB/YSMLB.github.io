'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';

// 64x20 ASCII карта Земли. 'X' - материки, пробелы - океан.
const EARTH_MAP = [
    "                                                                ",
    "        XXXXXXX                  XXXXXXXXXXXXX                  ",
    "      XXXXXXXXXXXX             XXXXXXXXXXXXXXXXX                ",
    "     XXXXXXXXXXXXXX           XXXXXXXXXXXXXXXXXXX               ",
    "    XXXXXXXXXXXXXXXX          XXXXXXXXXXXXXXXXXXXX              ",
    "     XXXXXXXXXXXXXXX          XXXXXXXXXXXXXXXXXXXX              ",
    "       XXXXXXXXXXXXX         XXXXXXXXXXXXXXXXXXXXX              ",
    "          XXXXXXXXX          XXXXXXXXXXXXXXXXXXXXX              ",
    "            XXXXXX           XXXXXXXXXXXXXXXXXXXX               ",
    "             XXXXX            XXXXXXXXXXXXXXXXXXX               ",
    "              XXXX            XXXXXXXXXXXXXXXXXX     XX         ",
    "              XXXX             XXXXXXXXXXXXXXX      XXXX        ",
    "               XXX             XXXXXXXXXXXXXX       XXXXX       ",
    "               XXX             XXXXXXXXXXXX         XXXXX       ",
    "                XX              XXXXXXXX             XXXX       ",
    "                XX               XXXXXX               XXX       ",
    "                 X                XXXX                          ",
    "                                   XX                           ",
    "                                                                ",
    "                                                                "
];

const MorphingParticles = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const scroll = useScroll();

    const { positions, targetPositions, colors, hollows, alphas } = useMemo(() => {
        const numPoints = 25000; // Оптимально для четкой текстуры

        const positions = new Float32Array(numPoints * 3);
        const targetPositions = new Float32Array(numPoints * 3);
        const colors = new Float32Array(numPoints * 3);
        const hollows = new Float32Array(numPoints);
        const alphas = new Float32Array(numPoints); // Прозрачность для планеты (океаны скрываем)

        const palette = [
            new THREE.Color('#ffb142'), // Золотой
            new THREE.Color('#ffd700'), // Желтый
            new THREE.Color('#ffb142'), // Золотой
            new THREE.Color('#8c7ae6'), // Фиолетовый
            new THREE.Color('#4cd137'), // Зеленый
            new THREE.Color('#ffffff'), // Белый
        ];

        for (let i = 0; i < numPoints; i++) {
            const i3 = i * 3;

            // 1. БАЗОВАЯ РАССТАНОВКА (Сфера Фибоначчи - дает идеальную равномерную сетку)
            const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

            const r = 4.2; // Базовый радиус
            let x = r * Math.sin(phi) * Math.cos(theta);
            let y = r * Math.cos(phi);
            let z = r * Math.sin(phi) * Math.sin(theta);

            // --- ГЕНЕРАЦИЯ ЗЕМЛИ (TARGET) ---
            targetPositions[i3] = x;
            targetPositions[i3 + 1] = y;
            targetPositions[i3 + 2] = z;

            // Вычисляем UV координаты для проекции карты материков
            const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI);
            const v = 0.5 - Math.asin(y / r) / Math.PI;

            const mapX = Math.floor(u * 64);
            const mapY = Math.floor(v * 20);
            const safeX = Math.max(0, Math.min(63, mapX));
            const safeY = Math.max(0, Math.min(19, mapY));

            // Если точка попала на букву 'X' - это суша, оставляем видимой. 
            const isLand = EARTH_MAP[safeY][safeX] === 'X';
            alphas[i] = isLand ? 1.0 : 0.0; // В форме Земли океан будет полностью прозрачным

            // --- ГЕНЕРАЦИЯ МОЗГА (START) ---
            let bx = x;
            let by = y;
            let bz = z;

            // Сплющиваем сферу в форму мозга
            bx *= 0.75;
            by *= 0.85;
            bz *= 1.15;

            // Разделение полушарий (продольная щель)
            const distFromCenter = Math.abs(bx);
            if (distFromCenter < 0.6 && by > -1.5) {
                // Расталкиваем точки от центра
                bx += (bx > 0 ? 1 : -1) * (0.6 - distFromCenter);
            }

            // Математические извилины (Gyri) - вдавливаем сетку
            const noise = Math.sin(bx * 4.5) * Math.cos(by * 4.5) * Math.sin(bz * 4.5);
            const indent = 1.0 - Math.max(0, noise * 0.18);
            bx *= indent;
            by *= indent;
            bz *= indent;

            // Сужаем к низу и к передней части
            if (by < 0) bx *= (1.0 + by * 0.15);
            if (bz > 0) {
                bx *= (1.0 - bz * 0.1);
                by *= (1.0 - bz * 0.1);
            }

            positions[i3] = bx;
            positions[i3 + 1] = by;
            positions[i3 + 2] = bz;

            // --- ЦВЕТА И ТЕКСТУРА ---
            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Половина треугольников будут "пустыми" внутри (как на макете)
            hollows[i] = Math.random() > 0.5 ? 1.0 : 0.0;
        }

        return { positions, targetPositions, colors, hollows, alphas };
    }, []);

    const uniforms = useMemo(() => ({
        uProgress: { value: 0 },
        uTime: { value: 0 }
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uProgress.value,
                scroll.offset,
                0.1
            );
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

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

            vec3 curlNoise(vec3 p) {
              return vec3(
                sin(p.y * 2.0 + uTime) * cos(p.z * 2.0),
                sin(p.z * 2.0 + uTime) * cos(p.x * 2.0),
                sin(p.x * 2.0 + uTime) * cos(p.y * 2.0)
              ) * 0.5;
            }

            void main() {
              vColor = color;
              vHollow = hollow;
              
              // Для мозга прозрачность 1.0 (виден весь), для Земли берем targetAlpha (океаны исчезают)
              vAlpha = mix(1.0, targetAlpha, uProgress);
              
              // Вихревое движение частиц во время скролла
              float turbulence = sin(uProgress * 3.14159); 
              vec3 noise = curlNoise(position) * turbulence;
              
              // Плавный переход формы
              vec3 pos = mix(position, targetPosition, uProgress) + noise;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              
              gl_PointSize = 12.0 * (1.0 / -mvPosition.z); 
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
                    fragmentShader={`
            varying vec3 vColor;
            varying float vHollow;
            varying float vAlpha;

            void main() {
              if (vAlpha < 0.05) discard; // Прячем точки океана

              // Четкая математика треугольника
              vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
              
              // Легкий поворот треугольников
              float angle = 0.5; 
              float s = sin(angle), c = cos(angle);
              uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
              
              float a = atan(uv.x, uv.y) + 3.14159;
              float r = 3.14159 * 2.0 / 3.0;
              float d = cos(floor(0.5 + a / r) * r - a) * length(uv);
              
              // Острые, пиксельно-четкие края (никакого мыла)
              float alpha = step(d, 0.45); 
              
              // Вырезаем серединку, если это контурный треугольник
              if (vHollow > 0.5) {
                float inner = step(d, 0.25);
                alpha -= inner;
              }
              
              if (alpha < 0.1) discard;
              
              // Итоговый цвет с учетом прозрачности при морфинге
              gl_FragColor = vec4(vColor, alpha * vAlpha);
            }
          `}
                />
            </points>
        </group>
    );
};

export default function Page() {
    return (
        <main className="w-full h-screen bg-[#070709] overflow-hidden relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <color attach="background" args={['#070709']} />

                <ScrollControls pages={2} damping={0.3}>
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
