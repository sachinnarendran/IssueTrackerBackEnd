const socket = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib');
const events  = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require('./tokenLib');
const check = require('./checkLib');
const response = require('./responseLib');