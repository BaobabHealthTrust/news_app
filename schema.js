/**
 * Created by barrett on 8/28/14.
 * Used by mangochiman in Nov 2015
 */

var mysql = require('mysql');
var dbconfig = require('./config/database');

var connection = mysql.createConnection(dbconfig.connection);
connection.query('DROP DATABASE IF EXISTS ' + dbconfig.database);
connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`news` ( \
    `news_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `title` CHAR(255) NOT NULL, \
    `body` CHAR(255) NOT NULL, \
    `category` CHAR(60) NOT NULL, \
    `date` DATE NOT NULL, \
    `created_at` TIMESTAMP NOT NULL, \
     PRIMARY KEY (`news_id`)\
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`tracker` ( \
    `tracker_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `news_id` int(11) NOT NULL, \
    `ip_address` VARCHAR(20) NOT NULL, \
    `category` CHAR(100) NOT NULL, \
    `date` DATE NOT NULL, \
    `created_at` TIMESTAMP NOT NULL, \
     PRIMARY KEY (`tracker_id`)\
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`category` ( \
    `category_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `category_name` VARCHAR(100) NOT NULL, \
    `description` CHAR(100) NOT NULL, \
    `date` DATE NOT NULL, \
     PRIMARY KEY (`category_id`)\
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`user` ( \
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(100) NOT NULL, \
    `password` CHAR(100) NOT NULL, \
    `date` DATE NOT NULL, \
     PRIMARY KEY (`user_id`)\
)');

console.log('Success: Database Created!')

connection.end();
