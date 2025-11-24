<?php
require 'db_functions.php';

// Create connection
$conn = mysqli_connect($servername, $username, $password);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if (mysqli_query($conn, $sql)) {
    echo "Database created successfully or already exists.<br>";
} else {
    echo "Error creating database: " . mysqli_error($conn) . "<br>";
}

// Select the database
$sql = "USE $dbname";
if (mysqli_query($conn, $sql)) {
    echo "Database selected successfully.<br>";
} else {
    echo "Error selecting database: " . mysqli_error($conn) . "<br>";
}

// Create users table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS $table_users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
if (mysqli_query($conn, $sql)) {
    echo "Table " . $table_users . " created successfully or already exists.<br>";
} else {
    echo "Error creating table: " . mysqli_error($conn) . "<br>";
}

// Create leagues table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS leagues (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT UNSIGNED,
    join_code CHAR(8) NOT NULL UNIQUE, -- código para entrar na liga
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES $table_users(id) ON DELETE SET NULL
);";
if (mysqli_query($conn, $sql)) {
    echo "Table leagues created successfully or already exists.<br>";
} else {
    echo "Error creating leagues table or modifying users table: " . mysqli_error($conn) . "<br>";
}

// Alter users table to add league_id if it doesn't exist
$escaped_users = mysqli_real_escape_string($conn, $table_users);

// check column
$q = "SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '$escaped_users' AND COLUMN_NAME = 'league_id'";
$res = mysqli_query($conn, $q);
$row = $res ? mysqli_fetch_assoc($res) : null;

if (!$row || (int)$row['cnt'] === 0) {
    $sql = "ALTER TABLE `$table_users` ADD COLUMN league_id INT UNSIGNED NULL";
    if (mysqli_query($conn, $sql)) {
        echo "Added column league_id to $table_users.<br>";
        // add index separately
        $sql_idx = "ALTER TABLE `$table_users` ADD INDEX idx_league_id (league_id)";
        mysqli_query($conn, $sql_idx);
    } else {
        echo "Error adding league_id column: " . mysqli_error($conn) . "<br>";
    }
} else {
    echo "Column league_id already exists in $table_users.<br>";
}

// add foreign key constraint if not exists
$fk_name = 'fk_users_league';
$qfk = "SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = '$escaped_users' AND CONSTRAINT_NAME = '$fk_name'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'";
$resfk = mysqli_query($conn, $qfk);
$rowfk = $resfk ? mysqli_fetch_assoc($resfk) : null;

if (!$rowfk || (int)$rowfk['cnt'] === 0) {
    // ensure column exists before adding FK
    $sql_fk = "ALTER TABLE `$table_users` ADD CONSTRAINT $fk_name FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE SET NULL";
    if (mysqli_query($conn, $sql_fk)) {
        echo "Foreign key $fk_name added.<br>";
    } else {
        echo "Warning adding foreign key $fk_name: " . mysqli_error($conn) . "<br>";
    }
} else {
    echo "Constraint $fk_name already exists.<br>";
}

// Create games table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS games (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    league_id INT UNSIGNED DEFAULT NULL,
    target_word VARCHAR(100) DEFAULT NULL,
    attempts_count TINYINT UNSIGNED NOT NULL,
    won TINYINT(1) NOT NULL DEFAULT 0,
    score INT NOT NULL DEFAULT 0,
    attempts_json TEXT DEFAULT NULL, -- JSON array com as palavras tentadas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES $table_users(id) ON DELETE CASCADE,
    FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE SET NULL,
    INDEX (user_id),
    INDEX (league_id),
    INDEX (created_at)
);";
if (mysqli_query($conn, $sql)) {
    echo "Table games created successfully or already exists.<br>";
} else {
    echo "Error creating table: " . mysqli_error($conn) . "<br>";
}

// Create global_rankings table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS global_rankings (
    user_id INT UNSIGNED PRIMARY KEY,
    total_points BIGINT NOT NULL DEFAULT 0,
    games_played INT UNSIGNED NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES $table_users(id) ON DELETE CASCADE
);";
if (mysqli_query($conn, $sql)) {
    echo "Table global_rankings created successfully or already exists.<br>";
} else {
    echo "Error creating table: " . mysqli_error($conn) . "<br>";
}

// Create weekly_rankings table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS weekly_rankings (
    week_key VARCHAR(10) NOT NULL, -- ex: '2025-W48'
    user_id INT UNSIGNED NOT NULL,
    total_points INT NOT NULL DEFAULT 0,
    games_played INT UNSIGNED NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (week_key, user_id),
    FOREIGN KEY (user_id) REFERENCES $table_users(id) ON DELETE CASCADE
);";
if (mysqli_query($conn, $sql)) {
    echo "Table weekly_rankings created successfully or already exists.<br>";
} else {
    echo "Error creating table: " . mysqli_error($conn) . "<br>";
}

// Create league_rankings table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS `league_rankings` (
    league_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    total_points BIGINT NOT NULL DEFAULT 0,
    games_played INT UNSIGNED NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (league_id, user_id),
    CONSTRAINT fk_league_rank_league FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
    CONSTRAINT fk_league_rank_user FOREIGN KEY (user_id) REFERENCES `$table_users`(id) ON DELETE CASCADE
);";
if (mysqli_query($conn, $sql)) {
    echo "Table league_rankings created successfully or already exists.<br>";
} else {
    echo "Error creating table: " . mysqli_error($conn) . "<br>";
}

// Create league weekly totals table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS `league_weekly_rankings` (
    week_key VARCHAR(10) NOT NULL,
    league_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    total_points INT NOT NULL DEFAULT 0,
    games_played INT UNSIGNED NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (week_key, league_id, user_id),
    CONSTRAINT fk_lwr_league FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
    CONSTRAINT fk_lwr_user FOREIGN KEY (user_id) REFERENCES `$table_users`(id) ON DELETE CASCADE
);";
if (mysqli_query($conn, $sql)) {
    echo "Table league_weekly_rankings created successfully or already exists.<br>";
} else {
    echo "Error creating table: " . mysqli_error($conn) . "<br>";
}

// Close connection
close($conn);