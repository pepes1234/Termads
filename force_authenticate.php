<?php
require "authenticate.php";

if (!$login) {
    header("Location: ./loginAccount.php");
    exit();
}