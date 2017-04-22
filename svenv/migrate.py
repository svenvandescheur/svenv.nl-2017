

import json
import re
from re import finditer, search, sub, match, MULTILINE

from bs4 import BeautifulSoup
from django.contrib.contenttypes.models import ContentType
from markdown2 import Markdown
from wagtail.wagtailcore.models import Page
from wagtail.wagtailimages.models import Image
from .blog.models import Article, Category


class svenv_flavored_markdown(Markdown):
    def parse_markdown_class_image(self, match):
        """
        Replaces the match with correct image tag
        """
        alt = match.group(1)
        src = match.group(2)
        title = match.group(3)
        classname = match.group(4)

        if classname is not None:
            html = '<img src="%s" alt="%s" title="%s" class="%s" />' % (src, alt, title, classname)
        else:
            html = '<img src="%s" alt="%s" title="%s" />' % (src, alt, title)

        return self._escape_special_chars(html)

    def _do_links(self, value):
        """
        Extends markdown image syntax with additional class parameter
        Syntax: ![Alt text](/path/to/img.jpg "Title" "Class")
        """
        value = sub(r'!\[(.+?)]\((.+?)\s+?["\'](.+?)["\']\s*?(?:["\'](.+?)["\'])?\)',
                    self.parse_markdown_class_image, value)

        return super(svenv_flavored_markdown, self)._do_links(value)

    def _do_lists(self, text):
        """
        Replace the markdown2 _do_lists function
        Uses the same syntax but respects user's list start
        """
        matches = finditer(r'(\d+\.\s+?.+\n|\r)+', text, MULTILINE)

        for m in matches:
            list = m.group(0)
            list = match('\d+?\.[^<]+', list).group(0)
            text = text.replace(list, self.parse_markdown_sane_list(list))

        return super(svenv_flavored_markdown, self)._do_lists(text)

    def parse_markdown_sane_list(self, list):
        """
        Find the first item in the lists and uses it as start
        Returns the html version of the list
        """
        lines = list.splitlines()
        match_start = search(r'(\d+)\.', lines[0])
        start = match_start.group(1)
        html = '<ol start="' + start + '">'

        for line in lines:
            match_content = search(r'\d+\.\s(.+)', line)
            html += '<li>' + match_content.group(1) + '</li>'
        html += '</ol>'

        return html






file = open('dump.json')
data = json.loads(file.read())
pattern_blog = re.compile('blog')
pattern_image = re.compile('blog.image')
pattern_category = re.compile('blog.category')
pattern_post = re.compile('blog.post')
blog_items = []
home = Page.objects.get(pk=4)


for item in data:
    try:
        if pattern_blog.match(item['model']):
            blog_items.append(item)
    except KeyError:
        pass


images = [image for image in blog_items if pattern_image.match(image['model'])]
categories = [page for page in blog_items if pattern_category.match(page['model'])]
posts = [page for page in blog_items if pattern_post.match(page['model'])]


# for image in images:
#     fields = image['fields']
#     fields['url'] = fields['url'].replace('media/', '')
#     wagtail_image = Image(pk=image['pk'], title=fields['title'], file=fields['url'])
#     wagtail_image.save()


Category.objects.exclude(pk=home.pk).delete()
for category in categories:
    fields = category['fields']
    wagtail_page = Category(title=fields['name'], slug=fields['name'])
    home.add_child(instance=wagtail_page)

Article.objects.delete()
for post in posts:
    fields = post['fields']
    md = svenv_flavored_markdown(extras=['fenced-code-blocks'])
    content = md.convert(fields['content'])
    intro = BeautifulSoup(content, 'html5lib').select('p')
    intro = [str(tag) for tag in intro[:2]]
    intro = ''.join(intro)
    wagtail_page = Article(title=fields['title'],
                           slug=fields['short_title'],
                           image=Image.objects.get(pk=fields['image']),
                           body=json.dumps([{'type': 'raw_html', 'value': content}]),
                           comments=True,
                           go_live_at=fields['date'],
                           search_description=intro,
                           live=fields['published']
                           )
    parent_slug = [category['fields']['name'] for category in categories if category['pk'] == fields['category']][0]
    parent = Category.objects.get(slug=parent_slug)
    parent.add_child(instance=wagtail_page)
