from django.http import Http404
from rest_framework import pagination, renderers, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .models import Article, Category
from .serializers import BlogPageSerializer


class BlogPageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows Article objects to be viewed or edited.
    """
    model = Article
    parent = None
    serializer_class = BlogPageSerializer
    pagination_class = pagination.PageNumberPagination
    pagination_class.page_size = 12
    renderer_classes = (renderers.TemplateHTMLRenderer, renderers.BrowsableAPIRenderer, renderers.JSONRenderer)
    template_name = 'blog/category.html'

    def get_parent(self):
        id = self.request.GET.get('category')

        if id:
            self.parent = get_object_or_404(Category, id=id)
        else:
            self.parent = self.request.site.root_page
        return self.parent

    def get_queryset(self):
        search = self.request.GET.get('search')

        if search:
            qs = Article.objects.live().public().type(Article).search(search)

            if not qs:
                raise Http404('No results')
            return qs

        return Article.objects.article_descendants(self.get_parent())



