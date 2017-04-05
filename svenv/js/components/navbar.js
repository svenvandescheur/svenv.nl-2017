/**
 * Module containing classes for navbar functionality.
 * @module
 */
import BEM from 'bem.js';
import { Sticky } from '../lib/sticky';


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
        /** {String} representing the navbar */
        this.BLOCK_NAVBAR = 'navbar';

        /** {HTMLElement} representing the navbar header */
        this.NAVBAR = BEM.getBEMNode(this.BLOCK_NAVBAR);


        if(this.NAVBAR) {
            this.setUpStickyNavbar();
        }
    }

    /**
     * Adds a parallax effect to this.HEADER
     */
    setUpStickyNavbar() {
        console.log('hoij')
        new Sticky(this.NAVBAR);
    }
}


// Initiate
new StickyNavbar();
