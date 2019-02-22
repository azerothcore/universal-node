# HW Universal Node

This is a boilerplate project that allows you to start creating an **Universal NodeJS Server**.
It uses **Sequelize** and **Apollo Express server for GraphQL**, automatically connected by **sequelize-graphql-schema** library.

It allows you to have a REST capable server with free graphql APIs for your database! Letting you to focus on writing sequelize models 
and applying your security/logic middlewares.

No need to write SQL, schemas, queries and mutations!* 


* If you need more advanced queries/mutations you can overwrite/extends autogenerated methods.

**Moreover it's preconfigured to have:**
+ path aliases
+ full-working intellisense
+ debug configurations
+ modular directory structure
+ formatting rules and settings for visual studio code
+ automatic installation of missing npm modules at start
+ GraphQL and REST ready
+ it works great with: [HW Universal Client](http://hw-core.github.io/universal-pwa/)
  
and many other useful features allowing you to develop at the best!

So please, use VSCode, try to be [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), comment your code with [JSDocs](http://usejsdoc.org/),
learn to use Javascript ES6 best practices and patterns!

**Note:** we're using 4 spaces (instead of 2 that is common in javascript because of [callback hell](http://callbackhell.com/)) because it discourages nesting. In fact reducing the spaces to fit more levels in is a counterproductive idea. Use async/await as much as possible. 

### How to install

1. npm install
2. create a copy of /src/conf/conf.dist.js and rename in conf.js (do not delete or rename the .dist.js file directly!)
3. create a copy of /src/conf/database.dist.js and rename in database.js (do not delete or rename the .dist.js file directly!)
4. Configure your conf.js and database.js

### How to develop

There are various tools inside this repo, however in most cases you just need to edit following files:

1. **package.json:** app name, version etc.
2. **conf/**: runtime configuration files
3. **src/** sources to implement your logic
4. **optional:** other /apps/ configurations

### How to run (development):

1. npm run start

## Directory Structure

This project follows partially the [hw-core directory structure](http://hw-core.github.io/directory-structure/) on (CRA folder structure)[https://facebook.github.io/create-react-app/docs/folder-structure]

With following specs:

* apps: tools used by the project for specific tasks 
* conf: platform configuration files
* deps: internal reusable dependencies **(they can be shared between projects)**
* modules: optional and pluggable modules to extend app functionalities
* src: application sources
  * database: sequelize migrations and seeders  
  * server: server boot files
  * system: models/entities and apis

For internal deps and modules we're using [subrepo](https://github.com/ingydotnet/git-subrepo) instead of subtree/submodule that
are not enough to both include a git based dependency and working on it at the same time. 
You can check the app.sh script to see how to sync your dependencies.

## Folder aliases:

We're monkey-patching the CRA via [craco](https://github.com/sharegate/craco/blob/master/README.md) library allowing us to 
create some useful path alias to avoid relative path hell: ( ../../ )

So you can use paths defined in cra-config.js file:

        "@this": ".", // this is the root alias
        "@hw-core": '/deps/hw-core'

