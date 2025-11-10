<?php
require 'db_functions.php';
require 'authenticate.php';

session_start();
$login = isLoggedIn();

if ($login) {
    header("Location: pages/game.php");
    exit;
} else {
    header("Location: pages/loginAccount.php");
    exit;
}