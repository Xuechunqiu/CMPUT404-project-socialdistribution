from rest_framework.test import APITestCase
from presentation.models import Author, Post
from rest_framework import status
import base64
import presentation.Tests.constants as constants
import json

class PostTestCase(APITestCase):

  def test_public_post(self):
    # sign up
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


  def test_private_post(self):
    # sign up
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
      "visibility": "FRIENDS"
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
    self.assertEqual(post.visibility, "FRIENDS")


  def test_commonmark_post(self):
    # sign up
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
    # make public post
    payload = {
      "author": response_json['id'],
      "authorID": response_json['id'],
      "categories": '["test"]',
      "content": "content",
      "contentType": "text/markdown",
      "count": 0,
      "description": "description",
      "origin": response_json['id'],
      "size": 0,
      "source": response_json['id'],
      "title": "title",
      "unlisted": False,
      "visibility": "FRIENDS"
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
    self.assertEqual(post.contentType, "text/markdown")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, response_json['id'])
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, response_json['id'])
    self.assertEqual(post.title, "title")
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")


  def test_categories_post(self):
    # sign up
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
    # make public post
    payload = {
      "author": response_json['id'],
      "authorID": response_json['id'],
      "categories": '["test", "dog"]',
      "content": "content",
      "contentType": "text/markdown",
      "count": 0,
      "description": "description",
      "origin": response_json['id'],
      "size": 0,
      "source": response_json['id'],
      "title": "title",
      "unlisted": False,
      "visibility": "FRIENDS"
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
    self.assertEqual(post.categories, '["test", "dog"]')
    self.assertEqual(post.content, "content")
    self.assertEqual(post.contentType, "text/markdown")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, response_json['id'])
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, response_json['id'])
    self.assertEqual(post.title, "title")
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")


  def test_edit_post(self):
    # sign up
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
    # make public post
    payload = {
      "author": response_json['id'],
      "authorID": response_json['id'],
      "categories": '["test", "dog"]',
      "content": "content",
      "contentType": "text/markdown",
      "count": 0,
      "description": "description",
      "origin": response_json['id'],
      "size": 0,
      "source": response_json['id'],
      "title": "title",
      "unlisted": False,
      "visibility": "FRIENDS"
    }
    header = {
      "HTTP_AUTHORIZATION": "Basic " + base64.b64encode("johnwick:johnwick123456".encode()).decode()
    }
    response = self.client.post(response_json['url']+"/posts/", payload, **header)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    # should be 1 post
    self.assertEqual(Post.objects.count(), 1)
    # is the post exactly as we post?
    author = response_json['id']
    post = Post.objects.get(author=author)
    self.assertEqual(post.categories, '["test", "dog"]')
    self.assertEqual(post.content, "content")
    self.assertEqual(post.contentType, "text/markdown")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, response_json['id'])
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, response_json['id'])
    self.assertEqual(post.title, "title")
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")
    response_json = json.loads(response.content.decode('utf-8'))
    # modified content
    payload['content'] = "modified"
    response = self.client.put(response_json['id']+'/', payload, **header)
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    # is the post modified?
    post = Post.objects.get(author=author)
    self.assertEqual(post.categories, '["test", "dog"]')
    self.assertEqual(post.content, "modified")
    self.assertEqual(post.contentType, "text/markdown")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, author)
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, author)
    self.assertEqual(post.title, "title")
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")

  def test_delete_post(self):
    # sign up
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
    # make public post
    payload = {
      "author": response_json['id'],
      "authorID": response_json['id'],
      "categories": '["test", "dog"]',
      "content": "content",
      "contentType": "text/markdown",
      "count": 0,
      "description": "description",
      "origin": response_json['id'],
      "size": 0,
      "source": response_json['id'],
      "title": "title",
      "unlisted": False,
      "visibility": "FRIENDS"
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
    self.assertEqual(post.categories, '["test", "dog"]')
    self.assertEqual(post.content, "content")
    self.assertEqual(post.contentType, "text/markdown")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, response_json['id'])
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, response_json['id'])
    self.assertEqual(post.title, "title")
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")
    # now delete
    payload = {}
    response_json = json.loads(response.content.decode('utf-8'))
    response = self.client.delete(response_json['id']+'/', payload, **header)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    # should be no post left
    self.assertEqual(Post.objects.count(), 0)


  def test_edit_post_multi(self):
    # sign up
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
    # make public post
    payload = {
      "author": response_json['id'],
      "authorID": response_json['id'],
      "categories": '["test", "dog"]',
      "content": "content",
      "contentType": "text/markdown",
      "count": 0,
      "description": "description",
      "origin": response_json['id'],
      "size": 0,
      "source": response_json['id'],
      "title": "title",
      "unlisted": False,
      "visibility": "FRIENDS"
    }
    header = {
      "HTTP_AUTHORIZATION": "Basic " + base64.b64encode("johnwick:johnwick123456".encode()).decode()
    }
    response = self.client.post(response_json['url']+"/posts/", payload, **header)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    # should be 1 post
    self.assertEqual(Post.objects.count(), 1)
    # is the post exactly as we post?
    author = response_json['id']
    post = Post.objects.get(author=author)
    self.assertEqual(post.categories, '["test", "dog"]')
    self.assertEqual(post.content, "content")
    self.assertEqual(post.contentType, "text/markdown")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, response_json['id'])
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, response_json['id'])
    self.assertEqual(post.title, "title")
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")
    response_json = json.loads(response.content.decode('utf-8'))
    # modified content
    payload['content'] = "modified"
    payload['description'] = constants.NO_TOUCH_DOG
    payload['title'] = constants.EXCOMMUNICADO
    response = self.client.put(response_json['id']+'/', payload, **header)
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    # is the post modified?
    post = Post.objects.get(author=author)
    self.assertEqual(post.categories, '["test", "dog"]')
    self.assertEqual(post.content, "modified")
    self.assertEqual(post.contentType, "text/markdown")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, constants.NO_TOUCH_DOG)
    self.assertEqual(post.origin, author)
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, author)
    self.assertEqual(post.title, constants.EXCOMMUNICADO)
    self.assertFalse(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")


  def test_unlisted_post(self):
    # sign up
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
    # make public post
    payload = {
      "author": response_json['id'],
      "authorID": response_json['id'],
      "categories": '["test", "dog"]',
      "content": "content",
      "contentType": "text/markdown",
      "count": 0,
      "description": "description",
      "origin": response_json['id'],
      "size": 0,
      "source": response_json['id'],
      "title": "title",
      "unlisted": True,
      "visibility": "FRIENDS"
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
    self.assertEqual(post.categories, '["test", "dog"]')
    self.assertEqual(post.content, "content")
    self.assertEqual(post.contentType, "text/markdown")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, response_json['id'])
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, response_json['id'])
    self.assertEqual(post.title, "title")
    self.assertTrue(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")

  def test_image_post(self):
    # sign up
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
    # make public post
    payload = {
      "author": response_json['id'],
      "authorID": response_json['id'],
      "categories": '[]',
      "content": "http://fake.url",
      "contentType": "image/*",
      "count": 0,
      "description": "description",
      "origin": response_json['id'],
      "size": 0,
      "source": response_json['id'],
      "title": "title",
      "unlisted": True,
      "visibility": "FRIENDS"
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
    self.assertEqual(post.categories, '[]')
    self.assertEqual(post.content, "http://fake.url")
    self.assertEqual(post.contentType, "image/*")
    self.assertEqual(post.count, 0)
    self.assertEqual(post.description, "description")
    self.assertEqual(post.origin, response_json['id'])
    self.assertEqual(post.size, 0)
    self.assertEqual(post.source, response_json['id'])
    self.assertEqual(post.title, "title")
    self.assertTrue(post.unlisted)
    self.assertEqual(post.visibility, "FRIENDS")