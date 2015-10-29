/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('./config/database');

var connection = mysql.createConnection(dbconfig.connection);
connection.query('DROP DATABASE IF EXISTS ' + dbconfig.database);
connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`news` ( \
    `news_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `title` VARCHAR(20) NOT NULL, \
    `body` CHAR(255) NOT NULL, \
    `category` CHAR(60) NOT NULL, \
    `date` DATE NOT NULL, \
     PRIMARY KEY (`news_id`)\
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`tracker` ( \
    `tracker_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `ip_address` VARCHAR(20) NOT NULL, \
    `link` CHAR(100) NOT NULL, \
    `date` DATE NOT NULL, \
     PRIMARY KEY (`tracker_id`)\
)');

console.log('Success: Database Created!')

connection.end();

