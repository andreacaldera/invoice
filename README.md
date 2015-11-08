# Invoice

Create invoices in PDF format based an an HTML template.

## Development environment

### Pre-requisites

* Gulp: `npm install -g gulp`
* NPM dependencies: `npm install`
* [MongoD](https://docs.mongodb.org/manual/reference/program/mongod/)

### Test

`gulp test`

### Start MongoDB

`gulp start-mongo`

### Start the application

`gulp start-app`

### Start the application with nodemon

`gulp start-app-dev`

## Production

_Make sure the application is configured to talk to a MongoDB instance_

`npm start`