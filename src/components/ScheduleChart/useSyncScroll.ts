"use client"
import { useRef } from 'react'

const useSyncScroll = () => {
    const headerRef = useRef(null);
    const bodyRef = useRef(null);
    const isSyncing = useRef(false);

    const syncScroll = (source: string) => {
        if (isSyncing.current) return;
        isSyncing.current = true;
        const header = headerRef.current;
        const body = bodyRef.current;
        if (header && body) {
            const scrollLeft =
                source === "body" ? body.scrollLeft : header.scrollLeft;
            header.scrollLeft = scrollLeft;
            body.scrollLeft = scrollLeft;
        }
        requestAnimationFrame(() => {
            isSyncing.current = false;
        });
    };

    return {
        headerRef,
        bodyRef,
        syncScroll,
    }
}

export default useSyncScroll;