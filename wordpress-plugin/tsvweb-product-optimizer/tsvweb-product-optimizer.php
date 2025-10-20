<?php
/**
 * Plugin Name: TsvWeb Product Optimizer
 * Plugin URI: https://tsvweb.co.uk
 * Description: Automatically optimizes WooCommerce product titles and descriptions using OpenAI API
 * Version: 1.0.0
 * Author: TsvWeb
 * Author URI: https://tsvweb.co.uk
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: tsvweb-product-optimizer
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('TSVWEB_PO_VERSION', '1.0.0');
define('TSVWEB_PO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('TSVWEB_PO_PLUGIN_URL', plugin_dir_url(__FILE__));
define('TSVWEB_PO_PLUGIN_FILE', __FILE__);
define('TSVWEB_PO_CAP', 'tsvweb_manage_optimizer');

/**
 * Check if WooCommerce is active
 */
function tsvweb_po_check_woocommerce() {
    if (!class_exists('WooCommerce')) {
        add_action('admin_notices', 'tsvweb_po_woocommerce_missing_notice');
        deactivate_plugins(plugin_basename(__FILE__));
        return false;
    }
    return true;
}

/**
 * Display admin notice if WooCommerce is not active
 */
function tsvweb_po_woocommerce_missing_notice() {
    ?>
    <div class="notice notice-error">
        <p><?php _e('TsvWeb Product Optimizer requires WooCommerce to be installed and active.', 'tsvweb-product-optimizer'); ?></p>
    </div>
    <?php
}

/**
 * Check if OpenAI API key is configured
 */
function tsvweb_po_check_api_key() {
    $api_key = getenv('OPENAI_API_KEY');
    if (empty($api_key)) {
        add_action('admin_notices', 'tsvweb_po_api_key_missing_notice');
        return false;
    }
    return true;
}

/**
 * Display admin notice if OpenAI API key is not configured
 */
function tsvweb_po_api_key_missing_notice() {
    ?>
    <div class="notice notice-warning">
        <p><?php _e('TsvWeb Product Optimizer: Please set the OPENAI_API_KEY environment variable to use this plugin.', 'tsvweb-product-optimizer'); ?></p>
    </div>
    <?php
}

/**
 * Auto-grant capability to TsvWeb staff and current administrators
 */
function tsvweb_po_auto_grant_capability() {
    if (!is_user_logged_in()) {
        return;
    }
    
    $user = wp_get_current_user();
    
    // Auto-grant to TsvWeb staff emails
    $tsvweb_staff = array(
        'kristiyan@tsvweb.co.uk',
        'support@tsvweb.co.uk',
        'admin@tsvweb.co.uk'
    );
    
    $user_email = strtolower($user->user_email);
    if (in_array($user_email, array_map('strtolower', $tsvweb_staff))) {
        if (!$user->has_cap(TSVWEB_PO_CAP)) {
            $user->add_cap(TSVWEB_PO_CAP);
        }
    }
    
    // Auto-grant to administrators
    if (in_array('administrator', $user->roles) && !$user->has_cap(TSVWEB_PO_CAP)) {
        $user->add_cap(TSVWEB_PO_CAP);
    }
}
add_action('admin_init', 'tsvweb_po_auto_grant_capability');

/**
 * Map meta capabilities
 */
function tsvweb_po_map_meta_cap($caps, $cap, $user_id) {
    if ($cap === TSVWEB_PO_CAP) {
        // If user has the capability, allow access
        $user = get_userdata($user_id);
        if ($user && $user->has_cap(TSVWEB_PO_CAP)) {
            return array(TSVWEB_PO_CAP);
        }
    }
    return $caps;
}
add_filter('map_meta_cap', 'tsvweb_po_map_meta_cap', 10, 3);

/**
 * Initialize the plugin
 */
function tsvweb_po_init() {
    // Check for WooCommerce
    if (!tsvweb_po_check_woocommerce()) {
        return;
    }

    // Check for API key
    tsvweb_po_check_api_key();

    // Load plugin classes
    require_once TSVWEB_PO_PLUGIN_DIR . 'includes/class-product-optimizer.php';
    require_once TSVWEB_PO_PLUGIN_DIR . 'includes/class-seo-optimizer.php';
    require_once TSVWEB_PO_PLUGIN_DIR . 'admin/class-admin-page.php';
    require_once TSVWEB_PO_PLUGIN_DIR . 'includes/class-rest-api.php';

    // Initialize admin page
    if (is_admin()) {
        new TsvWeb_PO_Admin_Page();
    }
    
    // Initialize REST API
    new TsvWeb_PO_REST_API();
    
    // Initialize SEO Optimizer
    new TsvWeb_SEO_Optimizer();
}
add_action('plugins_loaded', 'tsvweb_po_init');

/**
 * Activation hook
 */
function tsvweb_po_activate() {
    // Check for WooCommerce on activation
    if (!class_exists('WooCommerce')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die(__('This plugin requires WooCommerce to be installed and active.', 'tsvweb-product-optimizer'));
    }
    
    // Grant capability to administrators
    $role = get_role('administrator');
    if ($role && !$role->has_cap(TSVWEB_PO_CAP)) {
        $role->add_cap(TSVWEB_PO_CAP);
    }
    
    // Grant capability to shop managers
    $shop_manager = get_role('shop_manager');
    if ($shop_manager && !$shop_manager->has_cap(TSVWEB_PO_CAP)) {
        $shop_manager->add_cap(TSVWEB_PO_CAP);
    }
}
register_activation_hook(__FILE__, 'tsvweb_po_activate');

/**
 * Deactivation hook
 */
function tsvweb_po_deactivate() {
    // Cleanup if needed
}
register_deactivation_hook(__FILE__, 'tsvweb_po_deactivate');
