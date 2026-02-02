import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, useCursor } from '@react-three/drei';
import * as THREE from 'three';

// The actual 3D drawing of the bot
const BotIcon3D = ({ blinkInterval = 3, isLoader = false, isThinking = false }) => {
    const group = useRef();
    const eyesRef = useRef();
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    const startTimeRef = useRef(null);
    const lookAtTarget = useRef(new THREE.Vector3(0, 0, 5));

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (startTimeRef.current === null) startTimeRef.current = time;
        const localTime = time - startTimeRef.current;

        if (group.current) {
            let desiredTarget = new THREE.Vector3(0, 0, 5);

            if (isThinking) {
                // THINKING MODE
                const swayX = Math.sin(time * 2) * 1.5;
                const swayY = Math.sin(time * 1.5) * 0.5;
                desiredTarget.set(swayX, swayY, 5);
            } else if (isLoader) {
                // Loader Sequence:
                // 0s - 2.2s: Look Forward
                // 2.2s+: Look Slightly Right (Smoothly)
                if (localTime > 2.2) {
                    desiredTarget.set(2, 0, 5);
                }
            } else {
                // Default: Track Mouse
                const x = state.mouse.x * 1.5;
                const y = state.mouse.y * 1.5;
                desiredTarget.set(x, y, 4);
            }

            lookAtTarget.current.lerp(desiredTarget, 0.1);
            group.current.lookAt(lookAtTarget.current);
        }

        if (eyesRef.current) {
            let scaleY = 1;
            let posX = 0;

            if (isThinking) {

                scaleY = 1.0;

                posX = Math.sin(time * 8) * 0.15;
            } else if (isLoader) {
                if (localTime > 1.2 && localTime < 1.35) {
                    scaleY = 0.1;
                } else if (localTime > 1.5 && localTime < 1.65) {
                    scaleY = 0.1;
                }
            } else {
                // Standard Continuous Blinking
                const t = time % blinkInterval;
                const blinkDur = 0.15;
                if (t < blinkDur) {
                    scaleY = THREE.MathUtils.lerp(1, 0.1, t / blinkDur);
                } else if (t < blinkDur * 2) {
                    scaleY = THREE.MathUtils.lerp(0.1, 1, (t - blinkDur) / blinkDur);
                }
            }

            // Blink Animation
            eyesRef.current.scale.y = THREE.MathUtils.lerp(eyesRef.current.scale.y, scaleY, 0.5);

            // Eye Position (Scanning or Centered)
            eyesRef.current.position.x = THREE.MathUtils.lerp(eyesRef.current.position.x, posX, 0.2);
        }
    });

    const materialWhite = <meshStandardMaterial color="white" roughness={0.4} metalness={0.2} />;
    const materialOrange = <meshBasicMaterial color="#ea580c" />;

    return (
        <group ref={group}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <RoundedBox args={[1.6, 1.4, 0.3]} radius={0.3} smoothness={4}>
                {materialWhite}
            </RoundedBox>

            <RoundedBox args={[1.2, 1.0, 0.32]} radius={0.15} smoothness={4} position={[0, 0, 0.02]}>
                {materialOrange}
            </RoundedBox>

            <mesh position={[0, 0.85, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.4]} />
                {materialWhite}
            </mesh>
            <RoundedBox args={[0.5, 0.15, 0.15]} radius={0.05} position={[0, 1.0, 0]}>
                {materialWhite}
            </RoundedBox>

            <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.1, 0.3]} />
                {materialWhite}
            </mesh>
            <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.1, 0.3]} />
                {materialWhite}
            </mesh>

            <group ref={eyesRef} position={[0, 0.1, 0.2]}>
                <RoundedBox args={[0.18, 0.3, 0.1]} radius={0.05} position={[-0.3, 0, 0]}>
                    {materialWhite}
                </RoundedBox>
                <RoundedBox args={[0.18, 0.3, 0.1]} radius={0.05} position={[0.3, 0, 0]}>
                    {materialWhite}
                </RoundedBox>
            </group>

        </group>
    );
};

// The 3D robot face component
const Logo3D = ({ className = "w-12 h-12", blinkInterval = 3, customBlinkMode = 'single', isLoader = false, isThinking = false }) => {
    return (
        <div className={className}>
            <Canvas camera={{ position: [0, 0, 2.1] }} dpr={[1, 2]} gl={{ alpha: true }}>
                <ambientLight intensity={1.2} />
                <pointLight position={[5, 10, 5]} intensity={1.0} />
                <BotIcon3D blinkInterval={blinkInterval} isLoader={isLoader} isThinking={isThinking} />
            </Canvas>
        </div>
    );
};

export default Logo3D;
