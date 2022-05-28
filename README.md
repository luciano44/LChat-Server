HTTP METHOD | ROUTE | DESCRIPTION
----|-------|---------
POST | /signin | Receives username and password in the request body and responds with an object containing a message and the JWT Token if the inputs are correct
POST | /signup | Receives all needed information to register an user in the request body and responds with an object containing a success message case the user was successfully registered or an error message case any of the inputs didn't match what was expected by the route
GET | /users/ | Return all registered users
GET | /users/:user | Return specified user
