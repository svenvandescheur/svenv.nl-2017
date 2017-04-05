/**
 * Module containing classes for simplepage views.
 * @module
 */
import { AbstractDetailView } from './abstractdetail';


/**
 * Class containing logic for simplePage views.
 * @class
 */
class SimplePageView extends AbstractDetailView {
    /**
     * Constructor
     * Add SimplePage to the page if required.
     */
    constructor() {
        super('view-simplepage');
    }
}


// Initiate
new SimplePageView();
