<?php
/**
 * TsvWeb Settings Page
 */

if (!defined('ABSPATH')) {
    exit;
}

$settings = get_option('tsvweb_settings', array());
$api_key = isset($settings['api_key']) ? $settings['api_key'] : '';
$last_sync = isset($settings['last_sync']) ? $settings['last_sync'] : 'Never';

// Handle manual sync
if (isset($_POST['manual_sync']) && check_admin_referer('tsvweb_manual_sync', 'tsvweb_sync_nonce')) {
    $tsvweb_plugin = new TsvWeb_Plugin();
    $result = $tsvweb_plugin->send_stats();
    if ($result) {
        echo '<div class="notice notice-success"><p>Stats sent successfully!</p></div>';
    } else {
        echo '<div class="notice notice-error"><p>Failed to send stats. Please check your API key.</p></div>';
    }
}
?>

<div class="wrap">
    <h1>TsvWeb Settings</h1>
    
    <?php if (isset($_GET['settings-updated'])): ?>
        <div class="notice notice-success is-dismissible">
            <p>Settings saved successfully!</p>
        </div>
    <?php endif; ?>
    
    <form method="post" action="options.php">
        <?php settings_fields('tsvweb_group'); ?>
        
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="api_key">TsvWeb API Key</label>
                </th>
                <td>
                    <input type="text" 
                           id="api_key" 
                           name="tsvweb_settings[api_key]" 
                           value="<?php echo esc_attr($api_key); ?>" 
                           class="regular-text"
                           placeholder="Enter your TsvWeb API key">
                    <p class="description">Get your API key from your TsvWeb dashboard</p>
                </td>
            </tr>
            <tr>
                <th scope="row">Last Sync</th>
                <td><?php echo esc_html($last_sync); ?></td>
            </tr>
            <tr>
                <th scope="row">Website URL</th>
                <td><?php echo esc_url(get_site_url()); ?></td>
            </tr>
            <tr>
                <th scope="row">Plugin Version</th>
                <td><?php echo esc_html(TSVWEB_VERSION); ?></td>
            </tr>
        </table>
        
        <?php submit_button(); ?>
    </form>
    
    <hr>
    
    <h2>Manual Sync</h2>
    <p>Click the button below to manually send stats to TsvWeb dashboard.</p>
    <form method="post" action="">
        <?php wp_nonce_field('tsvweb_manual_sync', 'tsvweb_sync_nonce'); ?>
        <button type="submit" name="manual_sync" class="button button-secondary">
            Send Stats Now
        </button>
    </form>
</div>
