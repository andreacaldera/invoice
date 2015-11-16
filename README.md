# Invoice

Create invoices in PDF format based on an HTML template.

## Development environment

### Pre-requisites

* Gulp: `npm install -g gulp`
* NPM dependencies: `npm install`
* [MongoD](https://docs.mongodb.org/manual/reference/program/mongod/)

### Test

`gulp test`

### Start development

This command starts MongoDB and bootstraps the Node application using Nodemon. 

`gulp dev`

### Start MongoDB

MongoDB will be running already by the dev gulp task.

`gulp start-mongo`

### Start the application

`gulp start-app`

## Production

Make sure the application is configured to talk to a MongoDB instance.

`npm start`