<?php
/**
 * Optimizer Admin Class
 * Handles the admin interface for product optimization with usage controls
 */

if (!defined('ABSPATH')) {
    exit;
}

class TsvWeb_Optimizer_Admin {

    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_ajax_tsvweb_po_optimize_single', array($this, 'ajax_optimize_single'));
        add_action('wp_ajax_tsvweb_po_optimize_bulk', array($this, 'ajax_optimize_bulk'));
    }

    public function add_admin_menu() {
        // Add under TsvWeb Control menu
        add_submenu_page(
            'tsvweb-control',
            __('Product Optimizer', 'tsvweb'),
            __('Product Optimizer', 'tsvweb'),
            'manage_woocommerce',
            'tsvweb-product-optimizer',
            array($this, 'render_admin_page')
        );
    }

    public function enqueue_admin_assets($hook) {
        if ($hook !== 'tsvweb-control_page_tsvweb-product-optimizer') {
            return;
        }

        wp_enqueue_script(
            'tsvweb-po-admin',
            TSVWEB_PLUGIN_URL . 'admin/js/optimizer-admin.js',
            array('jquery'),
            TSVWEB_VERSION,
            true
        );

        wp_localize_script('tsvweb-po-admin', 'tsvwebPO', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('tsvweb_po_nonce'),
            'strings' => array(
                'optimizing' => __('Optimizing...', 'tsvweb'),
                'success' => __('Optimization completed successfully!', 'tsvweb'),
                'error' => __('Optimization failed. Please try again.', 'tsvweb'),
                'selectProducts' => __('Please select at least one product.', 'tsvweb'),
                'confirmBulk' => __('Are you sure you want to optimize the selected products?', 'tsvweb')
            )
        ));

        wp_enqueue_style(
            'tsvweb-po-admin',
            TSVWEB_PLUGIN_URL . 'admin/css/optimizer-admin.css',
            array(),
            TSVWEB_VERSION
        );
    }

    public function render_admin_page() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'tsvweb'));
        }

        $optimizer = new TsvWeb_Product_Optimizer();
        $is_enabled = $optimizer->is_enabled();
        $stats = $optimizer->get_stats();
        $products = $this->get_products();

        // Handle enable/disable toggle
        if (isset($_POST['toggle_optimizer']) && check_admin_referer('tsvweb_optimizer_toggle', 'tsvweb_optimizer_nonce')) {
            $new_status = $_POST['optimizer_status'] === 'yes' ? 'yes' : 'no';
            update_option('tsvweb_optimizer_enabled', $new_status);
            $is_enabled = $new_status === 'yes';
            echo '<div class="notice notice-success is-dismissible"><p>' . __('Optimizer status updated!', 'tsvweb') . '</p></div>';
        }

        ?>
        <div class="wrap tsvweb-optimizer">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <style>
                .tsvweb-optimizer .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                .tsvweb-optimizer .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border-left: 4px solid #007cba;
                }
                .tsvweb-optimizer .stat-card h3 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    color: #646970;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .tsvweb-optimizer .stat-card .stat-value {
                    font-size: 32px;
                    font-weight: 700;
                    color: #1d2327;
                    margin: 10px 0;
                }
                .tsvweb-optimizer .stat-card .stat-label {
                    font-size: 12px;
                    color: #646970;
                }
                .tsvweb-optimizer .toggle-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .tsvweb-optimizer .toggle-section h2 {
                    color: white;
                    margin-top: 0;
                }
                .tsvweb-optimizer .status-badge {
                    display: inline-block;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                }
                .tsvweb-optimizer .status-enabled {
                    background: #d4edda;
                    color: #155724;
                }
                .tsvweb-optimizer .status-disabled {
                    background: #f8d7da;
                    color: #721c24;
                }
            </style>

            <!-- Enable/Disable Control -->
            <div class="toggle-section">
                <h2>🤖 AI Product Optimizer Control</h2>
                <p style="margin: 10px 0 20px 0; opacity: 0.95;">
                    Control whether users can optimize products using AI. When disabled, the optimization features will be unavailable to all users.
                </p>
                
                <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                    <div>
                        <strong>Current Status:</strong>
                        <?php if ($is_enabled): ?>
                            <span class="status-badge status-enabled">✓ Enabled</span>
                        <?php else: ?>
                            <span class="status-badge status-disabled">✗ Disabled</span>
                        <?php endif; ?>
                    </div>
                    
                    <form method="post" action="" style="margin: 0;">
                        <?php wp_nonce_field('tsvweb_optimizer_toggle', 'tsvweb_optimizer_nonce'); ?>
                        <input type="hidden" name="optimizer_status" value="<?php echo $is_enabled ? 'no' : 'yes'; ?>">
                        <button type="submit" name="toggle_optimizer" class="button button-large" style="background: white; color: #667eea; border: none; font-weight: 600; padding: 10px 24px;">
                            <?php echo $is_enabled ? '🔒 Disable Optimizer' : '🔓 Enable Optimizer'; ?>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Usage Statistics -->
            <h2>📊 Usage Statistics</h2>
            <div class="stats-grid">
                <div class="stat-card" style="border-left-color: #007cba;">
                    <h3>Total Optimizations</h3>
                    <div class="stat-value"><?php echo number_format($stats['total_optimizations']); ?></div>
                    <div class="stat-label">Products optimized</div>
                </div>
                
                <div class="stat-card" style="border-left-color: #00a32a;">
                    <h3>Tokens Used</h3>
                    <div class="stat-value"><?php echo number_format($stats['total_tokens_used']); ?></div>
                    <div class="stat-label">OpenAI API tokens consumed</div>
                </div>
                
                <div class="stat-card" style="border-left-color: #d63638;">
                    <h3>Estimated Cost</h3>
                    <div class="stat-value">$<?php echo number_format($stats['total_cost_usd'], 2); ?></div>
                    <div class="stat-label">Total AI usage cost (USD)</div>
                </div>
                
                <div class="stat-card" style="border-left-color: #dba617;">
                    <h3>Last Optimization</h3>
                    <div class="stat-value" style="font-size: 18px;">
                        <?php 
                        if ($stats['last_optimization']) {
                            echo human_time_diff(strtotime($stats['last_optimization']), current_time('timestamp')) . ' ago';
                        } else {
                            echo 'Never';
                        }
                        ?>
                    </div>
                    <div class="stat-label">Most recent optimization</div>
                </div>
            </div>

            <?php $this->render_api_key_status($optimizer); ?>

            <?php if ($is_enabled): ?>
                <div class="tsvweb-po-actions" style="margin: 20px 0; padding: 15px; background: #fff; border: 1px solid #ccd0d4; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
                    <button type="button" id="tsvweb-po-bulk-optimize" class="button button-primary">
                        <?php _e('Optimize Selected Products', 'tsvweb'); ?>
                    </button>
                    <button type="button" id="tsvweb-po-select-all" class="button">
                        <?php _e('Select All', 'tsvweb'); ?>
                    </button>
                    <button type="button" id="tsvweb-po-deselect-all" class="button">
                        <?php _e('Deselect All', 'tsvweb'); ?>
                    </button>
                </div>

                <div id="tsvweb-po-messages"></div>

                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <td class="check-column">
                                <input type="checkbox" id="tsvweb-po-select-all-checkbox">
                            </td>
                            <th><?php _e('Product', 'tsvweb'); ?></th>
                            <th><?php _e('Title', 'tsvweb'); ?></th>
                            <th><?php _e('Status', 'tsvweb'); ?></th>
                            <th><?php _e('Last Optimized', 'tsvweb'); ?></th>
                            <th><?php _e('Actions', 'tsvweb'); ?></th>
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
                                    <?php _e('No products found.', 'tsvweb'); ?>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="notice notice-warning" style="padding: 20px; margin: 20px 0;">
                    <h3>⚠️ Product Optimizer is Disabled</h3>
                    <p>The AI product optimizer is currently disabled. Enable it above to allow product optimization.</p>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }

    private function render_api_key_status($optimizer) {
        if (!$optimizer->has_api_key()) {
            ?>
            <div class="notice notice-error">
                <p>
                    <strong><?php _e('OpenAI API Key Missing:', 'tsvweb'); ?></strong>
                    <?php _e('Please set the OPENAI_API_KEY environment variable to use this plugin.', 'tsvweb'); ?>
                </p>
            </div>
            <?php
        } else {
            ?>
            <div class="notice notice-success">
                <p>
                    <strong><?php _e('API Key Configured:', 'tsvweb'); ?></strong>
                    <?php _e('OpenAI API key is properly configured.', 'tsvweb'); ?>
                </p>
            </div>
            <?php
        }
    }

    private function get_products() {
        $args = array(
            'limit' => -1,
            'status' => 'publish',
            'orderby' => 'date',
            'order' => 'DESC'
        );

        return wc_get_products($args);
    }

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
                    <?php _e('Optimized', 'tsvweb'); ?>
                <?php else : ?>
                    <span class="dashicons dashicons-minus" style="color: #999;"></span>
                    <?php _e('Not Optimized', 'tsvweb'); ?>
                <?php endif; ?>
            </td>
            <td>
                <?php if ($last_optimized) : ?>
                    <?php echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($last_optimized))); ?>
                <?php else : ?>
                    <span style="color: #999;"><?php _e('Never', 'tsvweb'); ?></span>
                <?php endif; ?>
            </td>
            <td>
                <button type="button" 
                        class="button button-small tsvweb-po-optimize-single" 
                        data-product-id="<?php echo esc_attr($product_id); ?>">
                    <?php _e('Optimize with AI', 'tsvweb'); ?>
                </button>
                <span class="tsvweb-po-spinner" style="display: none;">
                    <span class="spinner is-active" style="float: none; margin: 0;"></span>
                </span>
            </td>
        </tr>
        <?php
    }

    public function ajax_optimize_single() {
        check_ajax_referer('tsvweb_po_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(array(
                'message' => __('Insufficient permissions', 'tsvweb')
            ));
        }

        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

        if (empty($product_id)) {
            wp_send_json_error(array(
                'message' => __('Invalid product ID', 'tsvweb')
            ));
        }

        $optimizer = new TsvWeb_Product_Optimizer();
        $result = $optimizer->optimize_product($product_id);

        if ($result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result);
        }
    }

    public function ajax_optimize_bulk() {
        check_ajax_referer('tsvweb_po_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(array(
                'message' => __('Insufficient permissions', 'tsvweb')
            ));
        }

        $product_ids = isset($_POST['product_ids']) ? array_map('intval', $_POST['product_ids']) : array();

        if (empty($product_ids)) {
            wp_send_json_error(array(
                'message' => __('No products selected', 'tsvweb')
            ));
        }

        $optimizer = new TsvWeb_Product_Optimizer();
        $results = $optimizer->optimize_products($product_ids);

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
                $messages[] = sprintf(__('%s: %s', 'tsvweb'), $product_name, $result['message']);
            }
        }

        $summary = sprintf(
            __('Optimized %d products successfully. %d failed.', 'tsvweb'),
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
