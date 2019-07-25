const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libraries/timeLib');
const passwordLib = require('./../libraries/generatePasswordLib');
const response = require('./../libraries/responseLib');
const logger = require('./../libraries/loggerLib');
const validateInput = require('./../libraries/paramsValidationLib');
const check = require('./../libraries/checkLib');
const token = require('./../libraries/tokenLib');

const IssueModel = mongoose.model('Issue');

let createIssue = (req,res) => {

    let validateIssueDetails = () =>{
        return new(Promise((resolve,reject)=>{
            if(req.body.issueId)
            {
                if(check.isEmpty(req.body.issueTitle))
                {
                    let apiResponse = response.generate(true, 'Issue Title ', 400, null);
                    reject(apiResponse);
                }
                if(check.isEmpty(req.body.issueDescription))
                {
                    let apiResponse = response.generate(true,'Issue Description Missing',400,null);
                    reject(apiResponse);
                }
                if(check.isEmpty(req.body.issueReporter))
                {
                    let apiResponse = response.generate(true,'Reporter of the Issue is required',400,null);
                    reject(apiResponse);
                }
                if(check.isEmpty(req.body.issueAssignee))
                {
                    let apiResponse = response.generate(true,'The person to whom this issue is being assigned is required',400,null);
                    reject(apiResponse);
                }
            }
        }))
    }
}