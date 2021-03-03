from presentation.models import Author, Follower, Post, Comment, Likes
from django.shortcuts import get_object_or_404
from presentation.Serializers.likes_serializer import LikesSerializer
from rest_framework import viewsets, status
from django.http import JsonResponse
from rest_framework.response import Response
import uuid
from urllib.parse import urlparse

def getAuthorIDFromRequestURL(request, id):
    parsed_url = urlparse(request.build_absolute_uri())
    host = '{url.scheme}://{url.hostname}:{url.port}'.format(
        url=parsed_url)
    author_id = f"{host}/author/{id}"
    return author_id

def getPostIDFromRequestURL(request, id):
    post_id = f"/posts/{id}"
    return post_id

def getCommentIDFromRequestURL(request, id):
    comment_id = f"/comments/{id}"
    return comment_id

class LikesViewSet(viewsets.ModelViewSet):
    serializer_class = LikesSerializer
    queryset = Likes.objects.all()

    def list(self, request, *args, **kwargs):
        request_data = request.data.copy()
        liked_author_url = request_data.build_absolute_uri()
        _object = liked_author_url[:-6]
        if "comment" in _object:
            comment = get_object_or_404(Comment, id=_object)
            queryset = Likes.objects.filter(comment=comment)
            if queryset.exists():
                likes = Likes.objects.filter(comment=comment)
                likes = list(likes.values())
                return JsonResponse(likes,safe=False)
            else:
                Likes.objects.create(comment=comment)
                return Response({
                    'type': 'likes',
                    'items': []
            })
        else:
            post = get_object_or_404(Post,id=_object)  
            queryset = Likes.objects.filter(post=post)
            if queryset.exists():
                likes = Liked.objects.filter(post=post)
                likes = list(likes.values())
                return JsonResponse(likes,safe=False)
            else:
                Likes.objects.create(post=post)
                return Response({
                    'type': 'likes',
                    'items': []
                }) 

    
    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        
        author = request_data.get('author', None)
        context = request_data.get('@context',None)
        summary = request_data.get('summary',None)
        liked_author = request_data.build_absolute_uri()
        _object = liked_author[:-6]
        likes_data = {'@context':context,'summary': summary, 'author':author,'object':_object}

        queryset = Inbox.objects.filter(comment=_object)
        if queryset.exist():
            liked_comment = Comment.objects.filter(comment=_object)
            liked_author_id = liked_comment.commenter_id
        else:
            liked_author_id = getAuthorIDFromRequestURL(request, self.kwargs['author_id'])
            
        inbox = Inbox.objects.get(author = liked_author_id)
        inbox.items.append(likes_data)
        inbox.save()

        serializer = self.serializer_class(data=likes_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, 200)