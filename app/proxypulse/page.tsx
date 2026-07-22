'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';

const MorphingParticles = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const scroll = useScroll();

    // Генерация геометрии: Полый Мозг -> Планета Земля
    const { positions, targetPositions, colors } = useMemo(() => {
        const maxParticles = 20000; // Уменьшили плотность для "воздушности" и пустоты внутри
        const posArray: number[] = [];
        const targetArray: number[] = [];
        const colorArray: number[] = [];

        const colorPalette = [
            new THREE.Color('#ffb142'), // Золотой
            new THREE.Color('#ffd700'), // Ярко-желтый
            new THREE.Color('#ffb142'), // Снова золотой
            new THREE.Color('#8c7ae6'), // Фиолетовый
            new THREE.Color('#4cd137'), // Зеленый
            new THREE.Color('#f5f6fa'), // Белый
        ];

        // --- 1. ГЕНЕРАЦИЯ ПОЛОГО МОЗГА ---
        let pCount = 0;
        while (pCount < maxParticles) {
            let x, y, z;
            const isCerebrum = Math.random() > 0.15; // 85% точек на главное полушарие, 15% на мозжечок

            let theta = Math.random() * 2 * Math.PI;
            let phi = Math.acos(2 * Math.random() - 1);

            if (isCerebrum) {
                // Базовая сфера, вытянутая в эллипсоид
                x = Math.sin(phi) * Math.cos(theta) * 3.6;
                y = Math.sin(phi) * Math.sin(theta) * 2.8;
                z = Math.cos(phi) * 4.2;

                // Разделение полушарий (продольная щель)
                if (Math.abs(x) < 0.25 + (y + 2.8) * 0.05 && z > -2.0) continue;

                // Создание извилин (вдавливаем поверхность внутрь с помощью 3D синусоид)
                const foldNoise = Math.sin(x * 2.5) * Math.cos(y * 2.5) * Math.sin(z * 2.5);
                if (foldNoise > 0.1) {
                    // Вдавливаем точку ближе к центру
                    const indent = 1.0 - (foldNoise * 0.4);
                    x *= indent;
                    y *= indent;
                    z *= indent;
                }
            } else {
                // Мозжечок (Cerebellum) - сзади снизу
                x = Math.sin(phi) * Math.cos(theta) * 1.5;
                y = Math.sin(phi) * Math.sin(theta) * 1.0 - 2.2;
                z = Math.cos(phi) * 1.5 - 2.5;
            }

            posArray.push(x, y, z);
            pCount++;
        }

        // --- 2. ГЕНЕРАЦИЯ ПЛАНЕТЫ (С материками и океанами) ---
        let tCount = 0;
        const planetRadius = 4.5;

        while (tCount < maxParticles) {
            let theta = Math.random() * 2 * Math.PI;
            let phi = Math.acos(2 * Math.random() - 1);

            let nx = Math.sin(phi) * Math.cos(theta);
            let ny = Math.sin(phi) * Math.sin(theta);
            let nz = Math.cos(phi);

            // Простая имитация 3D шума Перлина для формирования континентов
            let continentNoise = Math.sin(nx * 3.0) + Math.sin(ny * 4.0) + Math.sin(nz * 3.0);
            continentNoise += Math.sin(nx * 7.0) * 0.5 + Math.sin(ny * 7.0) * 0.5;

            // Если noise высокий -> это суша (плотно). Если низкий -> океан (очень редко)
            const isLand = continentNoise > 0.3;
            const isOceanGrid = Math.random() < 0.04; // 4% точек оставляем в океане для легкой сетки

            if (isLand || isOceanGrid) {
                targetArray.push(nx * planetRadius, ny * planetRadius, nz * planetRadius);
                tCount++;

                // --- 3. ЦВЕТА ---
                // Равномерно раздаем цвета из палитры
                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colorArray.push(color.r, color.g, color.b);
            }
        }

        return {
            positions: new Float32Array(posArray),
            targetPositions: new Float32Array(targetArray),
            colors: new Float32Array(colorArray),
        };
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
            // Медленное вращение
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
            
            varying vec3 vColor;

            vec3 curlNoise(vec3 p) {
              return vec3(
                sin(p.y * 2.0 + uTime) * cos(p.z * 2.0),
                sin(p.z * 2.0 + uTime) * cos(p.x * 2.0),
                sin(p.x * 2.0 + uTime) * cos(p.y * 2.0)
              ) * 0.5;
            }

            void main() {
              vColor = color;
              
              // Турбулентность при морфинге
              float turbulence = sin(uProgress * 3.14159); 
              vec3 noise = curlNoise(position) * turbulence;
              
              vec3 pos = mix(position, targetPosition, uProgress) + noise;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              
              // Размер зависит от глубины
              gl_PointSize = 16.0 * (1.0 / -mvPosition.z); 
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
                    fragmentShader={`
            varying vec3 vColor;
            void main() {
              // Треугольная форма
              vec2 st = gl_PointCoord * 2.0 - 1.0;
              // Поворачиваем треугольник, чтобы он смотрел вверх
              float a = atan(st.x, -st.y) + 3.14159; 
              float r = 3.14159 * 2.0 / 3.0;
              float d = cos(floor(0.5 + a / r) * r - a) * length(st);
              
              float alpha = 1.0 - smoothstep(0.3, 0.6, d);
              
              if (alpha < 0.05) discard;
              
              gl_FragColor = vec4(vColor, alpha * 0.9);
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
            <Canvas camera={{ position: [0, 0, 11], fov: 60 }}>
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

                            {/* ЭКРАН 1 */}
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

                            {/* ЭКРАН 2 */}
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
