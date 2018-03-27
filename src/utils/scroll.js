/**
 * Checks if element is currently visible on page
 * @param element {Object} Element to check visibility of
 * @returns {boolean}
 */

export function isElementVisible(element) {
    let rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0
    );
}

/**
 * Animated scroll to element with time to animate
 * @param element {Object} Element to scroll
 * @param to {integer} Position to scroll to
 * @param duration  {integer} Time of animation
 */

export function scrollToVertical(element, to, duration) {
    if (duration <= 0) return;
    let difference = to - element.scrollTop,
        perTick = difference / duration * 10;
    setTimeout(()=> {
        element.scrollTop += perTick;
        if (element.offsetLeft === to) return;
        scrollToVertical(element, to, duration - 10);
    }, 10);
}