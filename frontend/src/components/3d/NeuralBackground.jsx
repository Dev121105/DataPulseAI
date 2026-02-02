import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// Draws the floating points
const Particles = ({ isThinking }) => {
    const ref = useRef();
    const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);

    useFrame((state, delta) => {
        if (ref.current) {
            let speed = 0.1;

            if (isThinking) {
                speed = 0.5;
                const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
                ref.current.scale.setScalar(pulse);
            } else {
                ref.current.scale.setScalar(1);
            }

            ref.current.rotation.x -= delta * (speed / 10);
            ref.current.rotation.y -= delta * (speed / 15);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={isThinking ? "#f97316" : "#ffffff"}
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={isThinking ? 0.8 : 0.4}
                />
            </Points>
        </group>
    );
};

// The background particle effects
const NeuralBackground = ({ isThinking = false }) => {
    return (
        <div className="absolute inset-0 -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Particles isThinking={isThinking} />
            </Canvas>
        </div>
    );
};

export default NeuralBackground;
