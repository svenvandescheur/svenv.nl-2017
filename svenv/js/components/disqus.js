import BEM from 'bem.js';


/**
 * Class representing the Disqus comments block.
 * @class
 */
class Disqus {
    /**
     * Constructor
     * Add Disqus to the page if required.
     */
    constructor() {
        /** {string} Block representing the Disqus wrapper. */
        this.BLOCK_DISQUS = 'disqus';

        /** {string} Representing the disqus shortname. */
        this.DISQUS_SHORTNAME = 'svenv';


        // Add Disqus.
        if (BEM.getBEMNode(this.BLOCK_DISQUS)) {
            this.addDisqus();
        }
    }


    /**
     * Add Disqus to the current page.
     */
    addDisqus() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + this.DISQUS_SHORTNAME + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }
}


// Initiate
new Disqus();
