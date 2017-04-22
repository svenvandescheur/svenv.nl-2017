import { Consumer, ConsumerObject } from 'consumerjs';


/**
 * Object representing an article.
 * @class
 */
class Article extends ConsumerObject {}


/**
 * Consumer for Article objects.
 * @class
 */
export default class ArticleConsumer extends Consumer {
    /**
     * Initializes this consumer with defaults.
     */
    constructor(endpoint='/api/v1/articles/', objectClass=Article) {
        super(endpoint, objectClass);
    }

    /**
     * Returns page of articles (as HTML)
     * @param {number} categoryId
     * @param {number} page
     * @returns {Promise}
     */
    getArticles(categoryId, page) {
        return this.get('/', { category: categoryId, page: page });
    }

    /**
     * Searches and returns page of articles (as HTML)
     * @param {string} query
     * @param {number} page
     * @returns {Promise}
     */
    search(query, page) {
        return this.get('/', { search: query, page: page });
    }

    /**
     * Don't do any parsing as the API provides plain HTML output.
     */
    parse(html) {
        return html;
    }
}
