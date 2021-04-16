from rest_framework.test import APITestCase
from presentation.models import Author
from rest_framework import status
import presentation.Tests.constants as constants
import json

class ActivateTestCase(APITestCase):

  def test_non_activate(self):
      # sign up
      payload = {
          "displayName": "johnwick",
          "email": "johnwick@fake.email",
          "password": "johnwick123456",
          "username": "johnwick",
          "github": ""
      }
      response = self.client.post(constants.SIGNUP_POST, payload)
      self.assertEqual(response.status_code, status.HTTP_200_OK)
      response_json = json.loads(response.content.decode('utf-8'))
      self.assertTrue(response_json['msg'])
      self.assertEqual(response_json['msg'], constants.SIGNUP_SUCCESS)
      johnwick_author = Author.objects.get(displayName="johnwick")
      self.assertFalse(johnwick_author.user.is_active)

  def test_activate(self):
      # sign up
      payload = {
          "displayName": "johnwick",
          "email": "johnwick@fake.email",
          "password": "johnwick123456",
          "username": "johnwick",
          "github": ""
      }
      response = self.client.post(constants.SIGNUP_POST, payload)
      self.assertEqual(response.status_code, status.HTTP_200_OK)
      response_json = json.loads(response.content.decode('utf-8'))
      self.assertTrue(response_json['msg'])
      self.assertEqual(response_json['msg'], constants.SIGNUP_SUCCESS)
      johnwick_user = Author.objects.get(displayName="johnwick").user
      johnwick_user.is_active = True
      johnwick_user.save()
      johnwick_author = Author.objects.get(displayName="johnwick")
      self.assertTrue(johnwick_author.user.is_active)