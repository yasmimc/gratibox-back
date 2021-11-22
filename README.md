# Gratibox Backend

<p align="center" >
<img src="public/image05.webp" width="300" height="300"/>
</p>

## Tolling

NodeJs</br>
Express</br>
Jest</br>
Supertest</br>
Eslint</br>
Prettier<br>

## Requirements

You must have installed node and npm.

## How to run:

First run `npm i` to install all dependencies.

Use the sql script at to create your database structure.

SQL script here: https://github.com/yasmimc/gratibox-back/blob/9fbe68aac9f8f61002b3395c36c6c3b3ccfdf0d9/src/database/createDatabase.sql

And then create a .env.test file following as an example the .env.example file, setting the environment variables accordingly. with data from your database.

The .env.example file here: https://github.com/yasmimc/gratibox-back/blob/2be1316d9f48fe8922d43f8a08847db4e91dcec9/.env.example

In the project directory, you can run:

### `npm start`

Runs the app in the production mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the sequencial mode.

### `npm run test:watch`

Launches the test runner in the interactive watch mode.

### Deployment

This api is deployed on Heroku, you can visit it by accessing the url https://gratibox-project.herokuapp.com/.
