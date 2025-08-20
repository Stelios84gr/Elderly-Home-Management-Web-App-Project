require('winston-daily-rotate-file');
require('winston-mongodb');
const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, printf, prettyPrint } = format;

const logger = createLogger({
    format: combine(
        label({ label: "HYACINTH ELDERLY HOME PATIENTS LOGS" }),
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        format.json(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
    filename: "./logs/rotate-%DATE%.log",
    datePattern: "DD-MM-YYYY",
    maxFiles: "7d",
    level: "error"
    }),
    new transports.MongoDB({
        level: "error",
        db: process.env.MONGODB_URI,
        collection: "error_logs",
        format: format.combine(
            format.timestamp(),
            format.json()
        )
    })
    ]
});

module.exports = logger;