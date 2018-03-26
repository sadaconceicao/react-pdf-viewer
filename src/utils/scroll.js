/**
 *
 * @param element
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
 *
 * @param element
 * @param to
 * @param duration
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