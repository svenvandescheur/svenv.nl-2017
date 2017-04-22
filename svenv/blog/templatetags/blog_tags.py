from django import template
from django.core.paginator import Paginator

from ..models import Article

register = template.Library()


@register.assignment_tag(takes_context=True)
def get_site_root(context):
    """
    Returns the root page by looking in the request for the current site.
    """
    return context['request'].site.root_page


@register.assignment_tag(takes_context=True)
def get_child_pages(context, parent):
    """
    Return all children of parent.
    """
    paginator = get_paginator(context, parent)
    page = context['request'].GET.get('page', 1)
    return paginator.page(page)


def get_paginator(context, parent):
    """
    Returns a configured paginator with children of parent.
    """
    children = Article.objects.article_descendants(parent)
    return Paginator(children, 12)


@register.assignment_tag
def get_previous_sibling(page):
    """
    Returns the previous sibling.
    """
    siblings = get_siblings(page)
    sibling_index = get_sibling_index(siblings, page)

    if sibling_index > 0:
        previous_sibling_index = sibling_index - 1
        return get_sibling_if_exists(siblings, previous_sibling_index)


@register.assignment_tag
def get_next_sibling(page):
    """
    Returns the next sibling.
    """
    siblings = get_siblings(page)
    next_sibling_index = get_sibling_index(siblings, page) + 1
    return get_sibling_if_exists(siblings, next_sibling_index)


def get_siblings(page):
    """
    Returns siblings sorted by go_live_at.
    """
    return page\
        .get_siblings()\
        .order_by('-go_live_at')


def get_sibling_index(siblings, page):
    """
    Returns the index for sibling page in siblings.
    """
    return [i for i, item in enumerate(siblings) if item.id == page.id][0]


def get_sibling_if_exists(siblings, index):
    """
    Returns the page in siblings with index index if it exists.
    """
    try:
        return siblings[index]
    except IndexError:
        pass


@register.inclusion_tag('blog/tags/top_menu.html', takes_context=True)
def top_menu(context, parent, calling_page=None):
    """
     Renders the top menu/navigation bar.
    """
    pages = parent\
        .get_descendants()\
        .live()\
        .in_menu()

    for page in pages:
        page.active = (calling_page.url.startswith(page.url))

    return {
        'pages': pages,
        'request': context['request'],
    }
