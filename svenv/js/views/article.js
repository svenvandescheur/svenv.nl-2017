import BEM from 'bem.js';
import { Parallax } from '../lib/parallax';


/** {string} representing the view. */
const BLOCK_VIEW = 'view-article';

/** {string} representing the image header element. */
const ELEMENT_HEADER = 'header';

/** {HTMLElement} representing the image header. */
const HEADER = BEM.getBEMNode(BLOCK_VIEW, ELEMENT_HEADER);


/**
 * Class containing logic for article view.
 * @class
 */
export class ArticleView {
    /**
     * Constructor
     * @param {string} view The block name of the view.
     */
    constructor(view) {
        this.setUpParallaxHeader();
    }

    /**
     * Adds a parallax effect to this.HEADER.
     */
    setUpParallaxHeader() {
        new Parallax(HEADER);
    }
}

if (HEADER) {
    new ArticleView();
}
