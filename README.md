# Invoice

## Run locally

```docker pull mongo```

```docker run -p 27017:27017 --name mongo mongo```

```npm run data-import```
```npm run build```
```MONGODB_PASSWORD=PASSWORD PORT=PORT npm start```

## docker

```docker build . -t local/invoice```

```docker run -p PORT:PORT local/invoice```


# Deployment
## Heroku

Useful commands
* heroku login
* heroku create
* git push heroku master
* heroku ps:scale web=1
* heroku config:set NPM_CONFIG_PRODUCTION=false
* heroku config:set MONGODB_PASSWORD=PASSWORD_HERE
* heroku open
* heroku container:login
* heroku container:push web
