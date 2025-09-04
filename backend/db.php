<?php
$host = "localhost";      
$user = "root";            
$pass = "Ayushsingh@74";                
$db   = "nearest_seller";  

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}
?>
