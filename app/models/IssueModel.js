const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Issue = new Schema({
    issueId:{
        type:String,
        unique:true
    },
    issueTitle:{
        type:String
    },
    issueDescription:{
        type:String
    },
    issueStatus:{
        type:String
    },
    issueReporter:{
        type:String
    },
    issueAssignee:{
        type:String
    },
    issueScreenshotUrl:{
        type:String
    },
    createdOn:{
        type:Date,
        default:time.now()
    },
    modifiedOn:{
        type:Date,
        default:time.now()
    },
    issueWatchers:[],
    
    issueComments:[]
});