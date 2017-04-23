from django.conf.urls import url, include
from rest_framework import routers

from .views import BlogPageViewSet


router = routers.DefaultRouter()
router.register(r'articles', BlogPageViewSet, base_name='blog-posts')


urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
]
