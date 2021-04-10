#!/bin/bash
venvpath=/home/user/Temp/404/venv # change to your python virtual environment absolute path
cd ../backend
source $venvpath/bin/activate
python manage.py generateschema --file docs.yaml
mv docs.yaml ../misc
cd ../misc
python gendocshelper.py
cat head.yaml nohead.yaml > docs.tmp.yaml
rm docs.yaml nohead.yaml
mv docs.tmp.yaml docs.yaml
