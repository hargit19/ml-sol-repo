**HOW TO RUN THIS PROJECT ON LOCALHOST**

1. Fork the repo and clone it in your local machine.
2. Go to '/pvpowerwebapp-main/src/config.js' and update the config file by giving the desired values for (backendApp, flaskServer) they should hold the IP and the port used for the Nodjs backend and Flask respectively.
3. cd to '/pvpowerwebapp-main' and run 'npm install'. once installation is complete, run 'npm start'. This will run frontend on localhost:3000.
4. Go to '/pvpowerbackend-main' and make sure to have '.env' file ready one template is available under name '.env.template'.
5. In '/pvpowerbackend-main' run command - 'npm install'. Then, run the command - 'npm run devStart' to start the backend.
6. Now, go to '/Model-master', create a virtual environment by  following steps from https://dev.to/mursalfk/setup-flask-on-windows-system-using-vs-code-4p9j and run the command 'pip install -r requirements.txt'
7. In file 'Model-master/app.py', update the values of the follwing variables according to your setup:
   1. frontendPort = "**3000**" # the port on which you are hosting the frontend (need to be changed if frontend port was changed)
   2. conncetionString = "mongodb+srv://**USERNAME**:**PASSWORD**@cluster0.2r3nfcd.mongodb.net/?retryWrites=true&w=majority&appName=**APPNAME**"
   3. dbName = "**DATABASE NAME**"
8. Now, go to '/Model-master'  and then activate the virtual environment by running '[location of model master folder]/.venv/Scripts/Activate.ps1'. Then run command 'flask run' to start the flask server.
