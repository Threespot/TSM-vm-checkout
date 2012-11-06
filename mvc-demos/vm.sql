-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 05, 2012 at 10:08 AM
-- Server version: 5.1.44
-- PHP Version: 5.3.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `vmcheckout`
--

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` int(128) NOT NULL,
  `vm` varchar(256) NOT NULL,
  `user` varchar(256) NOT NULL,
  `checkout` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pkey` (`id`),
  KEY `pkey_2` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `status`
--

INSERT INTO `status` VALUES(1, 'XP-SP3-IE6', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(2, 'XP-SP3-IE6-1', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(3, 'XP-SP3-IE6-2', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(4, 'XP-SP3-IE7', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(5, 'XP-SP3-IE7-1', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(6, 'XP-SP3-IE7-2', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(7, 'XP-SP3-IE8', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(8, 'XP-SP3-IE8-1', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(9, 'XP-SP3-IE8-2', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(10, 'WIN7-SP2-IE8', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(11, 'WIN7-SP2-IE8-1', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(12, 'WIN7-SP2-IE9', '', '0000-00-00 00:00:00');
INSERT INTO `status` VALUES(13, 'WIN7-SP2-IE9-1', '', '0000-00-00 00:00:00');