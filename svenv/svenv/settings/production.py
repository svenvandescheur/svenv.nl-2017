from __future__ import absolute_import, unicode_literals

from .base import *


key = open('/srv/uwsgi/key.txt').read().splitlines()[0]
pw = open('/srv/uwsgi/pw.txt').read().splitlines()[0]
DEBUG = False
SECRET_KEY = key

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'svenv.nl',
        'USER': 'svenv.nl',
        'PASSWORD': pw,
        'HOST': 'postgresql',
    }
}

try:
    from .local import *
except ImportError:
    pass
