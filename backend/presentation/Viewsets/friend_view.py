from presentation.models import Friend, Author
from django.shortcuts import get_object_or_404
from presentation.Serializers.friend_serializer import FriendSerializer
from presentation.Serializers.author_serializer import AuthorSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from urllib.parse import urlparse
from . import urlutil
from . import URL

'''
URL: ://service/author/{AUTHOR_ID}/friends
    GET: get a list of authors who are their friends
URL: ://service/author/{AUTHOR_ID}/friends/{FOREIGN_AUTHOR_ID}
    DELETE: remove a friend
    PUT: Add a friend (must be authenticated)
    GET check if friend
'''


def getAuthorIDFromRequestURL(request, id):
    host = urlutil.getSafeURL(request.build_absolute_uri())
    author_id = f"{host}/author/{id}"
    return author_id


class FriendViewSet(viewsets.ModelViewSet):
    serializer_class = FriendSerializer
    queryset = Friend.objects.all()
    # lookup_field = 'author'

    def list(self, request, *args, **kwargs):
        author_id = getAuthorIDFromRequestURL(
            request, self.kwargs['author_id'])
        # author = get_object_or_404(Author, id=author_id)
        queryset = Friend.objects.filter(owner=author_id)
        if queryset.exists():
            friends = Friend.objects.get(owner=author_id)
            return Response({
                'type': 'friend',
                'items': friends.items
            })
        else:
            Friend.objects.create(owner=author_id)
            return Response({
                'type': 'friend',
                'items': []
            })

    def retrieve(self, request, *args, **kwargs):
        request_data = request.query_params.copy()
        remote = request_data.get('remote', None)
        if remote == "true":
            friend_id = URL.remoteDomain + "/author/" + self.kwargs['foreign_author_id']
        else: 
            friend_id = getAuthorIDFromRequestURL(
            request, self.kwargs['foreign_author_id'])
        author_id = getAuthorIDFromRequestURL(
            request, self.kwargs['author_id'])
        # author = get_object_or_404(Author, id=author_id)
        friends = get_object_or_404(Friend, owner=author_id)
        if friend_id in friends.items:
            return Response({'exist': True})
        else:
            return Response({'exist': False})

    def put(self, request, *args, **kwargs):
        request_data = request.data.copy()
        remote = request_data.get('remote', None)
        if remote:
            new_f_id = URL.remoteDomain + "/author/" + self.kwargs['foreign_author_id']
        else: 
            new_f_id = getAuthorIDFromRequestURL(
            request, self.kwargs['foreign_author_id'])
        author_id = getAuthorIDFromRequestURL(
            request, self.kwargs['author_id'])
        # author = get_object_or_404(Author, id=author_id)
        friends = get_object_or_404(Friend, owner=author_id)
        
        if new_f_id in friends.items:
            return Response("Friend exists already.", 500)
        else:
            friends.items.append(new_f_id)
        friends.save()
        return Response("Friend is successfully added.", 204)

    def delete(self, request, *args, **kwargs):
        request_data = request.data.copy()
        remote = request_data.get('remote', None)
        if remote:
            friend_id = URL.remoteDomain + "/author/" + self.kwargs['foreign_author_id']
        else: 
            friend_id = getAuthorIDFromRequestURL(
            request, self.kwargs['foreign_author_id'])
        author_id = getAuthorIDFromRequestURL(
            request, self.kwargs['author_id'])
        # author = get_object_or_404(Author, id=author_id)
        friends = get_object_or_404(Friend, owner=author_id)
        try:
            friends.items.remove(friend_id)
            friends.save()
        except ValueError:
            return Response("No such a friend. Deletion fails.", 500)
        return Response("Delete successful")
