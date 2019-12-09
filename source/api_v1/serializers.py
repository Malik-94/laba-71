from rest_framework.serializers import ModelSerializer
from webapp.models import Quote


class QuoteSerializer(ModelSerializer):
    class Meta:
        model = Quote
        fields = ['text','created_at','status','author_name','author_email','rating']