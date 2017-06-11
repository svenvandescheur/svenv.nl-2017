import BEM from 'bem.js';
import { Sticky } from '../lib/sticky';


/** {string} representing the navbar. */
const BLOCK_NAVBAR = 'navbar';

/** {string} representing the search input. */
const ELEMENT_INPUT = 'input';

/** {HTMLElement} representing the navbar. */
export const NAVBAR = BEM.getBEMNode(BLOCK_NAVBAR);

/** {HTMLElement} representing the search input. */
export const INPUT = BEM.getBEMNode(BLOCK_NAVBAR, ELEMENT_INPUT);


/**
 * Class representing the sticky navbar.
 * @class
 */
class StickyNavbar {
    /**
     * Constructor
     * Add Article to the page if required
     */
    constructor() {
        this.setUpStickyNavbar();
    }

    /**
     * Adds a parallax effect to this.HEADER
     */
    setUpStickyNavbar() {
        new Sticky(NAVBAR);
    }
}


if (NAVBAR) {
    new StickyNavbar();
}
