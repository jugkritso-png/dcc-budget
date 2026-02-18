import { useState, useEffect, useRef } from 'react';

export const useChartDimensions = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            if (!Array.isArray(entries) || !entries.length) return;
            const entry = entries[0];
            const { width, height } = entry.contentRect;

            // Only update if dimensions are valid and different
            if (width > 0 && height > 0) {
                requestAnimationFrame(() => {
                    setDimensions({ width, height });
                });
            }
        });

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return { ref, dimensions };
};
