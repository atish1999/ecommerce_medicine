-- database creation

CREATE DATABASE IF NOT EXISTS medilab;
use medilab;

-- Table creation
-- 1. User

CREATE TABLE IF NOT EXISTS users (
	_uid int PRIMARY KEY AUTO_INCREMENT,
	_password varchar(25),
	_address varchar(100),
	_email varchar(30) UNIQUE,
	_name varchar(50),
    _phno varchar(10),
    constraint _ck_phno check (_phno like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
);

-- 2. Shop Owner

CREATE TABLE IF NOT EXISTS shopowner (
	_oid int PRIMARY KEY AUTO_INCREMENT,
    _pci varchar(20) UNIQUE,
	_password varchar(25),
	_address varchar(100),
	_email varchar(30) UNIQUE,
	_name varchar(50),
    _phno varchar(10),
    constraint _ck_phno check (_phno like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
);

-- 3. Doctor

CREATE TABLE IF NOT EXISTS doctor (
	_did int PRIMARY KEY AUTO_INCREMENT,
    _mci varchar(20) UNIQUE,
	_password varchar(25),
	_address varchar(100),
	_email varchar(30) UNIQUE,
	_name varchar(50),
    _phno varchar(10),
    constraint _ck_phno check (_phno like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
);

-- 4. Blog

CREATE TABLE IF NOT EXISTS blog (
    _bid int PRIMARY KEY AUTO_INCREMENT,
    _did int,
    _content LONGTEXT,
    _date DATE,
    FOREIGN KEY (_did) REFERENCES doctor(_did) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Product - shop owner updation

CREATE TABLE IF NOT EXISTS product (
	_prid int PRIMARY KEY AUTO_INCREMENT,
	_name varchar(50),
    _quantity int,
    _mrp int,
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


