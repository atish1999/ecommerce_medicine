-- database creation

CREATE DATABASE IF NOT EXISTS medilab;
use medilab;

-- Table creation
-- 1. User

CREATE TABLE IF NOT EXISTS users (
	_uid int PRIMARY KEY AUTO_INCREMENT,
	_password varchar(100),
	_address varchar(250),
	_email varchar(50) UNIQUE,
	_name varchar(50),
    _phno varchar(15)
);

-- 2. Shop Owner

CREATE TABLE IF NOT EXISTS shopowner (
	_oid int PRIMARY KEY AUTO_INCREMENT,
    _pci varchar(20) UNIQUE,
	_password varchar(100),
	_address varchar(250),
	_email varchar(50) UNIQUE,
	_name varchar(50),
    _phno varchar(15)
);

-- 3. Doctor

CREATE TABLE IF NOT EXISTS doctor (
	_did int PRIMARY KEY AUTO_INCREMENT,
    _mci varchar(20) UNIQUE,
	_password varchar(100),
	_address varchar(250),
	_email varchar(50) UNIQUE,
	_name varchar(50),
    _phno varchar(15)
);

-- 4. Blog

CREATE TABLE IF NOT EXISTS blog (
    _bid int PRIMARY KEY AUTO_INCREMENT,
    _title varchar(100),
    _content LONGTEXT,
    _image varchar(200),
    _date DATE,
    _did int,
    FOREIGN KEY (_did) REFERENCES doctor(_did) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Product - shop owner updation

CREATE TABLE IF NOT EXISTS product (
	_prid int PRIMARY KEY AUTO_INCREMENT,
	_name varchar(100),
    _quantity int,
    _mrp int,
    _image varchar(200),
    _manufacturer varchar(100) DEFAULT '',
    _composition JSON DEFAULT ('{}'),
    _expiry DATE,
    _use varchar(100) DEFAULT '',
    _benefits varchar(300) DEFAULT '',
    _oid int,
    FOREIGN KEY (_oid) REFERENCES shopowner(_oid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Purchase - for individual users

CREATE TABLE IF NOT EXISTS purchase (
	_pid int PRIMARY KEY AUTO_INCREMENT,
    _uid int,
    _mrp int,
    _date DATE,
    _prid int,
    FOREIGN KEY (_prid) REFERENCES product(_prid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (_uid) REFERENCES user(_uid) ON DELETE CASCADE ON UPDATE CASCADE
);

--Modifying database


