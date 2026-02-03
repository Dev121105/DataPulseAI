import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const ChartBar = ({ position, height, color, delay }) => {
    const ref = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 2 + delay) * 0.05;
        if (ref.current) {
            ref.current.scale.y = scale;
        }
    });

    return (
        <group position={position}>
            <RoundedBox ref={ref} args={[0.8, height, 0.2]} radius={0.05} position={[0, height / 2, 0]}>
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </RoundedBox>
        </group>
    );
};

const MouseLight = () => {
    const light = useRef();
    useFrame((state) => {
        if (light.current) {

            const mx = isNaN(state.mouse.x) ? 0 : state.mouse.x;
            const my = isNaN(state.mouse.y) ? 0 : state.mouse.y;

            const x = mx * 10;
            const y = my * 10;

            light.current.position.x = THREE.MathUtils.lerp(light.current.position.x, x, 0.1);
            light.current.position.y = THREE.MathUtils.lerp(light.current.position.y, y, 0.1);
        }
    });

    return (
        <pointLight ref={light} position={[0, 0, 8]} intensity={2} color="#ffffff" distance={20} decay={2} />
    );
};

const DashboardModel = () => {
    const group = useRef();

    useFrame((state) => {
        if (group.current) {
            const mx = isNaN(state.mouse.x) ? 0 : state.mouse.x;
            const my = isNaN(state.mouse.y) ? 0 : state.mouse.y;
            const x = (mx * 0.3);
            const y = (my * 0.3);
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x, 0.1);
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y, 0.1);
        }
    });

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>

                <RoundedBox args={[6, 4.5, 0.3]} radius={0.1} smoothness={2}>
                    <meshPhysicalMaterial
                        color="#334155"
                        roughness={0.4}
                        metalness={0.1}
                        clearcoat={0.3}
                    />
                </RoundedBox>

                <RoundedBox position={[-2.2, 1.5, 0.2]} args={[0.8, 0.8, 0.2]} radius={0.05}>
                    <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={0.2} />
                </RoundedBox>

                
                <group position={[0.5, 1.5, 0.2]}>
                    <RoundedBox position={[0, 0, -0.05]} args={[4, 1.0, 0.1]} radius={0.04}>
                        <meshStandardMaterial color="#1e293b" transparent opacity={0.5} />
                    </RoundedBox>
                    <RoundedBox position={[0, 0.2, 0.05]} args={[3.5, 0.15, 0.05]} radius={0.02}>
                        <meshStandardMaterial color="#334155" />
                    </RoundedBox>
                    <RoundedBox position={[-0.5, -0.2, 0.05]} args={[2.5, 0.15, 0.05]} radius={0.02}>
                        <meshStandardMaterial color="#334155" />
                    </RoundedBox>
                </group>

                <group position={[1.5, 0.2, 0.2]}>
                    <RoundedBox position={[0.8, 0, 0]} args={[0.6, 0.6, 0.1]} radius={0.04}>
                        <meshStandardMaterial color="#1e293b" />
                    </RoundedBox>
                    <RoundedBox position={[-0.5, 0, 0]} args={[1.8, 0.6, 0.1]} radius={0.04}>
                        <meshStandardMaterial color="#ea580c" />
                    </RoundedBox>
                </group>

               
                <group position={[-0.2, -1.2, 0.2]}>
                    <RoundedBox position={[0, 0, -0.05]} args={[5, 2, 0.1]} radius={0.04}>
                        <meshStandardMaterial color="#0f172a" transparent opacity={0.8} />
                    </RoundedBox>
                    <group position={[-1.5, -0.8, 0.1]}>
                        <ChartBar position={[0, 0, 0]} height={0.6} color="#fb923c" delay={0} />
                        <ChartBar position={[1, 0, 0]} height={1.2} color="#f97316" delay={0.5} />
                        <ChartBar position={[2, 0, 0]} height={1.7} color="#ea580c" delay={1} />
                        <ChartBar position={[3, 0, 0]} height={0.9} color="#fb923c" delay={1.5} />
                    </group>
                </group>

            </Float>
            <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={10} blur={2} far={4} resolution={256} />
        </group>
    );
};

const Showcase3D = () => {
    // Responsive camera position
    const [cameraZ, setCameraZ] = React.useState(6.5);

    React.useEffect(() => {
        const handleResize = () => {
            // Move camera back on smaller screens to fit the model
            setCameraZ(window.innerWidth < 768 ? 9 : 6.5);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-full h-full min-h-[300px] md:min-h-[400px]">
            <Canvas camera={{ position: [0, 0, cameraZ], fov: 45 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
                {/* 1. Base Visibility: Ambient Light (Soft fill) */}
                <ambientLight intensity={0.8} />

                {/* 2. Main Key Light: Fixed soft white light from top-left */}
                <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#ffffff" />

                {/* 3. Rim Light: Strong Orange backlight to separate from background */}
                <spotLight position={[10, 10, -5]} intensity={10} color="#ea580c" angle={0.5} penumbra={1} distance={20} />

                {/* 4. Interactive Mouse Light (Subtle flash interaction) */}
                <MouseLight />

                <DashboardModel />
            </Canvas>
        </div>
    );
};

export default React.memo(Showcase3D);
