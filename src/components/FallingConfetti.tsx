
import { useEffect, useState } from 'react';

interface ConfettiPiece {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    color: 'saffron' | 'white' | 'green';
    shape: 'circle' | 'square' | 'triangle';
}

const FallingConfetti = () => {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 5,
            size: 8 + Math.random() * 12,
            color: ['saffron', 'white', 'green'][Math.floor(Math.random() * 3)] as ConfettiPiece['color'],
            shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as ConfettiPiece['shape'],
        }));
        setConfetti(pieces);
    }, []);

    const getColorClass = (color: ConfettiPiece['color']) => {
        switch (color) {
            case 'saffron': return 'bg-saffron';
            case 'white': return 'bg-india-white border border-gray-200';
            case 'green': return 'bg-india-green';
        }
    };

    const getShapeStyle = (shape: ConfettiPiece['shape'], size: number) => {
        switch (shape) {
            case 'circle':
                return { borderRadius: '50%' };
            case 'square':
                return { borderRadius: '2px' };
            case 'triangle':
                return {
                    width: 0,
                    height: 0,
                    backgroundColor: 'transparent',
                    borderLeft: `${size / 2}px solid transparent`,
                    borderRight: `${size / 2}px solid transparent`,
                    borderBottom: `${size}px solid`,
                };
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {confetti.map((piece) => (
                <div
                    key={piece.id}
                    className={`absolute animate-confetti ${piece.shape !== 'triangle' ? getColorClass(piece.color) : ''}`}
                    style={{
                        left: `${piece.left}%`,
                        width: piece.shape !== 'triangle' ? `${piece.size}px` : 0,
                        height: piece.shape !== 'triangle' ? `${piece.size}px` : 0,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                        ...getShapeStyle(piece.shape, piece.size),
                        ...(piece.shape === 'triangle' && {
                            borderBottomColor: piece.color === 'saffron'
                                ? 'hsl(24 100% 50%)'
                                : piece.color === 'green'
                                    ? 'hsl(120 60% 25%)'
                                    : 'hsl(0 0% 100%)',
                        }),
                    }}
                />
            ))}
        </div>
    );
};

export default FallingConfetti;
