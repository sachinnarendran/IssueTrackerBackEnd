const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Issue = new Schema({
    issueId:{
        type:String
    },
    issueTitle:{
        type:String
    },
    issueDescription:{
        type:String
    },
    issueReporter:{
        type:String
    },
    issueAssignee:{
        type:String
    },
    issueScreenshot:{
        data:Buffer,contentType:String
    }
});