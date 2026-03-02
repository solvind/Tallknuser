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
// Andre funksjoner i script.js
// ...

// Her begynner touch-funksjonene:

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    
    const element = document.getElementById('yourElementId');

    if (element) {
        console.log('Element with ID yourElementId found:', element);

        // Bind touch event listeners
        element.addEventListener('touchstart', (event) => {
            event.preventDefault();
            console.log('Touch Start triggered:', event);
        }, { passive: false });

        element.addEventListener('touchmove', (event) => {
            event.preventDefault();
            console.log('Touch Move triggered:', event);
        }, { passive: false });

        element.addEventListener('touchend', (event) => {
            event.preventDefault();
            console.log('Touch End triggered:', event);
        }, { passive: false });
    } else {
        console.error('Element with ID yourElementId not found!');
    }
});
