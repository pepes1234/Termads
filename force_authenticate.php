<?php
require "authenticate.php";

if (!$login) {
    header("Location: ./pages/loginAccount.php");
    exit();
}