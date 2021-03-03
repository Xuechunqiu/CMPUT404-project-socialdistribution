from presentation.models import Liked, Author
from django.shortcuts import get_object_or_404
from presentation.Serializers.liked_serializer import LikedSerializer
from presentation.Serializers.author_serializer import AuthorSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from urllib.parse import urlparse

'''
URL: ://service/author/{author_id}/liked
GET list what public things author_id liked.
It’s a list of of likes originating from this author
'''


def getAuthorIDFromRequestURL(request, id):
    parsed_url = urlparse(request.build_absolute_uri())
    host = '{url.scheme}://{url.hostname}:{url.port}'.format(
        url=parsed_url)
    author_id = f"{host}/author/{id}"
    return author_id


class LikedViewSet(viewsets.ModelViewSet):
    serializer_class = LikedSerializer
    queryset = Liked.objects.all()

    def list(self, request, *args, **kwargs):
        author_id = getAuthorIDFromRequestURL(request, self.kwargs['author_id'])
        author = get_object_or_404(Author, id=author_id)
        queryset = Liked.objects.filter(owner=author)
        if queryset.exists():
            Likedlist = Liked.objects.get(owner=author)
            return Response({
                'type': 'like',
                'items': Likedlist.items
            })
        else:
            Liked.objects.create(owner=author)
            return Response({
                'type': 'like',
                'items': []
            })


    # def retrieve(self, request, *args, **kwargs):
    #     author_id = getAuthorIDFromRequestURL(
    #         request, self.kwargs['author_id'])
    #     author = get_object_or_404(Author, id=author_id)
    
    #     followers = get_object_or_404(Follower, owner=author)
    #     if follower_id in followers.items:
    #         f = get_object_or_404(Author, id=follower_id)
    #         return Response({'exist': True})
    #     else:
    #         return Response({'exist': False}, 404)