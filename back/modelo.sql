CREATE DATABASE prueba;

USE prueba;

CREATE TABLE usuarios(
    uid INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(50) NOT NULL,
    userEmail VARCHAR(50) NOT NULL,
    userPassword VARCHAR(60) NOT NULL
);