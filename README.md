
# Development environment

## Start MongoDB

`rm -fr data && mkdir -p data && mongod --dbpath data`

## Start the application

`nodemon server.js`


# Production

* Make sure the application is configured to talk to a MongoDB instance
* `npm start`
