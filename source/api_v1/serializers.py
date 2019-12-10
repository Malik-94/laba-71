from rest_framework import serializers
from webapp.models import Quote


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ('text', 'created_at', 'status', 'author_name', 'author_email', 'rating')
