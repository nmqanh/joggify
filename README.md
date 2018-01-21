# Joggify
Joggify is a web application that allows users to track their jogging time and build up their motivation.


## Basic technologies used within the project

1. For Back-end:
  * Backbone: `rails 5.1`
  * Authentication: `devise` with `devise_token_auth`
  * Authorization: `pundit`
  * Test: `rspec` with `factory_bot`
  * Lint: `rubocop` with rules get from official rails project
  * Assets Bundler: `webpacker`
  * and some other gems

2. For Front-end:
  * Backbone: `react` 16 with `redux` (Single Page App with Flux architecture)
  * Router: `react-router`
  * UI framework: `material-ui-next`
  * Form handling: `redux-form`
  * Development: `webpack-dev-server` and `react-hot-loader` for Hot reloading when coding
  * Lint: `eslint` with recommended rules for react
  * and some other node_modules

## How to setup the project for development

1. Make sure your Environment is ready!
	* Install `Ruby 2.4.3` with bundler.
	* Install `Node 6.12.3` or above.
  * Install `yarn` with `npm install -g yarn`.
	* Have your local `Postgres` server ready, use version 9.4 or higher.
  * Pull latest source code of joggify to your computer.
  * `cd` to the folder that store the source code.

2. Configurate
  * Update config/database.yml your local credentials for Postgres access.

3. Install libraries

        # Install Gems
        bundle install

        # Install node_modues
        yarn install

        # Install foreman
        gem install foreman

4. Initialise the database

        bundle exec rake db:drop db:create db:migrate

7. Seed the database with example data:

        bundle exec rake db:seed

8. Start hacking by running

        npm run dev

Done! You're ready to access the application: [localhost:3000](http://localhost:3000).

## Sample users with scenarios

1. Admin:
  * Email: `bob.admin@joggify.herokuapp.com`
  * Password: `bob.admin`
  * Permission:
      * This user can CRUD any time entry of any user
      * This user can view time entries reports of any user.
      * This user can CRUD any user.
      * This user cannot delete himself.

2. Manager:
  * Email: `alice.manager@joggify.herokuapp.com`
  * Password: `alice.manager`
  * Permission:
      * This user can CRUD time entry of herself.
      * This user can view time entries reports of herself.
      * This user cannot CRUD time entry of any other user.
      * This user cannot view time entries reports of any other user.
      * This user can CRUD any user who is `manager` or `user`.
      * This user cannot delete herself.
      * This user cannot CRUD any admin user.

3. User:
  * Email: `carol.user@joggify.herokuapp.com`
  * Password: `carol.user`
  * Permission:
      * This user can CRUD time entry of herself.
      * This user can view time entries reports of herself.
      * This user cannot CRUD time entry of any other user.
      * This user cannot view time entries reports of any other user.
      * This user cannot CRUD any other user.
      * This user cannot delete himself.

## Run Linting and Tests

1. Run eslint and rubocop

        # Check linting for js code
        npm run lint

        # Check linting for ruby code
        rubocop

2. Run Rspec Specs (E2E tests and Unit tests included)

        bundle exec rspec
