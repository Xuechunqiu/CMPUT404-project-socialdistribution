from rest_framework.test import APITestCase
from presentation.models import Author
from rest_framework import status
import presentation.Tests.constants as constants
import json

class SignUpTestCase(APITestCase):

    def test_signup_with_github(self):
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


    def test_signup_without_github(self):
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


    def test_signup_none_github(self):
        payload = {
            "displayName": "johnwick",
            "email": "johnwick@fake.email",
            "password": "johnwick123456",
            "username": "johnwick"
        }
        response = self.client.post(constants.SIGNUP_POST, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_json = json.loads(response.content.decode('utf-8'))
        self.assertTrue(response_json['msg'])
        self.assertEqual(response_json['msg'], constants.SIGNUP_SUCCESS)