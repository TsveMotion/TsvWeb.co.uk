<?php
/**
 * REST API Class
 * Handles REST API endpoints for remote optimizer control
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class TsvWeb_PO_REST_API {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Get optimizer status
        register_rest_route('tsvweb-optimizer/v1', '/status', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_optimizer_status'),
            'permission_callback' => array($this, 'check_api_key_permission'),
        ));

        // Enable/disable optimizer
        register_rest_route('tsvweb-optimizer/v1', '/toggle', array(
            'methods' => 'POST',
            'callback' => array($this, 'toggle_optimizer'),
            'permission_callback' => array($this, 'check_api_key_permission'),
            'args' => array(
                'enabled' => array(
                    'required' => true,
                    'type' => 'boolean',
                    'description' => 'Whether to enable or disable the optimizer',
                ),
            ),
        ));

        // Get optimizer statistics
        register_rest_route('tsvweb-optimizer/v1', '/stats', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_optimizer_stats'),
            'permission_callback' => array($this, 'check_api_key_permission'),
        ));
    }

    /**
     * Check API key permission
     */
    public function check_api_key_permission($request) {
        $api_key = $request->get_header('X-API-Key');
        
        if (empty($api_key)) {
            return new WP_Error(
                'missing_api_key',
                'API key is required',
                array('status' => 401)
            );
        }

        // Get stored API key from TsvWeb Control plugin
        $stored_api_key = get_option('tsvweb_api_key');
        
        if (empty($stored_api_key) || $api_key !== $stored_api_key) {
            return new WP_Error(
                'invalid_api_key',
                'Invalid API key',
                array('status' => 403)
            );
        }

        return true;
    }

    /**
     * Get optimizer status
     */
    public function get_optimizer_status($request) {
        $enabled = get_option('tsvweb_po_enabled', false);
        $last_run = get_option('tsvweb_po_last_run', null);
        
        return rest_ensure_response(array(
            'success' => true,
            'enabled' => (bool) $enabled,
            'last_run' => $last_run,
            'api_key_configured' => !empty(getenv('OPENAI_API_KEY')),
            'woocommerce_active' => class_exists('WooCommerce'),
        ));
    }

    /**
     * Toggle optimizer
     */
    public function toggle_optimizer($request) {
        $enabled = $request->get_param('enabled');
        
        // Update option
        update_option('tsvweb_po_enabled', $enabled);
        
        // Log the change
        error_log(sprintf(
            'TsvWeb Product Optimizer %s via REST API',
            $enabled ? 'enabled' : 'disabled'
        ));
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => sprintf(
                'Optimizer %s successfully',
                $enabled ? 'enabled' : 'disabled'
            ),
            'enabled' => (bool) $enabled,
            'timestamp' => current_time('mysql'),
        ));
    }

    /**
     * Get optimizer statistics
     */
    public function get_optimizer_stats($request) {
        global $wpdb;
        
        // Get optimization count from post meta
        $optimization_count = $wpdb->get_var("
            SELECT COUNT(DISTINCT post_id)
            FROM {$wpdb->postmeta}
            WHERE meta_key = '_tsvweb_po_optimized'
            AND meta_value = '1'
        ");
        
        // Get total tokens used
        $total_tokens = $wpdb->get_var("
            SELECT SUM(CAST(meta_value AS UNSIGNED))
            FROM {$wpdb->postmeta}
            WHERE meta_key = '_tsvweb_po_tokens_used'
        ");
        
        // Get last optimization date
        $last_optimization = $wpdb->get_var("
            SELECT MAX(meta_value)
            FROM {$wpdb->postmeta}
            WHERE meta_key = '_tsvweb_po_optimized_date'
        ");
        
        return rest_ensure_response(array(
            'success' => true,
            'stats' => array(
                'total_optimizations' => (int) $optimization_count,
                'total_tokens_used' => (int) $total_tokens,
                'last_optimization' => $last_optimization,
                'enabled' => (bool) get_option('tsvweb_po_enabled', false),
            ),
        ));
    }
}
