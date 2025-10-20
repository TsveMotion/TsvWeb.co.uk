<?php
/**
 * TsvWeb Dashboard Widget
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

<style>
    .tsvweb-widget { font-size: 13px; }
    .tsvweb-widget .status-row { 
        display: flex; 
        justify-content: space-between; 
        padding: 8px 0; 
        border-bottom: 1px solid #f0f0f1; 
    }
    .tsvweb-widget .status-row:last-child { border-bottom: none; }
    .tsvweb-widget .status-label { font-weight: 600; color: #646970; }
    .tsvweb-widget .status-value { color: #1d2327; }
    .tsvweb-widget .status-good { color: #00a32a; }
    .tsvweb-widget .status-warning { color: #dba617; }
    .tsvweb-widget .status-error { color: #d63638; }
    .tsvweb-widget .widget-button { 
        display: inline-block; 
        margin-top: 10px; 
        padding: 6px 12px; 
        background: #007cba; 
        color: white; 
        text-decoration: none; 
        border-radius: 3px; 
        font-size: 12px;
    }
    .tsvweb-widget .widget-button:hover { background: #005a87; color: white; }
</style>

<div class="tsvweb-widget">
    <div class="status-row">
        <span class="status-label">Status:</span>
        <span class="status-value <?php echo $verification['verified'] ? 'status-good' : 'status-error'; ?>">
            <?php echo $verification['verified'] ? '✓ Verified' : '✗ Not Verified'; ?>
        </span>
    </div>
    
    <div class="status-row">
        <span class="status-label">Payment:</span>
        <span class="status-value <?php 
            echo $payment['status'] === 'paid' ? 'status-good' : 
                 ($payment['status'] === 'overdue' ? 'status-error' : 'status-warning'); 
        ?>">
            <?php echo esc_html(ucfirst($payment['status'])); ?>
        </span>
    </div>
    
    <?php if (!empty($payment['next_payment'])): ?>
    <div class="status-row">
        <span class="status-label">Next Payment:</span>
        <span class="status-value"><?php echo esc_html($payment['next_payment']); ?></span>
    </div>
    <?php endif; ?>
    
    <div class="status-row">
        <span class="status-label">Last Sync:</span>
        <span class="status-value"><?php 
            if ($last_sync === 'Never') {
                echo '<span class="status-warning">Never</span>';
            } else {
                $time_diff = human_time_diff(strtotime($last_sync), current_time('timestamp'));
                echo esc_html($time_diff . ' ago');
            }
        ?></span>
    </div>
    
    <div class="status-row">
        <span class="status-label">WordPress:</span>
        <span class="status-value"><?php echo esc_html(get_bloginfo('version')); ?></span>
    </div>
    
    <div class="status-row">
        <span class="status-label">PHP:</span>
        <span class="status-value"><?php echo esc_html(PHP_VERSION); ?></span>
    </div>
    
    <?php if ($payment['status'] === 'overdue'): ?>
    <div style="background: #fff3cd; padding: 10px; margin-top: 10px; border-left: 3px solid #dba617;">
        <strong>⚠ Payment Overdue</strong><br>
        Please contact TsvWeb to update your payment.
    </div>
    <?php endif; ?>
    
    <div style="margin-top: 15px; text-align: center;">
        <a href="<?php echo admin_url('admin.php?page=tsvweb-control'); ?>" class="widget-button">
            Open TsvWeb Control
        </a>
        <a href="mailto:support@tsvweb.co.uk" class="widget-button" style="background: #50575e;">
            Contact Support
        </a>
    </div>
    
    <p style="text-align: center; margin-top: 15px; color: #646970; font-size: 11px;">
        Managed by <a href="https://tsvweb.co.uk" target="_blank">TsvWeb</a>
    </p>
</div>
