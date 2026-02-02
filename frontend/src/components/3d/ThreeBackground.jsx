import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

const NeuralNetwork = ({ count = 30, connections = 40 }) => {
    const group = useRef();

    // Generate random points
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 12;
            const y = (Math.random() - 0.5) * 12;
            const z = (Math.random() - 0.5) * 12;
            temp.push(new THREE.Vector3(x, y, z));
        }
        return temp;
    }, [count]);

    // Generate connections based on distance
    const lines = useMemo(() => {
        const temp = [];
        // Simple strategy: connect each point to its 2 nearest neighbors
        particles.forEach((p1, i) => {
            let neighbors = [];
            particles.forEach((p2, j) => {
                if (i !== j) {
                    const dist = p1.distanceTo(p2);
                    neighbors.push({ p2, dist });
                }
            });
            // Sort by distance
            neighbors.sort((a, b) => a.dist - b.dist);
            // Connect to closest 2
            neighbors.slice(0, 2).forEach(n => {
                temp.push([p1, n.p2]);
            });
        });
        return temp;
    }, [particles]);

    useFrame((state) => {
        if (group.current) {
            // Gentle continuous rotation
            group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
        }
    });

    return (
        <group ref={group}>
            {particles.map((pos, i) => (
                <Sphere key={i} position={pos} args={[0.08, 10, 10]}>
                    <meshStandardMaterial
                        color={new THREE.Color("#f97316")}
                        emissive="#f97316"
                        emissiveIntensity={0.8}
                        roughness={0.5}
                    />
                </Sphere>
            ))}
            {lines.map((line, i) => (
                <Line
                    key={i}
                    points={line}
                    color="#f97316"
                    transparent
                    opacity={0.15}
                    lineWidth={1}
                />
            ))}
        </group>
    );
};

const ThreeBackground = () => {
    return (
        <div className="absolute inset-0 z-0 opacity-60">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#fb923c" />
                <NeuralNetwork />
                {/* Reduced fog density for performance */}
                <fog attach="fog" args={['#000000', 5, 25]} />
            </Canvas>
        </div>
    );
};

export default React.memo(ThreeBackground);
