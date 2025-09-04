<?php
header("Content-Type: application/json");
include "db.php";


$data = json_decode(file_get_contents("php://input"), true);

$customerName = $conn->real_escape_string($data['customerName']);
$latitude     = (float)$data['latitude'];
$longitude    = (float)$data['longitude'];
$productName  = $conn->real_escape_string($data['product']);


$customerCheck = $conn->query("SELECT id FROM customers WHERE name='$customerName'");
if ($customerCheck->num_rows > 0) {
    $customer = $customerCheck->fetch_assoc();
    $customerId = $customer['id'];
} else {
    $conn->query("INSERT INTO customers (name, latitude, longitude) VALUES ('$customerName', $latitude, $longitude)");
    $customerId = $conn->insert_id;
}


$productCheck = $conn->query("SELECT id FROM products WHERE name='$productName'");
if ($productCheck->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Product not found"]);
    exit;
}
$product = $productCheck->fetch_assoc();
$productId = $product['id'];


$query = "
    SELECT s.id, s.name, s.latitude, s.longitude,
    (6371 * acos(
        cos(radians($latitude)) * cos(radians(s.latitude)) *
        cos(radians(s.longitude) - radians($longitude)) +
        sin(radians($latitude)) * sin(radians(s.latitude))
    )) AS distance
    FROM sellers s
    JOIN inventory i ON s.id = i.seller_id
    WHERE i.product_id = $productId
    ORDER BY distance ASC
    LIMIT 1
";

$sellerResult = $conn->query($query);

if ($sellerResult->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "No seller found for this product"]);
    exit;
}

$seller = $sellerResult->fetch_assoc();
$sellerId = $seller['id'];
$sellerName = $seller['name'];
$distance = round($seller['distance'], 2);


$orderId = "ORD-" . time() . "-" . rand(100, 999);

$conn->query("
    INSERT INTO orders (order_id, customer_id, product_id, seller_id, distance)
    VALUES ('$orderId', $customerId, $productId, $sellerId, $distance)
");


$response = [
    "status" => "success",
    "orderId" => $orderId,
    "customerName" => $customerName,
    "customerLocation" => "$latitude, $longitude",
    "productName" => ucfirst($productName),
    "sellerName" => $sellerName,
    "sellerLocation" => $seller['latitude'] . ", " . $seller['longitude'],
    "distance" => $distance,
    "deliveryTime" => (15 + $distance * 10) . "-" . (30 + $distance * 10) . " mins"
];

echo json_encode($response);
?>
