-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Dec 25, 2019 at 05:43 PM
-- Server version: 5.7.28
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ram_app_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cards_answers`
--

CREATE TABLE `cards_answers` (
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `game_attempt_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `unique_id` varchar(250) NOT NULL,
  `card` varchar(255) CHARACTER SET utf8 NOT NULL,
  `question_1_ma_osim` varchar(255) CHARACTER SET utf8 NOT NULL,
  `question_2_ma_hoshvim` varchar(255) CHARACTER SET utf8 NOT NULL,
  `question_3_ma_margishim` varchar(255) CHARACTER SET utf8 NOT NULL,
  `card_skipped` tinyint(1) NOT NULL,
  `game_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `feeling_answers`
--

CREATE TABLE `feeling_answers` (
  `game_attempt_id` varchar(255) NOT NULL,
  `unique_id` varchar(250) NOT NULL,
  `game_date` date NOT NULL,
  `how_do_you_feel` tinyint(2) NOT NULL,
  `what_feeling` varchar(250) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `finished_game`
--

CREATE TABLE `finished_game` (
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `unique_id` varchar(255) NOT NULL,
  `game_attempt_id` varchar(255) NOT NULL,
  `how_do_you_feel` tinyint(10) NOT NULL,
  `what_feeling_it_is` varchar(255) CHARACTER SET utf8 NOT NULL,
  `what_has_changed` varchar(255) CHARACTER SET utf32 NOT NULL,
  `how_much_it_changed` varchar(255) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` int(11) NOT NULL,
  `unique_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `phone`, `unique_id`) VALUES
(9, 'aaaa', '123', 'aaa@aaa.com', 4545454, '29707a53721b543b49f5c5a20fbe2de2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cards_answers`
--
ALTER TABLE `cards_answers` ADD FULLTEXT KEY `question_1_ma_osim` (`question_1_ma_osim`);
ALTER TABLE `cards_answers` ADD FULLTEXT KEY `question_1_ma_osim_2` (`question_1_ma_osim`);
ALTER TABLE `cards_answers` ADD FULLTEXT KEY `question_1_ma_osim_3` (`question_1_ma_osim`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
