<?php
session_start();
require 'db_functions.php';
require 'authenticate.php';

$login = isLoggedIn();

if ($login) {
    header("Location: pages/game.php");
    exit;
} else {
    header("Location: pages/loginAccount.php");
    exit;
}