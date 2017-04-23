from django.views.generic import TemplateView

from .views import ContactView
from django.conf.urls import url


urlpatterns =\
    [
    url(r'^$', ContactView.as_view()),
    url(r'^thanks/', TemplateView.as_view(template_name='contact/thank_you.html'), name='thank_you'),
]
