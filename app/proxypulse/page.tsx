'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';

const ParticleMorph = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const scroll = useScroll();

    // Генерация геометрии: мозг переходит в планету
    const { positions, targetPositions, colorsStart, colorsEnd } = useMemo(() => {
        const count = 25000;
        const positions = new Float32Array(count * 3);
        const targetPositions = new Float32Array(count * 3);
        const colorsStart = new Float32Array(count * 3);
        const colorsEnd = new Float32Array(count * 3);

        // Приглушенные цвета для мягкого свечения
        const colorBrain = new THREE.Color('#7b6bb3');
        const colorPlanet = new THREE.Color('#b39134');
        const colorAccent = new THREE.Color('#2d7a9e');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // 1. Форма "Мозга" (аппроксимация через эллипсоид с двумя долями)
            const r = 2.5 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            let x = r * Math.sin(phi) * Math.cos(theta);
            let y = r * Math.sin(phi) * Math.sin(theta) * 0.8;
            let z = r * Math.cos(phi) * 1.2;

            if (x > 0) x += 0.2;
            else x -= 0.2;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // 2. Форма "Планеты" (сфера)
            const rPlanet = 3;
            const thetaPlanet = Math.random() * 2 * Math.PI;
            const phiPlanet = Math.acos(2 * Math.random() - 1);

            targetPositions[i3] = rPlanet * Math.sin(phiPlanet) * Math.cos(thetaPlanet);
            targetPositions[i3 + 1] = rPlanet * Math.sin(phiPlanet) * Math.sin(thetaPlanet);
            targetPositions[i3 + 2] = rPlanet * Math.cos(phiPlanet);

            // 3. Заливка цветом (коэффициент 0.75 для приглушенности)
            const mixedStart = colorBrain.clone().lerp(colorAccent, Math.random() * 0.5);
            colorsStart[i3] = mixedStart.r * 0.75;
            colorsStart[i3 + 1] = mixedStart.g * 0.75;
            colorsStart[i3 + 2] = mixedStart.b * 0.75;

            const mixedEnd = colorPlanet.clone().lerp(colorAccent, Math.random() * 0.3);
            colorsEnd[i3] = mixedEnd.r * 0.75;
            colorsEnd[i3 + 1] = mixedEnd.g * 0.75;
            colorsEnd[i3 + 2] = mixedEnd.b * 0.75;
        }

        return { positions, targetPositions, colorsStart, colorsEnd };
    }, []);

    // Синхронизация прогресса морфинга со скроллом страницы
    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uProgress.value = scroll.offset;
        }
    });

    const uniforms = useMemo(() => ({ uProgress: { value: 0 } }), []);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-targetPosition" count={targetPositions.length / 3} array={targetPositions} itemSize={3} />
                <bufferAttribute attach="attributes-colorStart" count={colorsStart.length / 3} array={colorsStart} itemSize={3} />
                <bufferAttribute attach="attributes-colorEnd" count={colorsEnd.length / 3} array={colorsEnd} itemSize={3} />
            </bufferGeometry>

            <shaderMaterial
                ref={materialRef}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={uniforms}
                vertexShader={`
          uniform float uProgress;
          attribute vec3 targetPosition;
          attribute vec3 colorStart;
          attribute vec3 colorEnd;
          varying vec3 vColor;

          void main() {
            vec3 pos = mix(position, targetPosition, uProgress);
            vColor = mix(colorStart, colorEnd, uProgress);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 6.0 * (1.0 / -mvPosition.z); // Размер зависит от глубины
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
                fragmentShader={`
          varying vec3 vColor;
          
          void main() {
            // Округление частиц
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;
            
            // Полупрозрачность для создания эффекта матового свечения
            gl_FragColor = vec4(vColor, 0.65);
          }
        `}
            />
        </points>
    );
};

export default function Page() {
    return (
        <main className="w-full h-screen bg-[#0a0a0a] overflow-hidden">
            <Canvas camera={{ position: [0, 0, 9], fov: 60 }}>
                <color attach="background" args={['#0a0a0a']} />

                {/* pages={2} резервирует высоту скролла в два экрана */}
                <ScrollControls pages={2} damping={0.25}>
                    <ParticleMorph />

                    <Scroll html style={{ width: '100%' }}>
                        <div className="relative w-full h-[200vh] text-zinc-300 font-sans">

                            {/* Экран 1: Мозг */}
                            <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-32 pointer-events-none">
                                <nav className="absolute top-8 w-full flex justify-between items-center pr-16 lg:pr-32 pointer-events-auto">
                                    <div className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
                                        <span className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 block rounded-sm"></span>
                                        Dala
                                    </div>
                                    <div className="hidden md:flex gap-8 text-xs font-semibold tracking-wider items-center">
                                        <a href="#" className="hover:text-white transition">MANIFESTO</a>
                                        <a href="#" className="hover:text-white transition">TEAM</a>
                                        <a href="#" className="hover:text-white transition">BLOG</a>
                                        <button className="bg-[#6c5ce7] text-white px-6 py-2.5 rounded-full hover:bg-[#5b4bc4] transition">
                                            REQUEST ACCESS
                                        </button>
                                    </div>
                                </nav>

                                <div className="max-w-2xl mt-12 pointer-events-auto">
                                    <h1 className="text-6xl lg:text-8xl font-medium text-white mb-6 leading-[1.05] tracking-tight">
                                        Unlock <br />
                                        collective <br />
                                        wisdom.
                                    </h1>
                                    <p className="text-xs text-[#b39134] font-bold tracking-widest mb-4 uppercase">
                                        Stop managing knowledge. Start using it.
                                    </p>
                                    <p className="max-w-sm text-zinc-400 text-base leading-relaxed mb-8">
                                        Plug into your team's shared brainpower. Ask Dala to instantly find anything or anyone from any workplace system.
                                    </p>
                                    <button className="bg-[#6c5ce7] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#5b4bc4] transition">
                                        REQUEST ACCESS
                                    </button>
                                </div>
                            </div>

                            {/* Экран 2: Планета */}
                            <div className="absolute top-[100vh] left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-32 pointer-events-none">
                                <div className="max-w-xl pointer-events-auto">
                                    <h2 className="text-5xl lg:text-6xl font-medium text-white mb-6 leading-tight tracking-tight">
                                        Build a better world of work
                                    </h2>
                                    <p className="text-zinc-400 text-base leading-relaxed mb-6">
                                        Our mission is to make work more coherent and delightful—reframing productivity from <span className="text-zinc-200 italic">doing more</span> to <span className="text-[#b39134] italic font-medium">being better</span>.
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