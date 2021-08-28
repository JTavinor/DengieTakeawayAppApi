# Dengie Takeaway App API
Created using node.js with express and deployed on heroku

Give it a go at http://jtwordgame.herokuapp.com/

My Dengie Takeaway App API backend uses express and mongodb to send and retrieves menu and cuisine information, as well as posting new orders to the database

## This project showcases
An ability to create and deploy a node.js app.<br>
Handling GET, POST, PUT and DELETE requests for different routes, icluding parsing route parameters.<br>
Using mongoose to maintain a database in the cloud.<br>
Using express to build an API.<br>
Using schemas to create models and validate request bodies<br>
Setting request statuses and sending error messages in the response.<br>
Using custom and imported middleware, such as cors.<br>
Storing secret variable in a config module using environment variables.<br>
Using Postman in development for testing.<br>

## App
The base app is created using express. It includes checking for the existence of necessary environment variables on startup.<br>
It defines different routes and specifies which modules to use.<br>
It connects to a mongoose database in the cloud, using secret envirnoment variables.

## Models
Using mongoose schemas to define models, including nested schema for subdocuments

##Routes
### Cuisines
Get the list of cuisines, as well as the restaurants associated with them<br>
Post a new cuisine to the db.<br>


## Menus
Get all the menus.<br>
Get a specific menu.<br>
Add a new menu tot he db.<br>
Adding, deleting and finding a users wrong words
Put a new restaurant to a cuisine

## Orders
Post a new order to the db.

