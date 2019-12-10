from rest_framework.views import APIView
from rest_framework.response import Response
from api_v1.serializers import QuoteSerializer
from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS, AllowAny

from webapp.models import Quote


class LogoutView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok'})


class QuoteViewSet(viewsets.ModelViewSet):
    serializer_class = QuoteSerializer
    queryset = Quote.objects.all()

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return []

        return super().get_permissions()

