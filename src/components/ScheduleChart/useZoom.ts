import React, { useCallback, useState, useRef } from 'react'

const DEFAULT_ZOOM_VALUE = 1.2;
const ZOOM_SCALE_MIN = 1.3;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 15;
const ZOOM_STEP = 0.5;

// ---- zoom on shift+wheel ----
const useZoom = ({ bodyRef }: { bodyRef: React.RefObject<HTMLDivElement> | null }) => {
    const [zoom, setZoom] = useState(DEFAULT_ZOOM_VALUE);
    const zoomRef = useRef(zoom);

    const handleWheel = useCallback((e) => {
        if (!e.shiftKey) return;
        e.preventDefault();
        const container = bodyRef.current;
        if (!container) return;

        const mouseX = e.clientX - container.getBoundingClientRect().left;
        const scrollLeft = container.scrollLeft;
        const minuteUnderCursor = (scrollLeft + mouseX) / zoomRef.current;

        const prevZoom = zoomRef.current;
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom + delta));
        if (nextZoom < ZOOM_SCALE_MIN) return;

        zoomRef.current = nextZoom;
        setZoom(nextZoom);

        requestAnimationFrame(() => {
            if (container)
                container.scrollLeft = minuteUnderCursor * nextZoom - mouseX;
        });
    }, [bodyRef]);

    return { zoom, handleWheel };

}

export default useZoom;