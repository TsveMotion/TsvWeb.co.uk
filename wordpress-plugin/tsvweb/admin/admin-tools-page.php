<?php
/**
 * TsvWeb Admin Tools Page
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!current_user_can('manage_options')) {
    wp_die('Access denied');
}

$tsvweb_plugin = new TsvWeb_Plugin();

// Handle manual actions
if (isset($_POST['force_sync']) && check_admin_referer('tsvweb_admin_tools', 'tsvweb_admin_nonce')) {
    $tsvweb_plugin->send_stats();
    echo '<div class="notice notice-success"><p>Stats synced successfully!</p></div>';
}

if (isset($_POST['clear_cache']) && check_admin_referer('tsvweb_admin_tools', 'tsvweb_admin_nonce')) {
    $settings = get_option('tsvweb_settings', array());
    delete_transient('tsvweb_verification_' . md5($settings['api_key'] ?? ''));
    delete_transient('tsvweb_payment_status');
    echo '<div class="notice notice-success"><p>Cache cleared!</p></div>';
}

$settings = get_option('tsvweb_settings', array());
?>

<div class="wrap">
    <h1>TsvWeb Admin Tools</h1>
    <p><em>These tools are for TsvWeb staff only and are hidden from clients.</em></p>
    
    <div class="card">
        <h2>Quick Actions</h2>
        <form method="post" action="" style="display: inline-block; margin-right: 10px;">
            <?php wp_nonce_field('tsvweb_admin_tools', 'tsvweb_admin_nonce'); ?>
            <button type="submit" name="force_sync" class="button button-primary">Force Sync Now</button>
        </form>
        
        <form method="post" action="" style="display: inline-block;">
            <?php wp_nonce_field('tsvweb_admin_tools', 'tsvweb_admin_nonce'); ?>
            <button type="submit" name="clear_cache" class="button">Clear Cache</button>
        </form>
    </div>
    
    <div class="card">
        <h2>System Information</h2>
        <table class="widefat">
            <tr>
                <th>Plugin Version</th>
                <td><?php echo esc_html(TSVWEB_VERSION); ?></td>
            </tr>
            <tr>
                <th>API Key Configured</th>
                <td><?php echo !empty($settings['api_key']) ? 'Yes' : 'No'; ?></td>
            </tr>
            <tr>
                <th>Last Sync</th>
                <td><?php echo esc_html($settings['last_sync'] ?? 'Never'); ?></td>
            </tr>
            <tr>
                <th>Cron Status</th>
                <td><?php echo wp_next_scheduled('tsvweb_stats_sync') ? 'Scheduled' : 'Not Scheduled'; ?></td>
            </tr>
            <tr>
                <th>WooCommerce Active</th>
                <td><?php echo class_exists('WooCommerce') ? 'Yes' : 'No'; ?></td>
            </tr>
            <tr>
                <th>Product Optimizer Enabled</th>
                <td><?php echo get_option('tsvweb_optimizer_enabled', 'no') === 'yes' ? 'Yes' : 'No'; ?></td>
            </tr>
        </table>
    </div>
    
    <div class="card">
        <h2>Remote Management Endpoints</h2>
        <table class="widefat">
            <thead>
                <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>/wp-json/tsvweb/v1/create-admin</code></td>
                    <td>POST</td>
                    <td>Create admin user remotely</td>
                </tr>
                <tr>
                    <td><code>/wp-json/tsvweb/v1/reset-password</code></td>
                    <td>POST</td>
                    <td>Reset user password remotely</td>
                </tr>
            </tbody>
        </table>
        <p><em>All endpoints require API key authentication via X-API-Key header</em></p>
    </div>
</div>
