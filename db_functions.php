<?php
/* Database functions */
require 'db_credentials.php';

// Create connection with the database
function connect() {
    global $servername, $username, $password, $dbname;

    $conn = new mysqli($servername, $username, $password, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    return $conn;
}

// Close the connection with the database
function close($conn) {
    mysqli_close($conn);
}