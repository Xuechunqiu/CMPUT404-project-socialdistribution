#!/bin/bash
venvpath=/home/user/Temp/404/venv # change to your python virtual environment absolute path
cd ../backend
source $venvpath/bin/activate
python manage.py test presentation.Tests