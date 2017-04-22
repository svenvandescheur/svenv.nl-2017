from rest_framework import serializers

from.models import Article


class BlogPageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    go_live_at = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ('title', 'image', 'search_description', 'url', 'is_post', 'go_live_at')

    def get_go_live_at(self, instance):
        return instance.go_live_at

    def get_image(self, instance):
        return instance.image.get_rendition('width-768').url
