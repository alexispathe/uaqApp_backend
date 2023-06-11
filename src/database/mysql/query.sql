CREATE DATABASE IF NOT EXISTS PORTAFOLIOAP;
USE PORTAFOLIOAP;

CREATE TABLE IF NOT EXISTS users(
    nUserID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role ENUM('admin', 'user') NOT NULL,
    userStatus BOOLEAN,
    registrationDay DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS userInformation(
    nUserInformationID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    lastName VARCHAR(64),
    userName VARCHAR(20) UNIQUE,
    birthDay DATE,
    phone VARCHAR(10) UNIQUE,
    country VARCHAR(64),
    address VARCHAR(254),
    profilePicture TEXT ,
    userID INT NOT NULL UNIQUE,
    FOREIGN KEY(userID) REFERENCES users(nUserID)
);


-- SQL SERVER 
Create Table users(
    nUserID INT NOT NULL  PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role  VARCHAR(10) CHECK (role IN('admin', 'user')) NOT NULL,
	
    userStatus bit,
    registrationDay DATETIME NOT NULL
);

CREATE TABLE  userInformation(
    nUserInformationID INT NOT NULL  PRIMARY KEY,
    lastName VARCHAR(64),
    userName VARCHAR(20) UNIQUE,
    birthDay DATE,
    phone VARCHAR(10) UNIQUE,
    country VARCHAR(64),
    address VARCHAR(254),
    profilePicture TEXT ,
    userID INT NOT NULL UNIQUE,
    FOREIGN KEY(userID) REFERENCES users(nUserID)
);


