/**
 * Module containing classes for detail views.
 * @module
 */
import BEM from 'bem.js';
import { Parallax } from '../lib/parallax';


/**
 * Class containing logic for detail views.
 * @class
 */
export class AbstractDetailView {
    /**
     * Constructor
     * @param {String} view The block name of the view.
     */
    constructor(view) {
        /** {String} representing the view. */
        this.BLOCK_VIEW = view;

        /** {String} representing the image header element. */
        this.ELEMENT_HEADER = 'header';

        /** {HTMLElement} representing the image header. */
        this.HEADER = BEM.getBEMNode(this.BLOCK_VIEW, this.ELEMENT_HEADER);


        if(this.HEADER) {
            this.setUpParallaxHeader();
        }
    }

    /**
     * Adds a parallax effect to this.HEADER.
     */
    setUpParallaxHeader() {
        new Parallax(this.HEADER);
    }
}
