const express = require('express');
const router = express.Router();
const userController = require('./../../app/controllers/userController');
const appConfig = require('./../../config/appConfig');

module.exports.setRouter = (app) => {

    let baseUrl  = `${appConfig.apiVersion}/users`;
     
    app.post(`${baseUrl}/register`,userController.signUpFunction);

    app.post(`${baseUrl}/login`,userController.loginFunction);
}