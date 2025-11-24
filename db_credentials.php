<?php
/* Database credentials */
$servername = "localhost";
$username = "root";
$password = getenv('DB_PASSWORD') ?? "";
$dbname = "termads_db";
$table_users = "users";