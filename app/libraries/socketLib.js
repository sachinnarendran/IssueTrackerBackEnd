const socket = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib');
const events  = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require('./tokenLib');
const check = require('./checkLib');
const response = require('./responseLib');

let setServer = (server) => {
    
    let io = socket.listen(server);

    let myIo = io.of('');

    myIo.on('connection',(socket)=>
    {
        socket.emit('verifyUser',"Connection Verified");

        socket.on('set-user',(authToken) => {

            tokenLib.verifyClaimWithoutSecret(authToken,(err,user) => {
                if(err)
                {
                    socket.emit('auth-error',{status:500,error:'Please provide valid authentication token'});
                }
                else
                {
                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} has Logged in successfully`);

                    let userObject = { userId: currentUser.userId, fullName: fullName }
                }
            })
        })

    })
    
    // Start of Disconnect
    socket.on('disconnect', () => {
        // disconnect the user from socket
        // remove the user from online list
        // unsubscribe the user from his own channel

        console.log('\x1b[33m',"user is disconnected", '\x1b[0m');
        console.log(socket.userId);
    })

}
