<?php
require 'db_functions.php';

// Conectar ao banco
$conn = connect();

echo "<h2>Inserindo dados fictícios no Termads...</h2>";

// 1. Criar algumas ligas
$ligas = [
    ['Nome Champions', 'Liga dos campeões de palavras'],
    ['Vocabulário Pro', 'Para os mestres das palavras'],
    ['Iniciantes Plus', 'Liga para quem está começando']
];

echo "<h3>Criando ligas...</h3>";
foreach ($ligas as $liga) {
    $nome = mysqli_real_escape_string($conn, $liga[0]);
    $desc = mysqli_real_escape_string($conn, $liga[1]);
    $codigo = strtoupper(substr(md5($nome), 0, 8)); // código único
    
    $sql = "INSERT IGNORE INTO leagues (name, description, join_code) VALUES ('$nome', '$desc', '$codigo')";
    if (mysqli_query($conn, $sql)) {
        echo "✅ Liga '$nome' criada com código: $codigo<br>";
    } else {
        echo "⚠️ Erro ao criar liga '$nome': " . mysqli_error($conn) . "<br>";
    }
}

// 2. Criar usuários fictícios
$usuarios = [
    ['Ana Silva', 'ana@email.com'],
    ['Bruno Santos', 'bruno@email.com'], 
    ['Carla Lima', 'carla@email.com'],
    ['Diego Costa', 'diego@email.com'],
    ['Elena Ribeiro', 'elena@email.com'],
    ['Felipe Alves', 'felipe@email.com'],
    ['Gabriela Rocha', 'gabi@email.com'],
    ['Henrique Dias', 'henrique@email.com'],
    ['Isabela Cruz', 'isabela@email.com'],
    ['João Pedro', 'joao@email.com']
];

echo "<h3>Criando usuários...</h3>";

// Buscar IDs das ligas
$result = mysqli_query($conn, "SELECT id FROM leagues");
$liga_ids = [];
while ($row = mysqli_fetch_assoc($result)) {
    $liga_ids[] = $row['id'];
}

foreach ($usuarios as $user) {
    $nome = mysqli_real_escape_string($conn, $user[0]);
    $email = mysqli_real_escape_string($conn, $user[1]);
    $senha = password_hash('123456', PASSWORD_DEFAULT); // senha padrão
    $liga_id = !empty($liga_ids) ? $liga_ids[array_rand($liga_ids)] : 'NULL';
    
    $sql = "INSERT IGNORE INTO users (name, email, password, league_id) VALUES ('$nome', '$email', '$senha', $liga_id)";
    if (mysqli_query($conn, $sql)) {
        echo "✅ Usuário '$nome' criado<br>";
    } else {
        echo "⚠️ Erro ao criar usuário '$nome': " . mysqli_error($conn) . "<br>";
    }
}

// 3. Criar jogos fictícios (histórico de partidas)
echo "<h3>Criando histórico de jogos...</h3>";

// Buscar todos os usuários
$result = mysqli_query($conn, "SELECT id FROM users");
$user_ids = [];
while ($row = mysqli_fetch_assoc($result)) {
    $user_ids[] = $row['id'];
}

$palavras = ['CARRO', 'PIANO', 'MESA', 'LIVRO', 'PLANTA', 'PEDRA', 'ÁGUA', 'FESTA', 'SONHO', 'FORÇA'];

$jogos_criados = 0;
foreach ($user_ids as $user_id) {
    // Cada usuário terá entre 5 a 15 jogos
    $num_jogos = rand(5, 15);
    
    for ($i = 0; $i < $num_jogos; $i++) {
        $palavra = $palavras[array_rand($palavras)];
        $tentativas = rand(1, 6);
        $ganhou = $tentativas <= 6 ? 1 : 0;
        
        // Sistema de pontuação: mais pontos para menos tentativas
        $pontos = $ganhou ? (7 - $tentativas) * 100 : 0;
        
        // Data aleatória nos últimos 30 dias
        $dias_atras = rand(0, 30);
        $data = date('Y-m-d H:i:s', strtotime("-$dias_atras days"));
        
        $sql = "INSERT INTO games (user_id, target_word, attempts_count, won, score, created_at) 
                VALUES ($user_id, '$palavra', $tentativas, $ganhou, $pontos, '$data')";
        
        if (mysqli_query($conn, $sql)) {
            $jogos_criados++;
        }
    }
}

echo "✅ $jogos_criados jogos criados<br>";

// 4. Atualizar tabelas de ranking (se existirem)
echo "<h3>Atualizando rankings...</h3>";

// Verificar se as tabelas de ranking existem
$tabelas_ranking = ['global_rankings', 'weekly_rankings'];

foreach ($tabelas_ranking as $tabela) {
    $check = mysqli_query($conn, "SHOW TABLES LIKE '$tabela'");
    if (mysqli_num_rows($check) > 0) {
        echo "📊 Atualizando $tabela...<br>";
        
        if ($tabela == 'global_rankings') {
            // Atualizar ranking global
            $sql = "INSERT INTO global_rankings (user_id, total_points, games_played)
                    SELECT user_id, 
                           SUM(score) as total_points,
                           COUNT(*) as games_played
                    FROM games 
                    GROUP BY user_id
                    ON DUPLICATE KEY UPDATE 
                    total_points = VALUES(total_points),
                    games_played = VALUES(games_played)";
            mysqli_query($conn, $sql);
        }
        
        if ($tabela == 'weekly_rankings') {
            // Atualizar ranking semanal
            $current_week = date('Y') . '-W' . date('W');
            $sql = "INSERT INTO weekly_rankings (week_key, user_id, total_points, games_played)
                    SELECT '$current_week' as week_key,
                           user_id, 
                           SUM(score) as total_points,
                           COUNT(*) as games_played
                    FROM games 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                    GROUP BY user_id
                    ON DUPLICATE KEY UPDATE 
                    total_points = VALUES(total_points),
                    games_played = VALUES(games_played)";
            mysqli_query($conn, $sql);
        }
    } else {
        echo "⚠️ Tabela $tabela não existe<br>";
    }
}

// 5. Mostrar estatísticas finais
echo "<h3>📊 Estatísticas dos dados criados:</h3>";

$stats = [
    'Usuários' => "SELECT COUNT(*) as total FROM users",
    'Ligas' => "SELECT COUNT(*) as total FROM leagues", 
    'Jogos' => "SELECT COUNT(*) as total FROM games",
    'Vitórias' => "SELECT COUNT(*) as total FROM games WHERE won = 1",
    'Pontos Total' => "SELECT SUM(score) as total FROM games"
];

foreach ($stats as $nome => $query) {
    $result = mysqli_query($conn, $query);
    $row = mysqli_fetch_assoc($result);
    $valor = $row['total'] ?? 0;
    echo "🎯 $nome: " . number_format($valor) . "<br>";
}

echo "<h3>🎉 Dados fictícios inseridos com sucesso!</h3>";
echo "<p><strong>Agora você pode testar:</strong></p>";
echo "<ul>";
echo "<li>📊 <a href='pages/ranking.php'>Página de Ranking</a></li>";
echo "<li>🎮 <a href='pages/game.php'>Jogar</a></li>";
echo "<li>🏆 <a href='pages/ligas.php'>Ligas</a></li>";
echo "</ul>";

// Fechar conexão
close($conn);
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
h2, h3 { color: #333; }
ul li { margin: 5px 0; }
a { color: #007bff; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>