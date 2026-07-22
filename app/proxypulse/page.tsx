'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const BrainParticles = () => {
    const pointsRef = useRef<THREE.Points>(null);

    // Генерация органической формы мозга через математическое отсечение объема
    const { positions, colors } = useMemo(() => {
        const posArray: number[] = [];
        const colorArray: number[] = [];

        // Палитра как на референсе: много золотого, вкрапления фиолетового, зеленого и белого
        const colorPalette = [
            new THREE.Color('#ffb142'), // Золотой
            new THREE.Color('#ffd700'), // Ярко-желтый
            new THREE.Color('#ffb142'), // Снова золотой (чтобы выпадал чаще)
            new THREE.Color('#8c7ae6'), // Фиолетовый
            new THREE.Color('#4cd137'), // Зеленый
            new THREE.Color('#f5f6fa'), // Белый
        ];

        let attempts = 0;
        const maxParticles = 60000; // Плотное облако точек

        // Генерируем точки, пока не наберем нужное количество (или не превысим лимит попыток)
        while (posArray.length < maxParticles * 3 && attempts < 1500000) {
            attempts++;

            // Случайная точка в пределах ограничивающего куба
            const x = (Math.random() - 0.5) * 9;
            const y = (Math.random() - 0.5) * 7;
            const z = (Math.random() - 0.5) * 10;

            // 1. Основной объем (Cerebrum) - вытянутый эллипсоид
            const cerebrum = (x * x) / (3.2 * 3.2) + (y * y) / (2.6 * 2.6) + (z * z) / (4.2 * 4.2);

            // 2. Мозжечок (Cerebellum) - сзади снизу
            const cerebellum = (x * x) / (2.2 * 2.2) + Math.pow(y + 2.0, 2) / (1.2 * 1.2) + Math.pow(z + 2.2, 2) / (1.8 * 1.8);

            // 3. Ствол мозга (Brain stem) - по центру снизу
            const stem = (x * x) / (0.8 * 0.8) + Math.pow(y + 3.0, 2) / (2.0 * 2.0) + Math.pow(z + 0.5, 2) / (1.0 * 1.0);

            // Проверяем, попадает ли точка внутрь любой из частей мозга
            if (cerebrum <= 1 || cerebellum <= 1 || stem <= 1) {

                // --- ФОРМИРОВАНИЕ РЕЛЬЕФА ---

                // Продольная щель (разделение на два полушария)
                // Чем выше точка, тем шире щель
                const gapWidth = 0.15 + Math.max(0, y * 0.08);
                if (cerebrum <= 1 && Math.abs(x) < gapWidth && y > -1.5 && z > -3.5) {
                    continue; // Отсекаем точки в центре
                }

                // Имитация извилин и борозд (Gyri & Sulci) с помощью 3D синусоид (шума)
                const foldNoise = Math.sin(x * 5.0) * Math.cos(y * 5.0) * Math.sin(z * 5.0);
                const macroNoise = Math.sin(x * 2.5) * Math.sin(y * 2.5) * Math.sin(z * 2.5);

                // Применяем "вмятины" только ближе к поверхности основного объема
                const distToSurface = Math.max(0, 1 - cerebrum);
                if (cerebrum <= 1 && distToSurface < 0.35) {
                    // Если точка попала во "впадину" шума - отбрасываем её
                    if (foldNoise > 0.2 + distToSurface) continue;
                    if (macroNoise > 0.6) continue;
                }

                // Точка прошла все проверки — добавляем в массив
                posArray.push(x, y, z);

                // Выбираем случайный цвет из палитры
                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colorArray.push(color.r, color.g, color.b);
            }
        }

        return {
            positions: new Float32Array(posArray),
            colors: new Float32Array(colorArray),
        };
    }, []);

    // Медленное вращение мозга для эффекта жизни
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
            </bufferGeometry>

            <shaderMaterial
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexShader={`
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Размер частиц зависит от отдаления камеры (перспектива)
            gl_PointSize = 12.0 * (1.0 / -mvPosition.z); 
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
                fragmentShader={`
          varying vec3 vColor;
          void main() {
            // Делаем частицу круглой с мягкими краями (эффект свечения/bloom)
            float distance = length(gl_PointCoord - vec2(0.5));
            float alpha = 1.0 - smoothstep(0.1, 0.5, distance);
            
            if (alpha < 0.01) discard;
            
            gl_FragColor = vec4(vColor, alpha * 0.9);
          }
        `}
            />
        </points>
    );
};

export default function Page() {
    return (
        <main className="w-full h-screen bg-[#050505] overflow-hidden relative">
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
                <color attach="background" args={['#050505']} />

                <BrainParticles />

                {/* OrbitControls позволяет крутить мозг мышкой. 
            Если не нужно - просто удали эту строку */}
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            {/* Поверхностный UI (Навигация) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-center px-8 md:px-16 lg:px-32">
                <nav className="absolute top-8 w-full flex justify-between items-center pr-16 lg:pr-32 pointer-events-auto">
                    <div className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
                        <span className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 block rounded-sm"></span>
                        Dala
                    </div>
                    <div className="hidden md:flex gap-8 text-xs font-semibold tracking-wider items-center text-zinc-400">
                        <a href="#" className="hover:text-white transition">MANIFESTO</a>
                        <a href="#" className="hover:text-white transition">TEAM</a>
                        <a href="#" className="hover:text-white transition">BLOG</a>
                        <button className="bg-[#6c5ce7] text-white px-6 py-2.5 rounded-full hover:bg-[#5b4bc4] transition">
                            REQUEST ACCESS
                        </button>
                    </div>
                </nav>

                <div className="max-w-2xl mt-12 pointer-events-auto z-10">
                    <h1 className="text-6xl lg:text-8xl font-medium text-white mb-6 leading-[1.05] tracking-tight drop-shadow-lg">
                        Unlock <br />
                        collective <br />
                        wisdom.
                    </h1>
                    <button className="bg-[#6c5ce7] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#5b4bc4] transition mt-4">
                        REQUEST ACCESS
                    </button>
                </div>
            </div>
        </main>
    );
}