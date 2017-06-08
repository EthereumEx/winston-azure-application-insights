'use strict';

const winston = require('winston');
const aiLogger = require('./lib/winston-azure-application-insights').AzureApplicationInsightsLogger;


winston.level = 'debug';
configureLogging();


setInterval(() => {
    loopIt();
}, 5000);

function loopIt() {
    winston.info("Let's log something new...");
    winston.error("This is an error log!");
    winston.warn("And this is a warning message.");
    winston.log("info", "Log with some metadata", {
        question: "Answer to the Ultimate Question of Life, the Universe, and Everything",
        answer: 42
    });

    function ExtendedError(message, arg1, arg2) {
        this.message = message;
        this.name = "ExtendedError";
        this.arg1 = arg1;
        this.arg2 = arg2;
        Error.captureStackTrace(this, ExtendedError);
    }
    ExtendedError.prototype = Object.create(Error.prototype);
    ExtendedError.prototype.constructor = ExtendedError;

    winston.error("Log extended errors with properites", new ExtendedError("some error", "answer", 42));
}


function configureLogging() {

    winston.setLevels({
        trace: 9,
        input: 8,
        verbose: 7,
        prompt: 6,
        debug: 5,
        info: 4,
        data: 3,
        help: 2,
        warn: 1,
        error: 0
    });

    winston.addColors({
        trace: 'magenta',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        error: 'red'
    });

    winston.remove(winston.transports.Console)
    winston.add(winston.transports.Console, {
        level: 'trace',
        prettyPrint: true,
        colorize: true,
        silent: false,
        timestamp: false
    });

    if (process.env.PROD && process.env.AIKEY) {
        winston.add(aiLogger, {
            key: process.env.AIKEY
        });
        winston.warn(`AppInsights logging on with key ${process.env.AIKEY}`);
    }

    winston.warn('log level set to %s', winston.level);
}

