from rest_framework.test import APITestCase
from presentation.models import Author, Follower, Friend
from rest_framework import status
import base64
import presentation.Tests.constants as constants
import json

class FollowTestCase(APITestCase):

  def test_follow(self):
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
    # johnwick follow johnnysilverhand
    johnwick = Author.objects.get(displayName="johnwick").id
    johnnysilverhand = Author.objects.get(displayName="johnnysilverhand").id
    payload = {
      "actor": johnwick.replace("http://testserver/author/",""),
      "object": johnnysilverhand
    }
    header = {
      "HTTP_AUTHORIZATION": "Basic " + base64.b64encode("johnwick:johnwick123456".encode()).decode()
    }
    # no followers
    self.assertEqual(len(Follower.objects.get(owner=johnnysilverhand).items), 0)
    response = self.client.put(johnnysilverhand+'/followers/'+johnwick.replace("http://testserver/author/","")+"/", payload, **header)
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    # followers should be one
    self.assertEqual(len(Follower.objects.get(owner=johnnysilverhand).items), 1)