<?php
require '../force_authenticate.php';
require '../db_functions.php';

$user_id = $_SESSION['user_id'] ?? null;
$league_id = get_user_league_id($user_id);
if (!$league_id) {
    header('Location: ligas.php');
    exit();
} else {
    header('Location: liga.php?league_id=' . intval($league_id));
    exit();
}