import { useEffect, useState } from "react";

interface FallingItem {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    type: "crescent" | "star" | "lantern";
    opacity: number;
}

const FallingElements = () => {
    const [items] = useState<FallingItem[]>(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 8,
            duration: 6 + Math.random() * 8,
            size: 14 + Math.random() * 20,
            type: (["crescent", "star", "lantern"] as const)[i % 3],
            opacity: 0.3 + Math.random() * 0.5,
        }))
    );

    const renderIcon = (type: string, size: number) => {
        if (type === "crescent") {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.82 0 3.53-.5 5-1.35-2.99-1.73-5-4.95-5-8.65s2.01-6.92 5-8.65C15.53 2.5 13.82 2 12 2z" />
                </svg>
            );
        }
        if (type === "star") {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        }
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 2h8l2 6v2c0 2-1 3-2 4v6c0 1-1 2-3 2h-2c-2 0-3-1-3-2v-6c-1-1-2-2-2-4V8l2-6z" />
                <line x1="12" y1="20" x2="12" y2="24" />
            </svg>
        );
    };

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="absolute text-ramzan-gold animate-fall"
                    style={{
                        left: `${item.left}%`,
                        animationDelay: `${item.delay}s`,
                        animationDuration: `${item.duration}s`,
                        opacity: item.opacity,
                    }}
                >
                    {renderIcon(item.type, item.size)}
                </div>
            ))}
        </div>
    );
};

export default FallingElements;
