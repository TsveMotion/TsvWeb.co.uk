<?php
/**
 * Standalone WordPress Admin Creator
 * Upload this file to the WordPress root directory and run it via cron or browser
 * 
 * Usage via Cron:
 * /usr/bin/php8.3 /home/patel123/htdocs/patel.tsvweb.com/wordpress-create-admin.php
 * 
 * Usage via URL (REMOVE AFTER USE):
 * https://patel.tsvweb.com/wordpress-create-admin.php?email=admin@example.com&username=admin&password=securepass&key=YOUR_SECRET_KEY
 */

// Security key - CHANGE THIS!
define('ADMIN_CREATOR_KEY', 'tsvweb-secure-key-2025');

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Function to create admin user
function tsvweb_create_admin($email, $username, $password) {
    // Check if user already exists
    if (username_exists($username)) {
        return [
            'success' => false,
            'message' => 'Username already exists',
            'username' => $username
        ];
    }
    
    if (email_exists($email)) {
        return [
            'success' => false,
            'message' => 'Email already exists',
            'email' => $email
        ];
    }
    
    // Create the user
    $user_id = wp_create_user($username, $password, $email);
    
    if (is_wp_error($user_id)) {
        return [
            'success' => false,
            'message' => $user_id->get_error_message()
        ];
    }
    
    // Set user role to administrator
    $user = new WP_User($user_id);
    $user->set_role('administrator');
    
    return [
        'success' => true,
        'message' => 'Administrator created successfully',
        'user_id' => $user_id,
        'username' => $username,
        'email' => $email
    ];
}

// Check if running via CLI (cron)
if (php_sapi_name() === 'cli') {
    // CLI mode - get arguments
    $options = getopt('', ['email:', 'username:', 'password:']);
    
    if (empty($options['email']) || empty($options['username']) || empty($options['password'])) {
        echo "Usage: php wordpress-create-admin.php --email=admin@example.com --username=admin --password=securepass\n";
        exit(1);
    }
    
    $result = tsvweb_create_admin($options['email'], $options['username'], $options['password']);
    
    echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
    exit($result['success'] ? 0 : 1);
}

// Web mode - check security key
if (!isset($_GET['key']) || $_GET['key'] !== ADMIN_CREATOR_KEY) {
    header('HTTP/1.1 403 Forbidden');
    die('Access denied');
}

// Get parameters
$email = isset($_GET['email']) ? sanitize_email($_GET['email']) : '';
$username = isset($_GET['username']) ? sanitize_user($_GET['username']) : '';
$password = isset($_GET['password']) ? $_GET['password'] : '';

if (empty($email) || empty($username) || empty($password)) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Missing required parameters: email, username, password'
    ]);
    exit;
}

// Create the admin
$result = tsvweb_create_admin($email, $username, $password);

// Return JSON response
header('Content-Type: application/json');
echo json_encode($result);

// Log the action
error_log('TsvWeb Admin Creator: ' . json_encode($result));
