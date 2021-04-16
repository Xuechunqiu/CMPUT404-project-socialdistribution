from rest_framework.test import APITestCase
from presentation.models import Author, Follower, Friend, Post
from rest_framework import status
import base64
import presentation.Tests.constants as constants
import json

def test_share(self):
    # sign up
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
    self.assertTrue(response_json['msg'])
    self.assertEqual(response_json['msg'], constants.SIGNUP_SUCCESS)
    # activate
    johnnysilverhand_user = Author.objects.get(displayName="johnnysilverhand").user
    johnnysilverhand_user.is_active = True
    johnnysilverhand_user.save()

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
    # no post yet
    self.assertEqual(Post.objects.count(), 0)
    johnwick = Author.objects.get(displayName="johnwick").id
    johnnysilverhand = Author.objects.get(displayName="johnnysilverhand").id
    # johnwick shared johnnysilverhand's post
    payload = {
      "author": johnwick,
      "authorID": johnwick,
      "categories": '["test"]',
      "content": "content",
      "contentType": "text/plain",
      "count": 0,
      "description": "description",
      "origin": johnnysilverhand,
      "size": 0,
      "source": johnwick,
      "title": "title",
      "unlisted": False,
      "visibility": "FRIENDS"
    }
    header = {
      "HTTP_AUTHORIZATION": "Basic " + base64.b64encode("johnwick:johnwick123456".encode()).decode()
    }
    response = self.client.post(response_json['url']+"/posts/", payload, **header)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(Post.objects.count(), 1)
    post = Post.objects.get(author=johnwick)
    self.assertEqual(post.categories, '["test"]')
    self.assertEqual(post.content, "content")
    self.assertEqual(post.contentType, "text/plain")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, johnnysilverhand)
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, johnwick)
    self.assertEqual(post.title, "title")
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")