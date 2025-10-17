<?php
/**
 * Plugin Name: TsvWeb Monitor
 * Plugin URI: https://tsvweb.com
 * Description: Sends basic website statistics to TsvWeb dashboard for monitoring
 * Version: 1.0.7
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
    }
    
    // Add 30 second cron schedule
    public function add_thirty_second_cron_schedule($schedules) {
        $schedules['thirty_seconds'] = array(
            'interval' => 30,
            'display'  => __('Every 30 Seconds')
        );
        return $schedules;
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
        
        $stats = array(
            'site_url' => get_site_url(),
            'site_name' => get_bloginfo('name'),
            'wordpress_version' => get_bloginfo('version'),
            'php_version' => PHP_VERSION,
            'mysql_version' => $wpdb->db_version(),
            'total_posts' => $posts_count->publish,
            'total_pages' => $pages_count->publish,
            'total_users' => $users_count['total_users'],
            'active_plugins' => count($active_plugins),
            'active_theme' => $theme->get('Name'),
            'theme_version' => $theme->get('Version'),
            'site_health' => $site_health,
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
        
        if (empty($api_key)) {
            error_log('TsvWeb Monitor: API key not set');
            return false;
        }
        
        $stats = $this->collect_stats();
        
        // Send to API
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
            error_log('TsvWeb Monitor Error: ' . $response->get_error_message());
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        
        if ($response_code === 200) {
            // Update last sync time
            $settings['last_sync'] = current_time('mysql');
            update_option($this->option_name, $settings);
            return true;
        } else {
            error_log('TsvWeb Monitor: API returned status ' . $response_code);
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
