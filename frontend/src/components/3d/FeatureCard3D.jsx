import React, { useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Center } from '@react-three/drei';

// 1. REALTIME -> Bar Chart Icon
const BarChart3D = ({ color }) => {
    const group = useRef();
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
    });

    return (
        <group ref={group}>
            {/* Three bars of increasing height */}
            <RoundedBox position={[-0.6, -0.4, 0]} args={[0.4, 0.8, 0.2]} radius={0.05}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>
            <RoundedBox position={[0, 0, 0]} args={[0.4, 1.6, 0.2]} radius={0.05}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>
            <RoundedBox position={[0.6, 0.2, 0]} args={[0.4, 2.0, 0.2]} radius={0.05}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>
        </group>
    );
};

// 2. STRUCTURED -> Table/Grid Icon
const Table3D = ({ color }) => {
    const group = useRef();
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            group.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
        }
    });

    return (
        <group ref={group}>
            {/* 2x2 Grid of squares representing a table */}
            {/* Top Row */}
            <RoundedBox position={[-0.5, 0.5, 0]} args={[0.8, 0.8, 0.1]} radius={0.1}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>
            <RoundedBox position={[0.5, 0.5, 0]} args={[0.8, 0.8, 0.1]} radius={0.1}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>

            {/* Bottom Row */}
            <RoundedBox position={[-0.5, -0.5, 0]} args={[0.8, 0.8, 0.1]} radius={0.1}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>
            <RoundedBox position={[0.5, -0.5, 0]} args={[0.8, 0.8, 0.1]} radius={0.1}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>
        </group>
    );
};

// 3. PERSISTENT -> Download/Save Icon
const Download3D = ({ color }) => {
    const group = useRef();
    useFrame((state) => {
        if (group.current) {
            // Gentle bobbing motion
            group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    return (
        <group ref={group}>
            {/* Arrow Shaft */}
            <RoundedBox position={[0, 0.2, 0]} args={[0.3, 1.2, 0.3]} radius={0.1}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>
            {/* Arrow Head */}
            <mesh position={[0, -0.6, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.6, 0.8, 32]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Tray/Base */}
            <RoundedBox position={[0, -1.2, 0]} args={[1.5, 0.2, 0.5]} radius={0.05}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </RoundedBox>
        </group>
    );
};


const FeatureCard3D = ({ item, colors }) => {
    // Determine icon based on label
    let IconComponent = BarChart3D;
    let hexColor = '#f97316'; // Default

    // Logic matching LandingPage.jsx data
    if (item.label.includes('REALTIME')) {
        IconComponent = BarChart3D;
        hexColor = '#f97316'; // Orange
    } else if (item.label.includes('STRUCTURED')) {
        IconComponent = Table3D;
        hexColor = '#10b981'; // Emerald
    } else if (item.label.includes('PERSISTENT')) {
        IconComponent = Download3D;
        hexColor = '#f59e0b'; // Amber/Yellow
    }

    return (
        <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1.02}
            className="h-full"
        >
            <div className={`h-full p-12 rounded-[3.5rem] bg-slate-900/80 border border-white/5 backdrop-blur-xl transition-all text-center group cursor-default hover:border-orange-500/30 hover:shadow-2xl hover:bg-slate-900/90 relative overflow-hidden`}>

                {/* 3D Icon Container */}
                <div className={`w-32 h-32 mx-auto mb-6 ${colors.bg.replace('bg-', 'bg-').replace('600', '500/20')} rounded-[2rem] border ${colors.border} relative pointer-events-none`}>
                    <Canvas camera={{ position: [0, 0, 4] }} dpr={[1, 1]} gl={{ antialias: false, powerPreference: "default" }}>
                        <ambientLight intensity={1} />
                        <pointLight position={[5, 5, 5]} intensity={1.5} color="white" />
                        <Center>
                            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                                <IconComponent color={hexColor} />
                            </Float>
                        </Center>
                    </Canvas>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.label} DATA</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc || "Advanced algorithms ensure your data is processed with surgical precision and absolute clarity."}</p>

                <div className={`absolute -bottom-20 -right-20 w-40 h-40 ${colors.glow} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
            </div>
        </Tilt>
    );
};

export default FeatureCard3D;
