
import { ReactNode } from 'react';

interface PatrioticBadgeProps {
    children: ReactNode;
    className?: string;
}

const PatrioticBadge = ({ children, className = '' }: PatrioticBadgeProps) => {
    return (
        <div className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-saffron/10 via-india-white to-india-green/10 border border-saffron/20 backdrop-blur-sm ${className}`}>
            {/* Left tricolor accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-full overflow-hidden">
                <div className="h-1/3 bg-saffron" />
                <div className="h-1/3 bg-india-white" />
                <div className="h-1/3 bg-india-green" />
            </div>

            {/* Right tricolor accent */}
            <div className="absolute right-0 top-0 bottom-0 w-1 rounded-r-full overflow-hidden">
                <div className="h-1/3 bg-saffron" />
                <div className="h-1/3 bg-india-white" />
                <div className="h-1/3 bg-india-green" />
            </div>

            <span className="text-foreground font-medium">{children}</span>
        </div>
    );
};

export default PatrioticBadge;
