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

function validateData($data) {
    $data = trim($data);
    $data = htmlspecialchars($data);
    $data = stripslashes($data);
    return $data;
}

// Get week key format: 'YYYY-Www'
function get_week_key(DateTime $date = null) {
    if ($date === null) {
        $date = new DateTime();
    }
    return $date->format('o-\WW');
}

// Create a new league
// Returns ['success' => true, 'league_id' => int] on success
// Returns ['success' => false, 'error_key' => string, 'error' => string] on failure
function create_league($name, $created_by, $join_code, $description = null) {
    $name = validateData($name);
    $join_code = strtoupper(validateData($join_code));
    $description = $description ? validateData($description) : null;

    if (empty($name)) {
        return ['success' => false, 'error_key' => 'nome', 'error' => 'Nome da liga obrigatório'];
    }
    if (empty($join_code)) {
        return ['success' => false, 'error_key' => 'keyword', 'error' => 'Palavra‑chave obrigatória'];
    }
    // valida 3-8 chars A-Z 0-9 _ -
    if (!preg_match('/^[A-Z0-9_-]{3,8}$/', $join_code)) {
        return ['success' => false, 'error_key' => 'keyword', 'error' => 'Palavra‑chave inválida (3-8 chars: A-Z 0-9 _ -)'];
    }

    $conn = connect();
    
    // Check if join code already exists
    $escaped_join_code = mysqli_real_escape_string($conn, $join_code);
    $check_sql = "SELECT id FROM leagues WHERE join_code = '$escaped_join_code'";
    $result = mysqli_query($conn, $check_sql);
    if ($result && mysqli_num_rows($result) > 0) {
        close($conn);
        return ['success' => false, 'error_key' => 'keyword', 'error' => 'A palavra-chave já existe'];
    }

    // Insert new league (escape values manually; description may be NULL)
    $name_esc = mysqli_real_escape_string($conn, $name);
    if ($description === null) {
        $description_sql = 'NULL';
    } else {
        $description_sql = "'" . mysqli_real_escape_string($conn, $description) . "'";
    }
    $sql = "INSERT INTO leagues (name, description, created_by, join_code) VALUES ('" . $name_esc . "', " . $description_sql . ", " . intval($created_by) . ", '" . $escaped_join_code . "')";
    if (mysqli_query($conn, $sql)) {
        $league_id = mysqli_insert_id($conn);
        close($conn);
        return ['success' => true, 'league_id' => $league_id];
    } else {
        $err = mysqli_error($conn);
        close($conn);
        return ['success' => false, 'error_key' => 'general', 'error' => 'Erro ao criar a liga: ' . $err];
    }
}

// Join a league using join code
// Returns ['success' => true, 'league_id' => int] on success
// Returns ['success' => false, 'error_key' => string, 'error' => string] on failure
function join_league($user_id, $join_code) {
    $join_code = strtoupper(validateData($join_code));
    if (empty($join_code)) {
        return ['success' => false, 'error_key' => 'joinKeyword', 'error' => 'Palavra-chave é obrigatória'];
    }
    if (!preg_match('/^[A-Z0-9_-]{3,8}$/', $join_code)) {
        return ['success' => false, 'error_key' => 'joinKeyword', 'error' => 'Palavra-chave inválida'];
    }

    $conn = connect();

    // Find league by join code
    $escaped_join_code = mysqli_real_escape_string($conn, $join_code);
    $sql = "SELECT id FROM leagues WHERE join_code = '$escaped_join_code'";
    $result = mysqli_query($conn, $sql);
    if (!$result || mysqli_num_rows($result) === 0) {
        close($conn);
        return ['success' => false, 'error_key' => 'joinKeyword', 'error' => 'Liga não encontrada com essa palavra-chave'];
    }
    $league = mysqli_fetch_assoc($result);
    $league_id = intval($league['id']);

    // Update user's league_id
    $sql = "UPDATE users SET league_id = " . $league_id . " WHERE id = " . intval($user_id);
    if (mysqli_query($conn, $sql)) {
        close($conn);
        return ['success' => true, 'league_id' => $league_id];
    } else {
        $err = mysqli_error($conn);
        close($conn);
        return ['success' => false, 'error_key' => 'general', 'error' => 'Erro ao entrar na liga: ' . $err];
    }
}

// Leave the current league
// Returns ['success' => true] on success
// Returns ['success' => false, 'error_key' => string, 'error' => string] on failure
function leave_league($user_id) {
    $conn = connect();

    // Update user's league_id to NULL
    $sql = "UPDATE users SET league_id = NULL WHERE id = $user_id";
    if (mysqli_query($conn, $sql)) {
        close($conn);
        return ['success' => true];
    } else {
        close($conn);
        return ['success' => false, 'error_key' => 'general', 'error' => 'Erro ao sair da liga'];
    }
}

// Close the connection with the database
function close($conn) {
    mysqli_close($conn);
}