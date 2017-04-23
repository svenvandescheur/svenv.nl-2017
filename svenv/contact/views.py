from django.urls import reverse_lazy

from .forms import ContactForm
from django.views.generic.edit import FormView


class ContactView(FormView):
    template_name = 'contact/contact.html'
    form_class = ContactForm
    success_url = reverse_lazy('thank_you')

    def form_valid(self, form):
        form.send_email()
        return super(ContactView, self).form_valid(form)
