# MetaMaskWalletNodeApp

The application is the demo for Meta Mask Wallet using web3js. The main idea behind this application was to send the Ether from one account to other. 

Prerequisite:
1) code editor like Visual Studio Code, Sublime, etc.
2) Download node version. installation link -> (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3) install all the packages using npm install.
4) installing mongodb. installationlink -> (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows)

Steps to start the project:
1) Start the mongodb server using below command on command prompt
    mongod -dbpath (your_root_directory)/MetaMaskNodeApp/PaymentChannelDB
2) Open your project directory using command prompt
3) Run the command npm install (running this command will install all the required npm libraries)
4) run command npm run start, this command will run the project on localhost:3000


Once the project is up and running the next step is to run the UI project which is built in AngularJS and it would be calling all the application service from this project.
GIT reference for Angular application -> 
