import { useMemo } from "react";

type ParticleType = "crescent" | "lantern" | "star" | "geometric";

interface Particle {
    id: number;
    type: ParticleType;
    x: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
    driftX: number;
    rotation: number;
    blur: number;
    layer: "far" | "mid" | "near";
}

const CrescentMoon = ({ size, opacity }: { size: number; opacity: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path
            d="M20 4C12.268 4 6 10.268 6 18s6.268 14 14 14c3.726 0 7.106-1.459 9.607-3.836A12 12 0 0 1 16 18a12 12 0 0 1 13.607-9.836A13.94 13.94 0 0 0 20 4Z"
            fill={`hsl(38 70% 50% / ${opacity})`}
        />
    </svg>
);

const Lantern = ({ size, opacity }: { size: number; opacity: number }) => (
    <svg width={size} height={size * 1.6} viewBox="0 0 30 48" fill="none">
        <line x1="15" y1="0" x2="15" y2="8" stroke={`hsl(38 70% 50% / ${opacity * 0.6})`} strokeWidth="1" />
        <rect x="10" y="6" width="10" height="4" rx="1" fill={`hsl(38 70% 50% / ${opacity * 0.8})`} />
        <path
            d="M8 10C8 10 6 16 6 22C6 28 10 32 15 32C20 32 24 28 24 22C24 16 22 10 22 10H8Z"
            fill={`hsl(38 70% 50% / ${opacity * 0.5})`}
            stroke={`hsl(38 70% 50% / ${opacity * 0.7})`}
            strokeWidth="0.5"
        />
        <ellipse cx="15" cy="20" rx="4" ry="5" fill={`hsl(42 85% 65% / ${opacity * 0.4})`} />
        <path d="M10 32L12 36H18L20 32" fill={`hsl(38 70% 50% / ${opacity * 0.8})`} />
    </svg>
);

const GlowingStar = ({ size, opacity }: { size: number; opacity: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
            d="M12 2L14.09 8.26L20.18 8.63L15.54 12.74L16.91 19.02L12 15.77L7.09 19.02L8.46 12.74L3.82 8.63L9.91 8.26L12 2Z"
            fill={`hsl(42 85% 65% / ${opacity})`}
        />
    </svg>
);

const GeometricShape = ({ size, opacity }: { size: number; opacity: number }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <polygon
            points="16,2 30,16 16,30 2,16"
            fill="none"
            stroke={`hsl(38 70% 50% / ${opacity})`}
            strokeWidth="1"
        />
        <polygon
            points="16,8 24,16 16,24 8,16"
            fill={`hsl(42 85% 65% / ${opacity * 0.3})`}
            stroke={`hsl(38 70% 50% / ${opacity * 0.6})`}
            strokeWidth="0.5"
        />
    </svg>
);

const PARTICLE_COUNT = 80;

const FloatingParticles = () => {
    const particles = useMemo<Particle[]>(() => {
        const types: ParticleType[] = ["crescent", "lantern", "star", "geometric"];
        return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
            const layer = i < 8 ? "far" : i < 18 ? "mid" : "near";
            const baseSize = layer === "far" ? 14 : layer === "mid" ? 22 : 30;
            return {
                id: i,
                type: types[i % types.length],
                x: (i * 17 + 5) % 100,
                size: baseSize + Math.random() * 10,
                delay: Math.random() * 12,
                duration: 18 + Math.random() * 16,
                opacity: layer === "far" ? 0.2 : layer === "mid" ? 0.35 : 0.5,
                driftX: (Math.random() - 0.5) * 60,
                rotation: Math.random() * 90 - 45,
                blur: layer === "far" ? 1.5 : layer === "mid" ? 0.3 : 0,
                layer,
            };
        });
    }, []);

    const renderParticle = (p: Particle) => {
        switch (p.type) {
            case "crescent":
                return <CrescentMoon size={p.size} opacity={p.opacity} />;
            case "lantern":
                return <Lantern size={p.size} opacity={p.opacity} />;
            case "star":
                return <GlowingStar size={p.size} opacity={p.opacity} />;
            case "geometric":
                return <GeometricShape size={p.size} opacity={p.opacity} />;
        }
    };

    return (
        <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute"
                    style={{
                        left: `${p.x}%`,
                        top: "-5%",
                        filter: p.blur > 0 ? `blur(${p.blur}px)` : undefined,
                        animation: `float-down ${p.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${p.delay}s infinite`,
                        ["--drift-x" as string]: `${p.driftX}px`,
                        ["--rotation" as string]: `${p.rotation}deg`,
                        ["--particle-opacity" as string]: p.opacity,
                        zIndex: p.layer === "far" ? 1 : p.layer === "mid" ? 5 : 9,
                    }}
                >
                    {renderParticle(p)}
                </div>
            ))}
        </div>
    );
};

export default FloatingParticles;
