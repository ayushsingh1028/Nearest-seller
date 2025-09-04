<?php
$host = "localhost";       // Change if hosted elsewhere
$user = "root";            // Your DB username
$pass = "Ayushsingh@74";                // Your DB password
$db   = "nearest_seller";  // Your DB name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}
?>
