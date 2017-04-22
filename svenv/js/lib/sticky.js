import BEM from 'bem.js';


/**
 * Class representing functionality for sticky scrolling.
 * @class
 */
export class Sticky {
    /**
     * Constructor
     * @param {HTMLElement} node
     */
    constructor(node) {
        /** {String} representing the sticky state. */
        this.MODIFIER_SCROLLED = 'scrolled';

        /** {String} representing the sticky state. */
        this.MODIFIER_STICKY = 'sticky';

        this.setUpSticky(node);
    }

    /**
     * Create a sticky effect on node.
     * @param {HTMLElement} node
     */
    setUpSticky(node) {
        window.addEventListener('scroll', this.Sticky.bind(this, node));

    }

    /**
     * Sets the sticky position of node.
     * Adds this.MODIFIER_SCROLLED to document.body.
     * Adds this.MODIFIER_STICKY to document.body.
     * @param {HTMLElement} node
     */
    Sticky(node) {
        if (document.body.scrollTop) {
            BEM.addModifier(document.body, this.MODIFIER_SCROLLED);
            BEM.addModifier(node, this.MODIFIER_STICKY);
            return;
        }
        BEM.removeModifier(document.body, this.MODIFIER_SCROLLED);
        BEM.removeModifier(node, this.MODIFIER_STICKY);
    }
}
