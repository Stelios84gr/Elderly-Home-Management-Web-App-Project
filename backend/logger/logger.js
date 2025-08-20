require('winston-daily-rotate-file');
require('winston-mongodb');
const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logger = createLogger({
    format: combine(
        label({ label: "HYACINTH ELDERLY HOME PATIENTS LOGS" }),
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        // printf: use custom order of combine options
        // "fake" prettyPrint by using template literals
        printf(({ level, message, label, timestamp}) => {
            return `{
    label: '${label}',
    message: '${message}'.
    level: '${level}',
    timestamp: '${timestamp}'
}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
    filename: "./logs/rotate-%DATE%.log",
    datePattern: "DD-MM-YYYY",
    maxFiles: "7d",
    level: "error"
    }),
    // stores correct timestamp in metadata (default MongoDB Compass time zone: UTC)
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