from rest_framework.test import APITestCase
from presentation.models import Author
from rest_framework import status
import presentation.Tests.constants as constants
import json

class LoginTestCase(APITestCase):

  def test_activate_correct_password(self):
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
      # not active
      payload = {
          "username": "johnwick",
          "password": "johnwick123456"
      }
      response = self.client.post(constants.LOGIN_POST, payload)
      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
      # activate
      johnwick_user = Author.objects.get(displayName='johnwick').user
      johnwick_user.is_active = True
      johnwick_user.save()
      payload = {
          "username": "johnwick",
          "password": "johnwick123456"
      }
      response = self.client.post(constants.LOGIN_POST, payload)
      self.assertEqual(response.status_code, status.HTTP_200_OK)


  def test_activate_incorrect_password(self):
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
      # not active
      payload = {
          "username": "johnwick",
          "password": "johnwick123456"
      }
      response = self.client.post(constants.LOGIN_POST, payload)
      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
      # activate
      johnwick_user = Author.objects.get(displayName='johnwick').user
      johnwick_user.is_active = True
      johnwick_user.save()
      payload = {
          "username": "johnwick",
          "password": "johnwick123456incorrect"
      }
      response = self.client.post(constants.LOGIN_POST, payload)
      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)