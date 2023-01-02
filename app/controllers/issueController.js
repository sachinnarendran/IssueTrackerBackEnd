const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libraries/timeLib');
const response = require('./../libraries/responseLib');
const logger = require('./../libraries/loggerLib');
const validateInput = require('./../libraries/paramsValidationLib');
const check = require('./../libraries/checkLib');
const token = require('./../libraries/tokenLib');
const { error } = require('./../libraries/loggerLib');

const IssueModel = mongoose.model('Issue');

let createIssue = (req,res) => {

    let validateIssueDetails = () =>{
        console.log(req.body.issueTitle);
        return new Promise((resolve,reject)=>{
            if(req.body.issueTitle)
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
                    resolve(req);
                }
            }
        })
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
        .then(saveIssue)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Issue Created Successfuly', 200, resolve)
            res.send(apiResponse);
        })
        .catch((err) => {
            res.send(err);
        })
}

// End of Create Issue Function

//Start of View All Issue Function

let viewAllIssue = (request,resp) =>
{
    let issueTotalCount;
    let pageLimit = parseInt(request.query.pageSize);
    let pageNumber = parseInt(request.query.pageNumber);
    let getIssueCount = () =>
    {
        return new Promise((resolve,reject)=>
        {
            IssueModel.estimatedDocumentCount({},(err,count)=>
            {
                if(err)
                {
                console.log(err);
                reject(err)
                }
                else
                {
                    issueTotalCount = count;
                    resolve(count);
                }

            })
        })
        
    }

    let findIssue = () =>
    {
        return new Promise((resolve,reject)=>
        {
            IssueModel.find({})
            .skip(pageNumber*pageLimit)
            .limit(pageLimit) 
            .select('-__v -_id')
                .lean()
                .exec((err,issues) => 
                {
                    if(err)
                    {
                        logger.error(err.message,"View All Issue : Issue Controller",10);
                        let apiResponse = response.generate(true,'Unable to find Issues',500,null);
                        reject(apiResponse);
                    }
                    else if(check.isEmpty(issues))
                    {
                        logger.error(err.message,"ViewAllIssue: Issue Controller",10);
                        let apiResponse = response.generate(true,'No Issues Found',400,null);
                        reject(apiResponse);
                    }
                    else
                    {
                        let apiResponse = response.generate(false,'Found the List of All Issue',200,issues);
                        resolve(apiResponse);
                    }
            })
        })
    }

        getIssueCount().
        then(findIssue)
        .then((resolve) => 
        {
            let apiResponse = response.generate(false,'List Of Issue',200,resolve);
            apiResponse.data.issueCount = issueTotalCount;
            resp.send(apiResponse);
        })
        .catch((err)=>
        {
            resp.send(err);
        });    

        
    }




let getSingleIssue = (req,res) => {
    console.log(req);
    console.log(req.query.issueId);
    IssueModel.findOne({'issueId':req.query.issueId})
    .select('-__v -_id')
    .lean()
    .exec((err,result)=>{
        console.log(result);
        if(err)
        {
            logger.error(err.message,'Get Single issue',30);
            console.log("Issue Not Found");
            let apiResponse = response.generate(true,'Unable to find the Issue Now',500,null);
            res.send(apiResponse);
        }
        else if(check.isEmpty(result))
        {
            let apiResponse = response.generate(true,'Didnt find the requested Issue',400,null);
            res.send(apiResponse);

        }
        else
        {
            let apiResponse = response.generate(false,'Issue Found for the Mentioned Id',200,result);
            res.send(apiResponse);
        }
    })
}

//Beginning of Update Issue
let updateIssue = (req,res) => {
    let options = {$set: req.body}
    IssueModel.update({'issueId':req.params.issueId},options)
            .select('-__v -_id')
            .lean()
            .exec((err,result) => {
                if(err)
                {
                    if(err.code === 11000)
                    {
                        logger.error(err.message,"Issue Controller:Update Issue",10);
                        let apiResponse = response.generate(true,'Update Failed for Issue, Issue ID Exists',400,null);
                        res.send(apiResponse);
                    }
                    else 
                    {
                        logger.error(err.message,"Issue Controller:Update Issue",10);
                        let apiResponse = response.generate(true,'Update Failed for Issue',404,null);
                        res.send(apiResponse);
                    }
                }
                else if(check.isEmpty(result))
                {
                        logger.error(err.message,"Issue Controller:Update Issue",10);
                        let apiResponse = response.generate(true,"Update Failed . Because No Issue Like this Exist",404,null);
                        res.send(apiResponse);
                }
                else{
                    let apiResponse = response.generate(false,'Update Succeeded',200,result);
                    res.send(apiResponse);
                }
            })
}

//Add Watcher
let addWatcher = (req,res) =>
{
    console.log(req.body.watching);
    let options = {$push: {issueWatchers: req.body.watching }};
    IssueModel.update({'issueId':req.body.issueId},options)
                .exec((err,result) =>{
                    if(err)
                    {
                        logger.error(err.message,'Issue Controller:Unable to Add Watcher due to Database Issue',10);
                        let apiResponse = response.generate(true,'Unable to Add as watcher',500,null);
                        res.send(apiResponse);
                    }
                    else
                    {
                        let apiResponse = response.generate(false,'Successfully Added as Watcher',200,result);
                        res.send(apiResponse);
                    }
                })
}

//Add Comments Functionality
let addComments = (req,res) => 
{
    let options = {$push:{issueComments: req.body.comment}}
    IssueModel.update({'issueId':req.body.issueId},options)
                .exec((err,result) => {
                    if(err)
                    {
                        logger.error(true,'Issue Controller:Unable to Add Comments',10);
                        let apiResponse = response.generate(true,'Unable to Add Comments',400,null);
                        res.send(apiResponse);
                    }
                    else{
                        let apiResponse = response.generate(false,'Comment Addedd Succesfully',200,result);
                        res.send(apiResponse);
                    }
                })
}

module.exports = {
    createIssue:createIssue,
    getSingleIssue: getSingleIssue,
    viewAllIssue:viewAllIssue,
    updateIssue:updateIssue,
    getSingleIssue:getSingleIssue,
    addWatcher:addWatcher,
    addComments:addComments
};