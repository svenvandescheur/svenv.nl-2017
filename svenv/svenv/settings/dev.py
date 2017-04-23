from __future__ import absolute_import, unicode_literals

from .base import *

DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'e=lhlpksq8ftjnefrs*lt4(7y=u51g%1yipztgcw61q8)ybkx!'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

try:
    from .local import *
except ImportError:
    pass
