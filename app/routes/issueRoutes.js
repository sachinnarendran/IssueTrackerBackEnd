const express = require('express');
const router = express.Router();
const issueController = require('./../../app/controllers/issueController');
const appConfig = require('./../../config/appConfig');

module.exports.setRouter = (app) => {
    
    let baseUrl  = `${appConfig.apiVersion}/issue`;

    app.post(`${baseUrl}/createIssue`,issueController.createIssue);

    app.get(`${baseUrl}/viewAllIssue`,issueController.viewAllIssue);

    app.get(`${baseUrl}/viewIssue`,issueController.getSingleIssue);

    app.put(`${baseUrl}/updateIssue/:issueId`,issueController.updateIssue);

    app.put(`${baseUrl}/addWatcher`,issueController.addWatcher);

    app.put(`${baseUrl}/addComments`,issueController.addComments);

}