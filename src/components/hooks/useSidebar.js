import { useEffect, useState } from 'react';

export const useSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleOverlayClick = (e) => {
            if (e.target.classList.contains('mobile-overlay')) {
                setIsSidebarOpen(false);
            }
        };

        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };

        const handleTouchStart = (e) => {
            // Touch handling for mobile
        };

        const handleTouchMove = (e) => {
            // Touch handling for mobile
        };

        document.addEventListener('click', handleOverlayClick);
        document.addEventListener('keydown', handleEscapeKey);
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            document.removeEventListener('click', handleOverlayClick);
            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return {
        isSidebarOpen,
        toggleSidebar,
        closeSidebar
    };
}; 