from django import forms
from django.conf import settings
from django.core.mail import EmailMessage


class ContactForm(forms.Form):
    name = forms.CharField(label='Your name', widget=forms.TextInput(attrs={'placeholder': 'John Doe'}))
    email = forms.EmailField(label='Your e-mail address (kept private)', widget=forms.EmailInput(attrs={'placeholder': 'john@example.com'}))
    message = forms.CharField(label='Message', widget=forms.Textarea(attrs={'placeholder': 'Feel free to ask me anything...'}))

    def send_email(self):
        message = EmailMessage(
            settings.CONTACT_SUBJECT,
            self.cleaned_data['message'],
            settings.CONTACT_MAIL_FROM,
            settings.CONTACT_RECIPIENTS,
            reply_to=['{} <{}>'.format(self.cleaned_data['name'], self.cleaned_data['email'])],
        )
        message.send()
