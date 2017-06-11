import BEM from 'bem.js';
import { NAVBAR, INPUT } from '../components/navbar';
import ArticleConsumer from '../data/article';
import { Parallax } from '../lib/parallax';

/** {string} representing the view. */
const BLOCK_VIEW = 'view-category';

/** {string} representing the paginator. */
const BLOCK_PAGINATOR = 'paginator';

/** {string} representing the views main block. */
const ELEMENT_MAIN = 'main';

/** {string} representing the hidden state. */
const MODIFIER_HIDDEN = 'hidden';

/** {string} representing the search state. */
const MODIFIER_SEARCH = 'search';

/** {HTMLElement} representing the view. */
const VIEW = BEM.getBEMNode(BLOCK_VIEW);

/** {HTMLElement} representing the views main block.. */
const MAIN = BEM.getBEMNode(BLOCK_VIEW, ELEMENT_MAIN);

/** {HTMLElement} representing the paginator. */
const PAGINATOR = BEM.getBEMNode(BLOCK_PAGINATOR);


/**
 * Class containing logic for category view.
 * @class
 */
export class CategoryView {
    /**
     * Constructor
     * @param {string} view The block name of the view.
     */
    constructor(view) {
        /** {ArticleConsumer} for loading articles. */
        this.articleConsumer = new ArticleConsumer();

        /** {number} Id of the initial category. */
        this.initialCategory = this.getCategory();

        /** {boolean} whether the view is loading extra articles. */
        this.isLoading = false;


        /** {boolean} Determines whether to load regular pages or search queries. */
        this.searchMode = false;
        this.searchTimeout = null;

        this.setUpInfiniteScroll();
        this.setUpSearch();
    }

    /**
     * Configures the view for infinite scrolling.
     */
    setUpInfiniteScroll() {
        this.disablePaginator();
        this.updateView();
        window.addEventListener('scroll', this.updateView.bind(this));
    }

    /**
     * Disables the paginator.
     */
    disablePaginator() {
        BEM.addModifier(PAGINATOR, MODIFIER_HIDDEN);
    }

    /**
     * Loads next page if required.
     */
    updateView() {
        if (this.shouldLoadNextPage()) {
            this.loadNextPage();
        }
    }

    /**
     * Checks if the next page should be loaded.
     * @returns {boolean}
     */
    shouldLoadNextPage() {
        if (this.isLoading) {
            return false;
        }

        let windowHeight = window.innerHeight;
        let scrollTop = document.body.scrollTop;
        let position = windowHeight + scrollTop;
        let threshold = document.body.scrollHeight;

        return position >= threshold;
    }

    /**
     * Loads next page, either for regular view or search.
     */
    loadNextPage() {
        if (!this.searchMode) {
            return this.loadNextCategoryPage();
        }
        return this.loadNextSearchPage();
    }

    /**
     * Load next page for categories.
     * @param {number} [categoryId]
     * @param {number} [page]
     */
    loadNextCategoryPage(categoryId=this.initialCategory, page=this.getPage() + 1) {
        this.isLoading = true;
        this.articleConsumer.getArticles(categoryId, page)
            .then(this.addPage.bind(this))
            .catch(this.handleError.bind(this))
            .then(() => this.isLoading = false);
    }

    /**
     * Load next page for search.
     */
    loadNextSearchPage(page=this.getPage() + 1) {
        this.isLoading = true;
        this.articleConsumer.search(INPUT.value, this.getPage() + 1)
            .then(this.addPage.bind(this))
            .catch(this.handleError.bind(this))
            .then(() => this.isLoading = false);
    }

    /**
     * Returns the id of the current caegory.
     * @returns {number}
     */
    getCategory() {
        return parseInt(MAIN.dataset.category);
    }

    /**
     * Returns the current page number.
     * @returns {number}
     */
    getPage() {
        let nodes = BEM.getBEMNodes(BLOCK_VIEW, ELEMENT_MAIN);
        let length = nodes.length;
        let last = nodes[length - 1];
        return parseInt(last.dataset.page);
    }

    /**
     * Adds html as page to the DOM.
     * @param {string} html
     */
    addPage(html) {
        let parser = new DOMParser();
        let document = parser.parseFromString(html, 'text/html');
        let node = BEM.getChildBEMNode(document, BLOCK_VIEW, ELEMENT_MAIN)
        VIEW.appendChild(node);
    }

    /**
     * Handles API errors.
     * 404 is ignored as it's considered a valid response.
     * If all other cases user is notified and response is thrown.
     * @param {HttpResponseMessage} response
     */
    handleError(response) {
        // 404 is ignored as it's considered a valid response.
        if (response.statusCode === 404) {
            // TODO: loading may now optionally be disabled since there are no more pages...
            return;
        }

        // If all other cases user is notified and response is thrown.
        // TODO: Proper modal/notification...
        alert("Oops! Something went wrong!\n\nPlease reload the page and try again...");
        throw response
    }

    /**
     * Configures the search input.
     */
    setUpSearch() {
        INPUT.addEventListener('focus', BEM.addModifier.bind(BEM, NAVBAR, MODIFIER_SEARCH));
        INPUT.addEventListener('blur', BEM.removeModifier.bind(BEM, NAVBAR, MODIFIER_SEARCH));
        INPUT.addEventListener('input', this.search.bind(this));
    }

    /**
     * Performs search or resets view.
     */
    search() {
        setTimeout(() => {
            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {  // Abuse scheduler to make sure we have the updated input value.
                if (this.searchMode && !INPUT.value) {
                    this.setCategory();
                    return;
                }

                this.articleConsumer.search(INPUT.value)
                    .then(this.setSearch.bind(this))
                    .catch(this.handleError.bind(this))
                    .then(() => this.isLoading = false);
            }, 300);
        }, 0)
    }

    /**
     * Set the search results.
     */
    setSearch(html) {
        this.searchMode = true;
        this.removeAllPages();
        this.addPage(html);
    }

    /**
     * Reset the view.
     */
    setCategory() {
        this.searchMode = false;
        this.removeAllPages();
        this.loadNextCategoryPage(this.initialCategory, 1);
    }

    /**
     * Removes all pages from DOM.
     */
    removeAllPages() {
        let nodes = BEM.getBEMNodes(BLOCK_VIEW, ELEMENT_MAIN)

        if (nodes.length) {
            nodes.forEach(node => node.remove())
        }
    }
}

if (VIEW) {
    new CategoryView();
}
