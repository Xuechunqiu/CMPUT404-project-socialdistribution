from rest_framework.test import APITestCase
from presentation.models import Author, Post, Comment
from rest_framework import status
import base64
import presentation.Tests.constants as constants
import json

class CommentTestCase(APITestCase):

  def test_comment(self):
    # johnwick sign up
    payload = {
        "displayName": "johnwick",
        "email": "johnwick@fake.email",
        "password": "johnwick123456",
        "username": "johnwick",
        "github": "https://github.com/johnwick"
    }
    response = self.client.post(constants.SIGNUP_POST, payload)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    response_json = json.loads(response.content.decode('utf-8'))
    self.assertTrue(response_json['msg'])
    self.assertEqual(response_json['msg'], constants.SIGNUP_SUCCESS)
    # activate
    johnwick_user = Author.objects.get(displayName="johnwick").user
    johnwick_user.is_active = True
    johnwick_user.save()
    # johnnysilverhand sign up
    payload = {
        "displayName": "johnnysilverhand",
        "email": "johnnysilverhand@fake.email",
        "password": "johnnysilverhand123456",
        "username": "johnnysilverhand",
        "github": "https://github.com/johnnysilverhand"
    }
    response = self.client.post(constants.SIGNUP_POST, payload)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    response_json = json.loads(response.content.decode('utf-8'))
    author = response_json['id']
    self.assertTrue(response_json['msg'])
    self.assertEqual(response_json['msg'], constants.SIGNUP_SUCCESS)
    # activate
    johnnysilverhand_user = Author.objects.get(displayName="johnnysilverhand").user
    johnnysilverhand_user.is_active = True
    johnnysilverhand_user.save()
    # no post yet
    self.assertEqual(Post.objects.count(), 0)
    # make public post
    payload = {
      "author": response_json['id'],
      "authorID": response_json['id'],
      "categories": '["test"]',
      "content": "content",
      "contentType": "text/plain",
      "count": 0,
      "description": "description",
      "origin": response_json['id'],
      "size": 0,
      "source": response_json['id'],
      "title": "title",
      "unlisted": False,
      "visibility": "PUBLIC"
    }
    header = {
      "HTTP_AUTHORIZATION": "Basic " + base64.b64encode("johnwick:johnwick123456".encode()).decode()
    }
    response = self.client.post(response_json['url']+"/posts/", payload, **header)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    # should be 1 post
    self.assertEqual(Post.objects.count(), 1)
    # is the post exactly as we post?
    post = Post.objects.get(author=response_json['id'])
    self.assertEqual(post.categories, '["test"]')
    self.assertEqual(post.content, "content")
    self.assertEqual(post.contentType, "text/plain")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, response_json['id'])
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, response_json['id'])
    self.assertEqual(post.title, "title")
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "PUBLIC")
    # no comment yet
    self.assertEqual(Comment.objects.count(), 0)
    # johnnysilverhand made some comment on johnwick's post
    response_json = json.loads(response.content.decode('utf-8'))
    payload = {
      "author": author,
      "comment": constants.LOTS_OF_GUNS,
      "contentType": "text/markdown",
      "postID": response_json['id']
    }
    header = {
      "HTTP_AUTHORIZATION": "Basic " + base64.b64encode("johnnysilverhand:johnnysilverhand123456".encode()).decode()
    }
    response = self.client.post(response_json['id'] + '/comments/', payload, **header)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    # should be one comment exist
    self.assertEqual(Comment.objects.count(), 1)
    # is comment content correct?
    comment = Comment.objects.get(author=author)
    self.assertEqual(comment.author, author)
    self.assertEqual(comment.comment, constants.LOTS_OF_GUNS)
    self.assertEqual(comment.contentType, "text/markdown")
    self.assertEqual(comment.post, response_json['id'])