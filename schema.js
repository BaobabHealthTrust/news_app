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
    `body` LONGTEXT NOT NULL, \
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
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `name` VARCHAR(100) NOT NULL, \
    `description` CHAR(255) NOT NULL, \
    `date` DATE NOT NULL, \
     PRIMARY KEY (`id`)\
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`user` ( \
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `fname` VARCHAR(100) NOT NULL, \
    `lname` VARCHAR(100) NOT NULL, \
    `username` VARCHAR(100) NOT NULL, \
    `password` CHAR(100) NOT NULL, \
    `date` DATE NOT NULL, \
     PRIMARY KEY (`user_id`)\
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`media` ( \
    `media_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `news_id` int(11) NOT NULL, \
    `filename` VARCHAR(100), \
    `content_type` VARCHAR(100), \
    `data` longblob, \
     PRIMARY KEY (`media_id`)\
)');

console.log('Success: Database Created!')

connection.end();
