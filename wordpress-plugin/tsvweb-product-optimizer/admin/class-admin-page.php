<?php
/**
 * Admin Page Class
 * Handles the admin interface for product optimization
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class TsvWeb_PO_Admin_Page {

    /**
     * Constructor
     */
    public function __construct() {
        // Add admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Enqueue admin scripts and styles
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        
        // Register AJAX handlers
        add_action('wp_ajax_tsvweb_po_optimize_single', array($this, 'ajax_optimize_single'));
        add_action('wp_ajax_tsvweb_po_optimize_bulk', array($this, 'ajax_optimize_bulk'));
    }

    /**
     * Add admin menu under WooCommerce
     */
    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            __('Product Optimizer', 'tsvweb-product-optimizer'),
            __('Product Optimizer', 'tsvweb-product-optimizer'),
            'manage_woocommerce',
            'tsvweb-product-optimizer',
            array($this, 'render_admin_page')
        );
    }

    /**
     * Enqueue admin scripts and styles
     * 
     * @param string $hook Current admin page hook
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our admin page
        if ($hook !== 'woocommerce_page_tsvweb-product-optimizer') {
            return;
        }

        // Enqueue admin JavaScript
        wp_enqueue_script(
            'tsvweb-po-admin',
            TSVWEB_PO_PLUGIN_URL . 'admin/js/admin.js',
            array('jquery'),
            TSVWEB_PO_VERSION,
            true
        );

        // Localize script with AJAX URL and nonce
        wp_localize_script('tsvweb-po-admin', 'tsvwebPO', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('tsvweb_po_nonce'),
            'strings' => array(
                'optimizing' => __('Optimizing...', 'tsvweb-product-optimizer'),
                'success' => __('Optimization completed successfully!', 'tsvweb-product-optimizer'),
                'error' => __('Optimization failed. Please try again.', 'tsvweb-product-optimizer'),
                'selectProducts' => __('Please select at least one product.', 'tsvweb-product-optimizer'),
                'confirmBulk' => __('Are you sure you want to optimize the selected products?', 'tsvweb-product-optimizer')
            )
        ));

        // Enqueue admin styles
        wp_enqueue_style(
            'tsvweb-po-admin',
            TSVWEB_PO_PLUGIN_URL . 'admin/css/admin.css',
            array(),
            TSVWEB_PO_VERSION
        );
    }

    /**
     * Render the admin page
     */
    public function render_admin_page() {
        // Check user capabilities
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'tsvweb-product-optimizer'));
        }

        // Get products
        $products = $this->get_products();

        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <?php $this->render_api_key_status(); ?>

            <div class="tsvweb-po-actions">
                <button type="button" id="tsvweb-po-bulk-optimize" class="button button-primary">
                    <?php _e('Optimize Selected Products', 'tsvweb-product-optimizer'); ?>
                </button>
                <button type="button" id="tsvweb-po-select-all" class="button">
                    <?php _e('Select All', 'tsvweb-product-optimizer'); ?>
                </button>
                <button type="button" id="tsvweb-po-deselect-all" class="button">
                    <?php _e('Deselect All', 'tsvweb-product-optimizer'); ?>
                </button>
            </div>

            <div id="tsvweb-po-messages"></div>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <td class="check-column">
                            <input type="checkbox" id="tsvweb-po-select-all-checkbox">
                        </td>
                        <th><?php _e('Product', 'tsvweb-product-optimizer'); ?></th>
                        <th><?php _e('Title', 'tsvweb-product-optimizer'); ?></th>
                        <th><?php _e('Status', 'tsvweb-product-optimizer'); ?></th>
                        <th><?php _e('Last Optimized', 'tsvweb-product-optimizer'); ?></th>
                        <th><?php _e('Actions', 'tsvweb-product-optimizer'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($products)) : ?>
                        <?php foreach ($products as $product) : ?>
                            <?php $this->render_product_row($product); ?>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <tr>
                            <td colspan="6">
                                <?php _e('No products found.', 'tsvweb-product-optimizer'); ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * Render API key status notice
     */
    private function render_api_key_status() {
        $optimizer = new TsvWeb_Product_Optimizer();
        
        if (!$optimizer->has_api_key()) {
            ?>
            <div class="notice notice-error">
                <p>
                    <strong><?php _e('OpenAI API Key Missing:', 'tsvweb-product-optimizer'); ?></strong>
                    <?php _e('Please set the OPENAI_API_KEY environment variable to use this plugin.', 'tsvweb-product-optimizer'); ?>
                </p>
            </div>
            <?php
        } else {
            ?>
            <div class="notice notice-success">
                <p>
                    <strong><?php _e('API Key Configured:', 'tsvweb-product-optimizer'); ?></strong>
                    <?php _e('OpenAI API key is properly configured.', 'tsvweb-product-optimizer'); ?>
                </p>
            </div>
            <?php
        }
    }

    /**
     * Get products for the table
     * 
     * @return array Array of WC_Product objects
     */
    private function get_products() {
        $args = array(
            'limit' => -1,
            'status' => 'publish',
            'orderby' => 'date',
            'order' => 'DESC'
        );

        return wc_get_products($args);
    }

    /**
     * Render a single product row
     * 
     * @param WC_Product $product Product object
     */
    private function render_product_row($product) {
        $product_id = $product->get_id();
        $last_optimized = get_post_meta($product_id, '_tsvweb_po_last_optimized', true);
        $is_optimized = get_post_meta($product_id, '_tsvweb_po_optimized', true) === 'yes';
        
        ?>
        <tr data-product-id="<?php echo esc_attr($product_id); ?>">
            <th class="check-column">
                <input type="checkbox" class="tsvweb-po-product-checkbox" value="<?php echo esc_attr($product_id); ?>">
            </th>
            <td>
                <?php if ($product->get_image_id()) : ?>
                    <?php echo $product->get_image('thumbnail'); ?>
                <?php else : ?>
                    <span class="dashicons dashicons-format-image"></span>
                <?php endif; ?>
            </td>
            <td>
                <strong><?php echo esc_html($product->get_name()); ?></strong>
                <br>
                <small><?php echo esc_html($product->get_sku()); ?></small>
            </td>
            <td>
                <?php if ($is_optimized) : ?>
                    <span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>
                    <?php _e('Optimized', 'tsvweb-product-optimizer'); ?>
                <?php else : ?>
                    <span class="dashicons dashicons-minus" style="color: #999;"></span>
                    <?php _e('Not Optimized', 'tsvweb-product-optimizer'); ?>
                <?php endif; ?>
            </td>
            <td>
                <?php if ($last_optimized) : ?>
                    <?php echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($last_optimized))); ?>
                <?php else : ?>
                    <span style="color: #999;"><?php _e('Never', 'tsvweb-product-optimizer'); ?></span>
                <?php endif; ?>
            </td>
            <td>
                <button type="button" 
                        class="button button-small tsvweb-po-optimize-single" 
                        data-product-id="<?php echo esc_attr($product_id); ?>">
                    <?php _e('Optimize with AI', 'tsvweb-product-optimizer'); ?>
                </button>
                <span class="tsvweb-po-spinner" style="display: none;">
                    <span class="spinner is-active" style="float: none; margin: 0;"></span>
                </span>
            </td>
        </tr>
        <?php
    }

    /**
     * AJAX handler for single product optimization
     */
    public function ajax_optimize_single() {
        // Verify nonce
        check_ajax_referer('tsvweb_po_nonce', 'nonce');

        // Check user capabilities
        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(array(
                'message' => __('Insufficient permissions', 'tsvweb-product-optimizer')
            ));
        }

        // Get product ID
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

        if (empty($product_id)) {
            wp_send_json_error(array(
                'message' => __('Invalid product ID', 'tsvweb-product-optimizer')
            ));
        }

        // Optimize product
        $optimizer = new TsvWeb_Product_Optimizer();
        $result = $optimizer->optimize_product($product_id);

        if ($result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result);
        }
    }

    /**
     * AJAX handler for bulk product optimization
     */
    public function ajax_optimize_bulk() {
        // Verify nonce
        check_ajax_referer('tsvweb_po_nonce', 'nonce');

        // Check user capabilities
        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(array(
                'message' => __('Insufficient permissions', 'tsvweb-product-optimizer')
            ));
        }

        // Get product IDs
        $product_ids = isset($_POST['product_ids']) ? array_map('intval', $_POST['product_ids']) : array();

        if (empty($product_ids)) {
            wp_send_json_error(array(
                'message' => __('No products selected', 'tsvweb-product-optimizer')
            ));
        }

        // Optimize products
        $optimizer = new TsvWeb_Product_Optimizer();
        $results = $optimizer->optimize_products($product_ids);

        // Count successes and failures
        $success_count = 0;
        $failure_count = 0;
        $messages = array();

        foreach ($results as $product_id => $result) {
            if ($result['success']) {
                $success_count++;
            } else {
                $failure_count++;
                $product = wc_get_product($product_id);
                $product_name = $product ? $product->get_name() : "Product #{$product_id}";
                $messages[] = sprintf(__('%s: %s', 'tsvweb-product-optimizer'), $product_name, $result['message']);
            }
        }

        $summary = sprintf(
            __('Optimized %d products successfully. %d failed.', 'tsvweb-product-optimizer'),
            $success_count,
            $failure_count
        );

        wp_send_json_success(array(
            'message' => $summary,
            'success_count' => $success_count,
            'failure_count' => $failure_count,
            'details' => $messages
        ));
    }
}
