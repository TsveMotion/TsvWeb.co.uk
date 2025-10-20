<?php
/**
 * TsvWeb Control Page
 */

if (!defined('ABSPATH')) {
    exit;
}

$tsvweb_plugin = new TsvWeb_Plugin();
$verification = $tsvweb_plugin->verify_client();
$payment = $tsvweb_plugin->get_payment_status();
$settings = get_option('tsvweb_settings', array());
$last_sync = isset($settings['last_sync']) ? $settings['last_sync'] : 'Never';
?>

<div class="wrap tsvweb-control">
    <h1>
        <span class="dashicons dashicons-admin-site" style="color: #007cba;"></span>
        TsvWeb Control Panel
    </h1>
    
    <style>
        .tsvweb-control .card { max-width: 100%; margin-bottom: 20px; }
        .tsvweb-control .status-badge { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 3px; 
            font-size: 12px; 
            font-weight: 600;
        }
        .status-verified { background: #d4edda; color: #155724; }
        .status-unverified { background: #f8d7da; color: #721c24; }
        .status-paid { background: #d1ecf1; color: #0c5460; }
        .status-overdue { background: #fff3cd; color: #856404; }
        .tsvweb-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .stat-box { background: #f0f0f1; padding: 15px; border-radius: 4px; }
        .stat-box h3 { margin-top: 0; font-size: 14px; color: #646970; }
        .stat-box .stat-value { font-size: 32px; font-weight: 600; color: #1d2327; }
    </style>
    
    <!-- Verification Status -->
    <div class="card">
        <h2>Website Status</h2>
        <table class="form-table">
            <tr>
                <th>Verification Status:</th>
                <td>
                    <?php if ($verification['verified']): ?>
                        <span class="status-badge status-verified">✓ Verified TsvWeb Client</span>
                        <?php if (!empty($verification['client_name'])): ?>
                            <p>Client: <strong><?php echo esc_html($verification['client_name']); ?></strong></p>
                        <?php endif; ?>
                    <?php else: ?>
                        <span class="status-badge status-unverified">✗ Not Verified</span>
                        <p><?php echo esc_html($verification['message']); ?></p>
                    <?php endif; ?>
                </td>
            </tr>
            <tr>
                <th>Service Plan:</th>
                <td><?php echo esc_html($verification['plan'] ?? 'Standard'); ?></td>
            </tr>
            <tr>
                <th>Last Sync:</th>
                <td><?php echo esc_html($last_sync); ?></td>
            </tr>
            <tr>
                <th>WordPress Version:</th>
                <td><?php echo esc_html(get_bloginfo('version')); ?></td>
            </tr>
            <tr>
                <th>PHP Version:</th>
                <td><?php echo esc_html(PHP_VERSION); ?></td>
            </tr>
        </table>
    </div>
    
    <!-- Payment Status -->
    <div class="card">
        <h2>Payment Status</h2>
        <table class="form-table">
            <tr>
                <th>Status:</th>
                <td>
                    <?php if ($payment['status'] === 'paid'): ?>
                        <span class="status-badge status-paid">✓ Paid</span>
                    <?php elseif ($payment['status'] === 'overdue'): ?>
                        <span class="status-badge status-overdue">⚠ Payment Overdue</span>
                    <?php else: ?>
                        <span class="status-badge"><?php echo esc_html(ucfirst($payment['status'])); ?></span>
                    <?php endif; ?>
                </td>
            </tr>
            <?php if (!empty($payment['message'])): ?>
            <tr>
                <th>Details:</th>
                <td><?php echo esc_html($payment['message']); ?></td>
            </tr>
            <?php endif; ?>
            <?php if (!empty($payment['next_payment'])): ?>
            <tr>
                <th>Next Payment Due:</th>
                <td><?php echo esc_html($payment['next_payment']); ?></td>
            </tr>
            <?php endif; ?>
            <?php if (!empty($payment['amount'])): ?>
            <tr>
                <th>Amount:</th>
                <td>£<?php echo esc_html($payment['amount']); ?></td>
            </tr>
            <?php endif; ?>
        </table>
    </div>
    
    <!-- Website Overview Stats -->
    <div class="card">
        <h2>Website Overview</h2>
        <div class="tsvweb-grid">
            <?php
            $posts_count = wp_count_posts('post');
            $pages_count = wp_count_posts('page');
            $users_count = count_users();
            $comments_count = wp_count_comments();
            ?>
            <div class="stat-box">
                <h3>Total Posts</h3>
                <div class="stat-value"><?php echo number_format($posts_count->publish); ?></div>
            </div>
            <div class="stat-box">
                <h3>Total Pages</h3>
                <div class="stat-value"><?php echo number_format($pages_count->publish); ?></div>
            </div>
            <div class="stat-box">
                <h3>Total Users</h3>
                <div class="stat-value"><?php echo number_format($users_count['total_users']); ?></div>
            </div>
            <div class="stat-box">
                <h3>Comments</h3>
                <div class="stat-value"><?php echo number_format($comments_count->approved); ?></div>
            </div>
        </div>
    </div>
    
    <p style="text-align: center; color: #646970;">
        Powered by <a href="https://tsvweb.co.uk" target="_blank">TsvWeb</a> | 
        <a href="mailto:support@tsvweb.co.uk">support@tsvweb.co.uk</a>
    </p>
</div>
