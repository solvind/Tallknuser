// Updated script.js to support touch events

// Remove keyboard event handling

// Touch event handling for mobile devices
document.addEventListener('DOMContentLoaded', () => {
    function handleTouchStart(event) {
        event.preventDefault(); // Ensures Safari doesn't scroll
        console.log('Touch Start:', event);
    }

    function handleTouchMove(event) {
        event.preventDefault();
        console.log('Touch Move:', event);
    }

    function handleTouchEnd(event) {
        event.preventDefault();
        console.log('Touch End:', event);
    }

    // Attach touch event listeners
    const element = document.getElementById('yourElementId');
    if (element) {
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: false });
    } else {
        console.error('Element with ID yourElementId not found!');
    }
});