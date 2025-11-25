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

// Record a game played by the user and update rankings accordingly
// Returns ['success' => true, 'game_id' => int] on success
// Returns ['success' => false, 'error_key' => string, 'error' => string] on failure
function record_game($user_id, $score, $won, $attempts_count, $attempts_array = null, $target_word = null, $league_id = null) {
    $conn = connect();
    if (!$conn) return ['success' => false, 'error_key' => 'general', 'error' => 'Erro de conexão com o banco de dados'];

    // If league_id is not provided, get it from user's current league
    if ($league_id === null) {
        $sql = "SELECT league_id FROM users WHERE id = " . intval($user_id) . " LIMIT 1";
        $result = mysqli_query($conn, $sql);
        if ($result) {
            $row = mysqli_fetch_assoc($result);
            $league_id = $row['league_id'] ? intval($row['league_id']) : null;
            if ($league_id === 0) $league_id = null;
        } else {
            close($conn);
            return ['success' => false, 'error_key' => 'general', 'error' => 'Erro ao obter liga do usuário'];
        }
    }

    $attempts_json = $attempts_array ? json_encode($attempts_array, JSON_UNESCAPED_UNICODE) : null;
    $week_key = get_week_key();

    $target_word_sql = $target_word !== null ? "'" . mysqli_real_escape_string($conn, $target_word) . "'" : "NULL";
    $attempts_json_sql = $attempts_json !== null ? "'" . mysqli_real_escape_string($conn, $attempts_json) . "'" : "NULL";
    $league_id_sql = $league_id !== null ? intval($league_id) : "NULL";

    // Transaction (atomic operation)
    mysqli_begin_transaction($conn);
    try {
        // Insert into games table
        $sql = "INSERT INTO games (user_id, league_id, target_word, attempts_count, won, score, attempts_json) VALUES ("
             . intval($user_id) . ", "
             . $league_id_sql . ", "
             . $target_word_sql . ", "
             . intval($attempts_count) . ", "
             . (int)$won . ", "
             . intval($score) . ", "
             . $attempts_json_sql . ")";
        if (!mysqli_query($conn, $sql)) {
            throw new Exception('Erro ao registrar o jogo: ' . mysqli_error($conn));
        }
        $game_id = mysqli_insert_id($conn);

        // Update global rankings
        $sql = "INSERT INTO global_rankings (user_id, total_points, games_played) VALUES ("
             . intval($user_id) . ", "
             . intval($score) . ", 1)
             ON DUPLICATE KEY UPDATE
             total_points = total_points + " . intval($score) . ",
             games_played = games_played + 1";
        if (!mysqli_query($conn, $sql)) {
            throw new Exception('Erro ao atualizar ranking global: ' . mysqli_error($conn));
        }

        // Update weekly rankings
        $week_key_sql = mysqli_real_escape_string($conn, $week_key);
        $sql = "INSERT INTO weekly_rankings (week_key, user_id, total_points, games_played) VALUES ("
             . "'" . $week_key_sql . "', "
             . intval($user_id) . ", "
             . intval($score) . ", 1)
             ON DUPLICATE KEY UPDATE
             total_points = total_points + " . intval($score) . ",
             games_played = games_played + 1";
        if (!mysqli_query($conn, $sql)) {
            throw new Exception('Erro ao atualizar ranking semanal: ' . mysqli_error($conn));
        }

        // If in a league, update league rankings
        if ($league_id !== null) {
            $sql = "INSERT INTO league_rankings (league_id, user_id, total_points, games_played) VALUES ("
                 . intval($league_id) . ", "
                 . intval($user_id) . ", "
                 . intval($score) . ", 1)
                 ON DUPLICATE KEY UPDATE
                 total_points = total_points + " . intval($score) . ",
                 games_played = games_played + 1";
            if (!mysqli_query($conn, $sql)) {
                throw new Exception('Erro ao atualizar ranking da liga: ' . mysqli_error($conn));
            }

            $sql = "INSERT INTO league_weekly_rankings (league_id, week_key, user_id, total_points, games_played) VALUES ("
                 . intval($league_id) . ", "
                 . "'" . $week_key_sql . "', "
                 . intval($user_id) . ", "
                 . intval($score) . ", 1)
                 ON DUPLICATE KEY UPDATE
                 total_points = total_points + " . intval($score) . ",
                 games_played = games_played + 1";
            if (!mysqli_query($conn, $sql)) {
                throw new Exception('Erro ao atualizar ranking semanal da liga: ' . mysqli_error($conn));
            }
        }

        mysqli_commit($conn);
        close($conn);
        return ['success' => true, 'game_id' => $game_id];
    } catch (Exception $e) {
        mysqli_rollback($conn);
        $err = $e->getMessage();
        close($conn);
        return ['success' => false, 'error_key' => 'general', 'error' => $err];
    }
}

// Get user game history
// Returns an array of games (id, target_word, attempts_count, won, score, attempts_list, created_at, league_id) on success
function get_user_history($user_id, $limit = 50) {
    $conn = connect();
    if (!$conn) return [];

    $sql = "SELECT id, target_word, attempts_count, won, score, attempts_json, created_at, league_id
            FROM games
            WHERE user_id = " . intval($user_id) . "
            ORDER BY created_at DESC
            LIMIT " . intval($limit);
    $result = mysqli_query($conn, $sql);
    $out = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $row['attempts_list'] = $row['attempts_json'] ? json_decode($row['attempts_json'], true) : [];
            unset($row['attempts_json']);
            $out[] = $row;
        }
    }
    close($conn);
    return $out;
}

// Close the connection with the database
function close($conn) {
    mysqli_close($conn);
}