/**
 * Module containing functionality for parallax scrolling.
 * @module
 */
import BEM from 'bem.js';


/**
 * Class representing functionality for parallax scrolling.
 * @class
 */
export class Parallax {
    /**
     * Constructor
     * @param {HTMLElement} node
     * @param {Number} [ratio]
     */
    constructor(node, ratio=0.3) {
        this.setUpParallax(node, ratio);
    }

    /**
     * Create a parallax effect on the header by utilizing requestAnimationFrame.
     * @param {HTMLElement} node
     * @param {Number} ratio
     */
    setUpParallax(node, ratio) {
        window.addEventListener('scroll', this.parallax.bind(this, node, ratio));
    }

    /**
     * Sets the parallax position of node.
     * @param {HTMLElement} node
     * @param {Number} ratio
     */
    parallax(node, ratio) {
        requestAnimationFrame(() => {
            let top = ratio * window.scrollY;
            node.style.top = `${top}px`;
        });
    }
}
