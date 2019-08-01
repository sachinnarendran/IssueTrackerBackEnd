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
                else if(check.isEmpty(req.body.issueDescription))
                {
                    let apiResponse = response.generate(true,'Issue Description Missing',400,null);
                    reject(apiResponse);
                }
                else if(check.isEmpty(req.body.issueReporter))
                {
                    let apiResponse = response.generate(true,'Reporter of the Issue is required',400,null);
                    reject(apiResponse);
                }
                else if(check.isEmpty(req.body.issueAssignee))
                {
                    let apiResponse = response.generate(true,'The person to whom this issue is being assigned is required',400,null);
                    reject(apiResponse);
                }
                else{
                    let apiResponse = response.generate(true,'Issue id is Mandatory,400',null);
                    reject(apiResponse);
                }
            }
        }))
    }
//End of Validate Issue Details Function
    let saveIssue = () => {
        return new Promise((resolve,reject) => {
            IssueModel.findOne({issueId:req.body.issueId})
                .exec((err,retrievedIssueDetails) => {
                    if(err)
                    {
                        logger.error(err.message,"Issue Controller: Create Issue/Save Issue",10);
                        let apiResponse = response.generate(true,"Failed to Create Issue",500,null);
                        reject(apiResponse);
                    }
                    else if(check.isEmpty(retrievedIssueDetails))
                    {
                        let newIssue = new IssueModel({
                            issueId:shortid.generate(),
                            issueTitle:req.body.issueTitle,
                            issueDescription:req.body.issueDescription,
                            issueStatus:req.body.issueStatus,
                            issueReporter:req.body.issueReporter,
                            issueAssignee:req.body.issueAssignee,
                            issueScreenshotUrl:req.body.issueScreenshotUrl,
                            createdOn:time.now()
                        });
                        newIssue.save((err,newIssue)=> {
                            if(err)
                            {
                                logger.error(err.message,"Issue Constroller: While tryin to save issue after mapping Object",10);
                                let apiResponse = response.generate(true,"Failed to Create Issue",400,null);
                                reject(apiResponse);
                            }
                            else
                            {
                                let newIssueObject = newIssue.toObject();
                                resolve(newIssueObject);
                            }
                        })
                    }
                    else
                    {
                       logger.error('Issue Cannot be Created, Issue Already Present','Issue Controller:Create Issue',4) ;
                       let apiResponse = response.generate(true,"Failed to Create Issue because Issue Already Present",400,null);
                    }
                })
        })
    }

    validateIssueDetails(req,res)
        .then(createIssue)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Issue Created Successfuly', 200, resolve)
            res.send(apiResponse);
        })
        .catch((err) => {
            res.send(err);
        })
}

// End of Create Issue Function

let viewAllIssue = (req,res) => {
    IssueModel.find()
            .select('__v')
            .lean
            .exec((err,result) => {
                if(err)
                {
                    logger.error(err.message,"View All Issue : Issue Controller",10);
                    let apiResponse = response.generate(true,'Unable to find Issues',500,null);
                    res.send(apiResponse);
                }
                else if(check.isEmpty(result))
                {
                    logger.error(err.message,"View All Issue: Issue Controller",10);
                    let apiResponse = response.generate(true,'No Issues Found',400,null);
                    res.send(apiResponse);
                }
                else
                {
                    let apiResponse = response.generate(false,'Found Issue',200,result);
                }
            })
}


module.exports = {
    createIssue:createIssue
};