const express = require('express');
const router = express.Router();
const issueController = require('./../../app/controllers/issueController');
const appConfig = require('./../../config/appConfig');

module.exports.setRouter = (app) => {
    
    let baseUrl  = `${appConfig.apiVersion}/issue`;

    app.post(`${baseUrl}/createIssue`,issueController.createIssue);

    app.get(`${baseUrl}/viewAllIssue`,issueController.viewAllIssue);

    app.get(`${baseUrl}/viewIssue`,issueController.getSingleIssue);

}