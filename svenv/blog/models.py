from django.db import models
from wagtail.wagtailadmin.edit_handlers import FieldPanel, StreamFieldPanel
from wagtail.wagtailcore import blocks
from wagtail.wagtailcore.fields import RichTextField, StreamField
from wagtail.wagtailcore.models import Page, PageManager
from wagtail.wagtailimages.blocks import ImageChooserBlock
from wagtail.wagtailimages.edit_handlers import ImageChooserPanel
from wagtail.wagtailsearch import index


class Category(Page):
    pass


class ArticleManager(PageManager):
    def articles(self, request):
        """
        Returns live Article items, descendants of root.
        """
        return self.article_descendants(request.site.root_page)

    def article_descendants(self, parent):
        """
        Returns live Article objects, descendants of parent.
        """
        qs = parent\
            .get_descendants()\
            .live()\
            .public()\
            .type(Article)\
            .order_by('-go_live_at')

        return [i.specific for i in qs]


class Article(Page):
    body = StreamField([
        ('blockquote', blocks.BlockQuoteBlock()),
        ('image', ImageChooserBlock()),
        ('raw_html', blocks.RawHTMLBlock()),
        ('rich_text', blocks.RichTextBlock()),

    ], null=True, blank=True)

    comments = models.BooleanField(verbose_name='allow ccmments')

    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    is_post = True
    objects = ArticleManager()

    search_fields = Page.search_fields + [
        index.SearchField('body'),
    ]

    content_panels = Page.content_panels + [
        ImageChooserPanel('image'),
        StreamFieldPanel('body'),
        FieldPanel('comments'),
    ]

