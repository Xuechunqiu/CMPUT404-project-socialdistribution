# Miscellaneous

Some odds and ends.

1. `Name`: postgresql.sh  
   `Description`: Setup PostgreSQL server locally using Docker.  
   `Note`: 
      * a. If Docker doesn't installed on your Mac, `brew install --cask docker`, then `open /Applications/Docker.app`.  
      * b. How to remove docker volume: `docker volume rm postgresql_data_volume`  

   `Usage`: `chmod +x postgresql.sh && ./postgresql.sh`
2. `Name`: predeploy.sh  
   `Description`: As its name suggests, this script will setup everything needed before deploy.  
   `Usage`: `chmod +x predeploy.sh && ./predeploy.sh`  
   `Note`: This script depends on the project file struct, so please do not change file structure unless you know what you are doing.

3. `Name`: deploy.sh  
   `Description`: As its name suggests, this script will deploy the app on heroku.  
   `Usage`: `chmod +x deploy.sh && ./deploy.sh`  
   `Note`:
      * a. This script depends on the project file struct, so please do not change file structure unless you know what you are doing.  
      * b. You should change the scripts variable herokuappname to your own app name (eg. herokuappname=yourappname).    
4. `Name`: createsu.sh    
   `Description`: Create an superuser on the remote deployed heroku app.    
   `Usage`: `chmod +x createsu.sh && ./createsu.sh`    
   `Note`:
      * You should change the scripts variable herokuappname to your own app name (eg. herokuappname=yourappname).
5. `Name`: gen.py    
   `Description`: Generate http basic auth header.    
   `Usage`: `python3 gen.py`    
   `Note`:
      * You should using python3 to run the script.
6. `Name`: env.py    
   `Description`: Environment variables used when deploy.    
   `Usage`: `python3 env.py`    
   `Note`:
      * a. Before use, you should change the configurations accordingly.
      * b. This will simply print out a base64 encoded string.
      * c. Usually this script will be used with deploy.sh at the same time.
7. `Name`: genschema.sh    
   `Description`: Generate openapi(swagger) schema yaml.    
   `Usage`: `chmod +x genschema.sh && ./genschema.sh`    
   `Note`:
      * a. Before use, you should change the configurations accordingly.
      * b. After docs generation complete, you will find a docs.yaml file in the same folder where this script exists.
      * c. This script is file structure dependent, unless you know what you are doing, do not change file structure.
      * d. Change head.yaml accordingly.
      * e. Online html generation: after docs.yaml successfully generated, go to https://editor.swagger.io/, at the top-left corner, select "File", select "Import file". Then select "Generate Client", select "html", you will get a zip file containing a html single page that can be hosted on the github gh-pages branch.
      * f. You will get possible warnings (in terminal) or errors (in the swagger webpage), they were induced by the same operation id, you will need to correct them first.
8. `Name`: gendocshelper.py    
   `Description`: Docs generation helper.    
   `Usage`: `DO NOT USE INDIVIDUALLY`    
9. `Name`: genhtml.sh    
   `Description`: Generate single html webpage of api schema for hosting.    
   `Usage`: `chmod +x genhtml.sh && ./genhtml.sh`    
   `Note`:
      * a. After docs generation complete, you will find a index.html file in the same folder where this script exists.
      * b. This script is file structure dependent, unless you know what you are doing, do not change file structure.
      * c. You need java to run this script.
      * d. Offline html generation: you should run this script after you run gendocs.sh.
10. `Name`: runtest.sh    
   `Description`: Run backend unit test.    
   `Usage`: `chmod +x runtest.sh && ./runtest.sh`    
   `Note`:
      * a. This script is file structure dependent, unless you know what you are doing, do not change file structure.
      * b. Make sure you made database migrations before run this script.