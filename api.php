<?php
declare(strict_types=1);

ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.use_trans_sid', '0');
$forwardedProto = strtolower(trim(explode(',', $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')[0]));
$secureCookie = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $forwardedProto === 'https';
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $secureCookie,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$action = $_GET['action'] ?? '';
$postActions = ['register', 'login', 'order', 'logout'];
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && !in_array($action, $postActions, true)) {
    http_response_code(405);
    header('Allow: GET, POST');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
if (in_array($action, $postActions, true) && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['error' => 'POST required']);
    exit;
}
if ($action === 'health') {
    echo json_encode(['status' => 'ok', 'service' => 'store-api']);
    exit;
}

function respond(array $data, int $status = 200): never {
    http_response_code($status);
    try {
        $json = json_encode($data, JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR);
    } catch (JsonException $error) {
        http_response_code(500);
        $json = '{"error":"Unable to encode API response"}';
    }
    echo $json;
    exit;
}

function requireSameOrigin(): void {
    $origin = parse_url($_SERVER['HTTP_ORIGIN'] ?? '');
    $forwardedProto = strtolower(trim(explode(',', $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')[0]));
    $requestScheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $forwardedProto === 'https'
        ? 'https'
        : 'http';
    $requestOrigin = $requestScheme . '://' . ($_SERVER['HTTP_HOST'] ?? '');
    if (!$origin || empty($origin['scheme']) || empty($origin['host']) ||
        !hash_equals(strtolower($requestOrigin), strtolower($origin['scheme'] . '://' . $origin['host'] . (isset($origin['port']) ? ':' . $origin['port'] : '')))) {
        respond(['error' => 'Request origin could not be verified. Reload the page and try again.'], 403);
    }
}

function csrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function requireCsrfToken(): void {
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if (!$provided || !$expected || !hash_equals($expected, $provided)) {
        respond(['error' => 'Your session expired. Reload the page and try again.'], 403);
    }
}

function requireStoreAdmin(PDO $db): array {
    $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$authorization && function_exists('getallheaders')) {
        $headers = getallheaders();
        $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (!preg_match('/^Bearer\s+([A-Za-z0-9._~+\/=-]+)$/i', $authorization, $matches)) {
        respond(['error' => 'Sign in with an approved admin account.'], 401);
    }

    $supabaseUrl = rtrim(getenv('NEXT_PUBLIC_SUPABASE_URL') ?: '', '/');
    $anonKey = getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?: '';
    if (!$supabaseUrl || !$anonKey || parse_url($supabaseUrl, PHP_URL_SCHEME) !== 'https') {
        respond(['error' => 'Admin authentication is not configured.'], 503);
    }

    $context = stream_context_create(['http' => [
        'method' => 'GET',
        'header' => "apikey: {$anonKey}\r\nAuthorization: Bearer {$matches[1]}\r\nAccept: application/json\r\n",
        'timeout' => 8,
        'ignore_errors' => true,
    ]]);
    $response = @file_get_contents($supabaseUrl . '/auth/v1/user', false, $context);
    if ($response === false) {
        error_log('Supabase admin token verification request failed');
        respond(['error' => 'Could not verify the admin session. Try again.'], 503);
    }
    $statusLine = $http_response_header[0] ?? '';
    if (!preg_match('/\s200\s/', $statusLine)) {
        respond(['error' => 'Your admin session is invalid or expired. Sign in again.'], 401);
    }

    $user = json_decode($response, true);
    $userId = is_array($user) ? (string) ($user['id'] ?? '') : '';
    if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $userId)) {
        respond(['error' => 'Your admin session is invalid. Sign in again.'], 401);
    }

    $allowed = $db->prepare('SELECT 1 FROM store_admins WHERE user_id = ?');
    $allowed->execute([$userId]);
    if (!$allowed->fetchColumn()) {
        respond(['error' => 'This account is not authorized for HalfCourt Admin.'], 403);
    }
    return $user;
}

function storeAdminOverview(PDO $db, bool $isPostgres): array {
    $currentWindow = $isPostgres
        ? "CURRENT_TIMESTAMP - INTERVAL '30 days'"
        : 'DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY)';
    $previousWindow = $isPostgres
        ? "CURRENT_TIMESTAMP - INTERVAL '60 days'"
        : 'DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 60 DAY)';

    $products = $db->query("
        SELECT p.id, p.model, p.name, p.colorway, p.price, p.stock, p.badge,
               p.image_url,
               COALESCE(s.sold, 0) AS sold
        FROM products p
        LEFT JOIN (
          SELECT oi.product_id, SUM(oi.qty) AS sold
          FROM order_items oi
          JOIN orders o ON o.id = oi.order_id
          WHERE o.status <> 'Cancelled'
            AND o.placed_at >= {$currentWindow}
          GROUP BY oi.product_id
        ) s ON s.product_id = p.id
        WHERE p.is_active = TRUE
        ORDER BY p.created_at DESC, p.id
        LIMIT 100
    ")->fetchAll();

    $metrics = $db->query("
        SELECT
          COALESCE(SUM(CASE WHEN placed_at >= {$currentWindow} THEN 1 ELSE 0 END), 0) AS current_orders,
          COALESCE(SUM(CASE WHEN placed_at >= {$previousWindow} AND placed_at < {$currentWindow} THEN 1 ELSE 0 END), 0) AS previous_orders,
          COALESCE(SUM(CASE WHEN placed_at >= {$currentWindow} AND status <> 'Cancelled' THEN total ELSE 0 END), 0) AS revenue_30d
        FROM orders
    ")->fetch();

    $customerCount = (int) $db->query('SELECT COUNT(*) FROM customers')->fetchColumn();
    $recentOrders = $db->query("
        SELECT o.order_no, COALESCE(a.full_name, 'Guest checkout') AS customer,
               o.placed_at, o.total, o.status
        FROM orders o
        LEFT JOIN order_addresses a ON a.order_id = o.id
        ORDER BY o.placed_at DESC
        LIMIT 50
    ")->fetchAll();
    $topCustomers = $db->query("
        SELECT c.full_name AS name, c.email, COUNT(o.id) AS orders,
               COALESCE(SUM(o.total), 0) AS spent
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id AND o.status <> 'Cancelled'
        GROUP BY c.id, c.full_name, c.email, c.created_at
        ORDER BY spent DESC, c.created_at DESC
        LIMIT 5
    ")->fetchAll();

    $signIns = null;
    try {
        $signInQuery = $db->prepare("
            SELECT COUNT(*) AS count
            FROM customer_sign_in_events
            WHERE signed_in_at >= {$currentWindow}
        ");
        $signInQuery->execute();
        $signIns = (int) $signInQuery->fetchColumn();
    } catch (PDOException $error) {
        $missingTable = $isPostgres
            ? $error->getCode() === '42P01'
            : $error->getCode() === '42S02';
        if (!$missingTable) throw $error;
    }

    $currentOrders = (int) $metrics['current_orders'];
    $previousOrders = (int) $metrics['previous_orders'];
    $delta = $previousOrders === 0
        ? null
        : round((($currentOrders - $previousOrders) / $previousOrders) * 1000) / 10;

    return [
        'mode' => 'live',
        'generatedAt' => gmdate(DATE_ATOM),
        'totalOrders' => $currentOrders,
        'ordersDelta' => $delta,
        'signIns30d' => $signIns,
        'customers' => $customerCount,
        'revenue30d' => (float) $metrics['revenue_30d'],
        'products' => array_map(static function (array $product): array {
            $product['price'] = (float) $product['price'];
            $product['stock'] = (int) $product['stock'];
            $product['sold'] = (int) $product['sold'];
            $product['imageUrl'] = $product['image_url'];
            unset($product['image_url']);
            return $product;
        }, $products),
        'recentOrders' => array_map(static function (array $order): array {
            return [
                'orderNo' => $order['order_no'],
                'customer' => $order['customer'],
                'placedAt' => date('M j, Y g:i A', strtotime((string) $order['placed_at'])),
                'total' => (float) $order['total'],
                'status' => $order['status'],
            ];
        }, $recentOrders),
        'topCustomers' => array_map(static function (array $customer): array {
            return [
                'name' => $customer['name'],
                'email' => $customer['email'],
                'orders' => (int) $customer['orders'],
                'spent' => (float) $customer['spent'],
            ];
        }, $topCustomers),
    ];
}

function requestBody(): array {
    $rawBody = file_get_contents('php://input');
    if (strlen($rawBody) > 65536) {
        respond(['error' => 'Request is too large.'], 413);
    }
    $body = json_decode($rawBody, true);
    if (!is_array($body)) {
        respond(['error' => 'Invalid request body.'], 400);
    }
    return $body;
}

if ($action === 'adminConfig') {
    $url = rtrim(getenv('NEXT_PUBLIC_SUPABASE_URL') ?: '', '/');
    $anonKey = getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?: '';
    if (!$url || !$anonKey || parse_url($url, PHP_URL_SCHEME) !== 'https') {
        respond(['error' => 'Admin sign-in is not configured.'], 503);
    }
    respond(['url' => $url, 'anonKey' => $anonKey]);
}

try {
    $databaseUrl = trim(getenv('DATABASE_URL') ?: '');
    if (preg_match('/^DATABASE_URL\s*=\s*(.+)$/is', $databaseUrl, $matches)) {
        $databaseUrl = $matches[1];
    }
    $databaseUrl = trim($databaseUrl, " \t\n\r\0\x0B\"'");
    if (
        !preg_match('/^postgres(?:ql)?:\/\//i', $databaseUrl)
        && preg_match('/(?:^|\s)(postgres(?:ql)?:\/\/[^\'"\s]+)/i', $databaseUrl, $matches)
    ) {
        $databaseUrl = $matches[1];
    }
    $dsn = getenv('HALFCOURT_DB_DSN') ?: '';
    $user = getenv('HALFCOURT_DB_USER') ?: 'root';
    $password = getenv('HALFCOURT_DB_PASSWORD') ?: '';
    $isPostgres = false;

    if ($action === 'me') {
        respond([
            'user' => $_SESSION['member'] ?? null,
            'csrfToken' => csrfToken(),
        ]);
    }
    if ($action === 'logout') {
        requireSameOrigin();
        requireCsrfToken();
        $_SESSION = [];
        $cookie = session_get_cookie_params();
        if (ini_get('session.use_cookies')) {
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $cookie['path'],
                'domain' => $cookie['domain'],
                'secure' => $cookie['secure'],
                'httponly' => $cookie['httponly'],
                'samesite' => $cookie['samesite'] ?? 'Lax',
            ]);
        }
        session_destroy();
        respond(['user' => null]);
    }

    if ($dsn === '' && $databaseUrl !== '') {
        $urlParts = parse_url($databaseUrl);
        if (
            !$urlParts
            || !in_array(strtolower($urlParts['scheme'] ?? ''), ['postgres', 'postgresql'], true)
            || empty($urlParts['host'])
            || empty($urlParts['user'])
            || empty($urlParts['path'])
        ) {
            respond(['error' => 'DATABASE_URL must be a PostgreSQL connection URI, not a Supabase project URL.'], 503);
        }
        parse_str($urlParts['query'] ?? '', $urlOptions);
        $sslMode = $urlOptions['sslmode'] ?? 'require';
        if (!in_array($sslMode, ['require', 'verify-ca', 'verify-full'], true)) {
            respond(['error' => 'DATABASE_URL has an unsupported PostgreSQL sslmode.'], 503);
        }
        $databaseName = rawurldecode(ltrim($urlParts['path'], '/'));
        $port = (int) ($urlParts['port'] ?? 5432);
        $dsn = sprintf('pgsql:host=%s;port=%d;dbname=%s;sslmode=%s', $urlParts['host'], $port, $databaseName, $sslMode);
        $user = rawurldecode($urlParts['user']);
        $password = rawurldecode($urlParts['pass'] ?? '');
        $isPostgres = true;
    }

    if ($dsn === '') {
        if (getenv('VERCEL') === '1' || getenv('VERCEL_ENV')) {
            respond(['error' => 'The store database is not configured. Add DATABASE_URL to the Vercel Production environment.'], 503);
        }
        $dsn = 'mysql:host=127.0.0.1;port=3306;dbname=halfcourt_shoe;charset=utf8mb4';
    }

    $pdoOptions = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    if ($isPostgres) $pdoOptions[PDO::ATTR_EMULATE_PREPARES] = true;
    $db = new PDO($dsn, $user, $password, $pdoOptions);

    if ($action === 'orders') {
        if (empty($_SESSION['member']['id'])) respond(['error' => 'Sign in required'], 401);
        $query = $db->prepare('SELECT order_no, status, subtotal, shipping_fee, total, placed_at FROM orders WHERE customer_id = ? ORDER BY placed_at DESC');
        $query->execute([$_SESSION['member']['id']]);
        respond(['orders' => $query->fetchAll()]);
    }
    if ($action === 'adminOverview') {
        requireStoreAdmin($db);
        respond(storeAdminOverview($db, $isPostgres));
    }
    if ($action === 'register' || $action === 'login' || $action === 'order') {
        requireSameOrigin();
        $body = requestBody();
        if ($action === 'register') {
            $name = trim((string) ($body['name'] ?? ''));
            $contactNumber = trim((string) ($body['contact_number'] ?? ''));
            $accountAddress = trim((string) ($body['address'] ?? ''));
            $email = strtolower(trim((string) ($body['email'] ?? '')));
            $passwordValue = (string) ($body['password'] ?? '');
            if (strlen($name) < 2 || strlen($name) > 120 || !preg_match('/^[0-9+ ()-]{7,20}$/', $contactNumber) || strlen($accountAddress) < 5 || strlen($accountAddress) > 255 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 160 || strlen($passwordValue) < 12 || strlen($passwordValue) > 128) {
                respond(['error' => 'Enter valid account details and a password between 12 and 128 characters.'], 422);
            }
            $check = $db->prepare('SELECT id FROM customers WHERE email = ?');
            $check->execute([$email]);
            if ($check->fetch()) respond(['error' => 'Unable to create an account with those details.'], 409);
            $insertSql = 'INSERT INTO customers (full_name, email, contact_number, address, password_hash) VALUES (?, ?, ?, ?, ?)';
            if ($isPostgres) $insertSql .= ' RETURNING id';
            $insert = $db->prepare($insertSql);
            $insert->execute([$name, $email, $contactNumber, $accountAddress, password_hash($passwordValue, PASSWORD_DEFAULT)]);
            $customerId = (int) ($isPostgres ? $insert->fetchColumn() : $db->lastInsertId());
            session_regenerate_id(true);
            $_SESSION['member'] = ['id' => $customerId, 'name' => $name, 'email' => $email, 'contact_number' => $contactNumber, 'address' => $accountAddress];
            unset($_SESSION['csrf_token']);
            respond(['user' => $_SESSION['member'], 'csrfToken' => csrfToken()]);
        }
        if ($action === 'login') {
            $email = strtolower(trim((string) ($body['email'] ?? '')));
            $passwordValue = (string) ($body['password'] ?? '');
            if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 160 || strlen($passwordValue) > 128) {
                respond(['error' => 'Invalid email or password.'], 401);
            }
            $query = $db->prepare('SELECT id, full_name, email, contact_number, address, password_hash FROM customers WHERE email = ?');
            $query->execute([$email]);
            $member = $query->fetch();
            if (!$member || !password_verify($passwordValue, $member['password_hash'])) respond(['error' => 'Invalid email or password.'], 401);
            try {
                $audit = $db->prepare('INSERT INTO customer_sign_in_events (customer_id) VALUES (?)');
                $audit->execute([$member['id']]);
            } catch (PDOException $error) {
                $missingTable = $isPostgres
                    ? $error->getCode() === '42P01'
                    : $error->getCode() === '42S02';
                if (!$missingTable) throw $error;
            }
            session_regenerate_id(true);
            $_SESSION['member'] = ['id' => (int) $member['id'], 'name' => $member['full_name'], 'email' => $member['email'], 'contact_number' => $member['contact_number'], 'address' => $member['address']];
            unset($_SESSION['csrf_token']);
            respond(['user' => $_SESSION['member'], 'csrfToken' => csrfToken()]);
        }
        requireCsrfToken();
        $address = $body['address'] ?? [];
        $items = $body['items'] ?? [];
        $shippingId = (string) ($body['shippingId'] ?? '');
        if (!is_array($items) || !$items || count($items) > 20 || !is_array($address) || !$shippingId) {
            respond(['error' => 'Order details are incomplete or invalid.'], 422);
        }
        $addressFields = [
            'name' => [2, 120],
            'phone' => [7, 20],
            'street' => [1, 160],
            'brgy' => [1, 80],
            'city' => [1, 80],
            'province' => [1, 80],
            'zip' => [1, 10],
        ];
        foreach ($addressFields as $field => [$minimum, $maximum]) {
            $value = trim((string) ($address[$field] ?? ''));
            if (strlen($value) < $minimum || strlen($value) > $maximum) {
                respond(['error' => 'Enter valid delivery details and try again.'], 422);
            }
            $address[$field] = $value;
        }
        $address['email'] = trim((string) ($address['email'] ?? ''));
        if (strlen($address['email']) > 160 || ($address['email'] !== '' && !filter_var($address['email'], FILTER_VALIDATE_EMAIL))) {
            respond(['error' => 'Enter a valid delivery email and try again.'], 422);
        }

        $db->beginTransaction();
        $shippingQuery = $db->prepare('SELECT id, fee FROM shipping_methods WHERE id = ?');
        $shippingQuery->execute([$shippingId]);
        $shipping = $shippingQuery->fetch();
        if (!$shipping) {
            $db->rollBack();
            respond(['error' => 'Invalid shipping method.'], 422);
        }

        $productQuery = $db->prepare('SELECT id, name, colorway, price, stock FROM products WHERE id = ? AND is_active = TRUE FOR UPDATE');
        $sizeQuery = $db->prepare('SELECT stock FROM product_sizes WHERE product_id = ? AND size = ? FOR UPDATE');
        $decrementProduct = $db->prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
        $decrementSize = $db->prepare('UPDATE product_sizes SET stock = stock - ? WHERE product_id = ? AND size = ? AND stock >= ?');
        $normalizedItems = [];
        $subtotal = 0.0;

        foreach ($items as $item) {
            if (!is_array($item)) {
                $db->rollBack();
                respond(['error' => 'Invalid order item.'], 422);
            }
            $productId = (string) ($item['id'] ?? '');
            $size = trim((string) ($item['size'] ?? ''));
            $qty = filter_var($item['qty'] ?? null, FILTER_VALIDATE_INT);
            if (!preg_match('/^[a-zA-Z0-9_-]{1,40}$/', $productId) || !preg_match('/^[0-9]{1,2}(?:\\.5)?$/', $size) || $qty === false || $qty < 1 || $qty > 20) {
                $db->rollBack();
                respond(['error' => 'Invalid order item.'], 422);
            }

            $productQuery->execute([$productId]);
            $product = $productQuery->fetch();
            if (!$product) {
                $db->rollBack();
                respond(['error' => 'A selected product is no longer available.'], 409);
            }

            if ((int) $product['stock'] < $qty) {
                $db->rollBack();
                respond(['error' => $product['name'] . ' is out of stock.'], 409);
            }

            $sizeQuery->execute([$productId, $size]);
            $sizeStock = $sizeQuery->fetchColumn();
            if ($sizeStock === false) {
                $db->rollBack();
                respond(['error' => 'A selected shoe size is not available.'], 409);
            }
            if ((int) $sizeStock < $qty) {
                $db->rollBack();
                respond(['error' => $product['name'] . ' size ' . $size . ' does not have enough stock.'], 409);
            }

            $decrementProduct->execute([$qty, $productId, $qty]);
            if ($decrementProduct->rowCount() !== 1) {
                $db->rollBack();
                respond(['error' => $product['name'] . ' is out of stock.'], 409);
            }
            $decrementSize->execute([$qty, $productId, $size, $qty]);
            if ($decrementSize->rowCount() !== 1) {
                $db->rollBack();
                respond(['error' => $product['name'] . ' size ' . $size . ' is no longer available.'], 409);
            }

            $price = (float) $product['price'];
            $subtotal += $price * $qty;
            $normalizedItems[] = [$productId, $size, $qty, $price, $product['name'], $product['colorway']];
        }

        $shippingFee = (float) $shipping['fee'];
        $total = $subtotal + $shippingFee;
        $orderNo = 'DV-' . random_int(100000, 999999);
        $insertSql = 'INSERT INTO orders (order_no, customer_id, subtotal, shipping_method_id, shipping_fee, total) VALUES (?, ?, ?, ?, ?, ?)';
        if ($isPostgres) $insertSql .= ' RETURNING id';
        $insert = $db->prepare($insertSql);
        $customerId = $_SESSION['member']['id'] ?? null;
        $insert->execute([$orderNo, $customerId, $subtotal, $shippingId, $shippingFee, $total]);
        $orderId = (int) ($isPostgres ? $insert->fetchColumn() : $db->lastInsertId());
        $addressInsert = $db->prepare('INSERT INTO order_addresses (order_id, full_name, phone, email, street, barangay, city, province, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $addressInsert->execute([$orderId, $address['name'], $address['phone'], $address['email'] ?? null, $address['street'], $address['brgy'], $address['city'], $address['province'], $address['zip']]);
        $itemInsert = $db->prepare('INSERT INTO order_items (order_id, product_id, size, qty, unit_price, name, colorway) VALUES (?, ?, ?, ?, ?, ?, ?)');
        foreach ($normalizedItems as $item) {
            $itemInsert->execute([$orderId, ...$item]);
        }
        $db->commit();
        respond(['orderNo' => $orderNo, 'subtotal' => $subtotal, 'shippingFee' => $shippingFee, 'total' => $total]);
    }

    $products = $db->query(
        'SELECT p.id, p.model, p.name, p.colorway, p.price, p.stock, p.badge,
                p.image_url
         FROM products p
         WHERE p.is_active = TRUE
         ORDER BY p.created_at, p.id'
    )->fetchAll();

    $sizesByProduct = [];
    $sizes = $db->query(
        'SELECT product_id, size FROM product_sizes ORDER BY product_id, size'
    )->fetchAll();
    foreach ($sizes as $size) {
        $sizesByProduct[$size['product_id']][] = $size['size'];
    }

    foreach ($products as &$product) {
        $product['price'] = (float) $product['price'];
        $product['stock'] = (int) $product['stock'];
        $product['sizes'] = $sizesByProduct[$product['id']] ?? [];
    }
    unset($product);

    $shipping = $db->query(
        'SELECT id, label, eta, fee FROM shipping_methods ORDER BY id'
    )->fetchAll();

    foreach ($shipping as &$method) {
        $method['fee'] = (float) $method['fee'];
    }
    unset($method);

    respond(['products' => $products, 'shipping' => $shipping]);
} catch (Throwable $error) {
    $sqlState = $error instanceof PDOException
        ? (string) ($error->errorInfo[0] ?? $error->getCode())
        : 'unknown';
    error_log(sprintf(
        'Store API failure: action=%s exception=%s sqlstate=%s',
        $action !== '' ? $action : 'catalog',
        get_class($error),
        $sqlState
    ));

    if (in_array($sqlState, ['42P01', '42S02'], true)) {
        respond(['error' => 'Store database tables are missing. Run supabase-schema.sql in the Supabase SQL Editor.'], 503);
    }
    if (in_array($sqlState, ['08001', '08006', '28P01', '28000', 'HY000', '0'], true)) {
        respond(['error' => 'The store database connection failed. Check DATABASE_URL in the Vercel Production environment.'], 503);
    }
    respond(['error' => 'The store API could not complete this request. Please try again later.'], 500);
}
