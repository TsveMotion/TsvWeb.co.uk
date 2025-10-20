<?php
/**
 * Product Optimizer Class
 * Handles OpenAI API integration for product optimization with usage tracking
 */

if (!defined('ABSPATH')) {
    exit;
}

class TsvWeb_Product_Optimizer {

    private $api_endpoint = 'https://api.openai.com/v1/chat/completions';
    private $api_key;
    private $stats_option = 'tsvweb_optimizer_stats';

    public function __construct() {
        $this->api_key = getenv('OPENAI_API_KEY');
    }

    public function has_api_key() {
        return !empty($this->api_key);
    }
    
    /**
     * Check if optimizer is enabled for this site
     */
    public function is_enabled() {
        return get_option('tsvweb_optimizer_enabled', false) === 'yes';
    }
    
    /**
     * Get usage statistics
     */
    public function get_stats() {
        return get_option($this->stats_option, array(
            'total_optimizations' => 0,
            'total_tokens_used' => 0,
            'total_cost_usd' => 0,
            'last_optimization' => null,
            'optimizations_by_date' => array()
        ));
    }
    
    /**
     * Update usage statistics
     */
    private function update_stats($tokens_used, $cost_usd) {
        $stats = $this->get_stats();
        
        $stats['total_optimizations']++;
        $stats['total_tokens_used'] += $tokens_used;
        $stats['total_cost_usd'] += $cost_usd;
        $stats['last_optimization'] = current_time('mysql');
        
        // Track by date
        $today = current_time('Y-m-d');
        if (!isset($stats['optimizations_by_date'][$today])) {
            $stats['optimizations_by_date'][$today] = array(
                'count' => 0,
                'tokens' => 0,
                'cost' => 0
            );
        }
        $stats['optimizations_by_date'][$today]['count']++;
        $stats['optimizations_by_date'][$today]['tokens'] += $tokens_used;
        $stats['optimizations_by_date'][$today]['cost'] += $cost_usd;
        
        // Keep only last 90 days
        $cutoff_date = date('Y-m-d', strtotime('-90 days'));
        foreach ($stats['optimizations_by_date'] as $date => $data) {
            if ($date < $cutoff_date) {
                unset($stats['optimizations_by_date'][$date]);
            }
        }
        
        update_option($this->stats_option, $stats);
    }

    public function optimize_product($product_id) {
        // Check if enabled
        if (!$this->is_enabled()) {
            return array(
                'success' => false,
                'message' => __('Product optimizer is disabled by administrator', 'tsvweb')
            );
        }
        
        if (empty($product_id)) {
            return array(
                'success' => false,
                'message' => __('Invalid product ID', 'tsvweb')
            );
        }

        if (!$this->has_api_key()) {
            return array(
                'success' => false,
                'message' => __('OpenAI API key not configured', 'tsvweb')
            );
        }

        $product = wc_get_product($product_id);
        if (!$product) {
            return array(
                'success' => false,
                'message' => __('Product not found', 'tsvweb')
            );
        }

        $current_title = $product->get_name();
        $current_description = $product->get_description();
        $short_description = $product->get_short_description();
        
        $attributes = $product->get_attributes();
        $features = array();
        foreach ($attributes as $attribute) {
            if (is_a($attribute, 'WC_Product_Attribute')) {
                $features[] = wc_attribute_label($attribute->get_name()) . ': ' . implode(', ', $attribute->get_options());
            }
        }

        $prompt = $this->build_optimization_prompt($current_title, $current_description, $short_description, $features);

        $optimized_content = $this->call_openai_api($prompt);

        if (is_wp_error($optimized_content)) {
            return array(
                'success' => false,
                'message' => $optimized_content->get_error_message()
            );
        }

        $update_result = $this->update_product($product_id, $optimized_content['content']);

        if ($update_result) {
            // Update usage stats
            $this->update_stats($optimized_content['tokens_used'], $optimized_content['cost_usd']);
            
            return array(
                'success' => true,
                'message' => __('Product optimized successfully', 'tsvweb'),
                'data' => $optimized_content['content'],
                'tokens_used' => $optimized_content['tokens_used'],
                'cost_usd' => $optimized_content['cost_usd']
            );
        } else {
            return array(
                'success' => false,
                'message' => __('Failed to update product', 'tsvweb')
            );
        }
    }

    private function build_optimization_prompt($title, $description, $short_description, $features) {
        $features_text = !empty($features) ? implode("\n", $features) : 'No specific features listed';
        
        $prompt = "You are an expert e-commerce copywriter. Optimize the following WooCommerce product for better SEO and conversion rates.\n\n";
        $prompt .= "Current Title: {$title}\n\n";
        $prompt .= "Current Description: {$description}\n\n";
        $prompt .= "Short Description: {$short_description}\n\n";
        $prompt .= "Key Features:\n{$features_text}\n\n";
        $prompt .= "Please provide:\n";
        $prompt .= "1. An optimized, SEO-friendly product title (max 70 characters)\n";
        $prompt .= "2. An engaging, detailed product description (200-400 words) that highlights benefits and features\n\n";
        $prompt .= "Return ONLY a valid JSON object with this exact structure:\n";
        $prompt .= '{"title": "optimized title here", "description": "optimized description here"}';
        
        return $prompt;
    }

    private function call_openai_api($prompt) {
        $body = array(
            'model' => 'gpt-4',
            'messages' => array(
                array(
                    'role' => 'system',
                    'content' => 'You are an expert e-commerce copywriter specializing in product optimization. Always respond with valid JSON only.'
                ),
                array(
                    'role' => 'user',
                    'content' => $prompt
                )
            ),
            'temperature' => 0.7,
            'max_tokens' => 1000
        );

        $headers = array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->api_key
        );

        $response = wp_remote_post($this->api_endpoint, array(
            'headers' => $headers,
            'body' => json_encode($body),
            'timeout' => 60,
            'sslverify' => true
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code !== 200) {
            $error_body = wp_remote_retrieve_body($response);
            $error_data = json_decode($error_body, true);
            $error_message = isset($error_data['error']['message']) ? $error_data['error']['message'] : 'Unknown API error';
            return new WP_Error('api_error', sprintf(__('OpenAI API error: %s', 'tsvweb'), $error_message));
        }

        $response_body = wp_remote_retrieve_body($response);
        $data = json_decode($response_body, true);

        if (!isset($data['choices'][0]['message']['content'])) {
            return new WP_Error('invalid_response', __('Invalid API response format', 'tsvweb'));
        }

        $content = $data['choices'][0]['message']['content'];
        
        // Clean up the response
        $content = preg_replace('/```json\s*/', '', $content);
        $content = preg_replace('/```\s*$/', '', $content);
        $content = trim($content);
        
        $optimized_data = json_decode($content, true);

        if (!$optimized_data || !isset($optimized_data['title']) || !isset($optimized_data['description'])) {
            return new WP_Error('invalid_content', __('Failed to parse optimized content', 'tsvweb'));
        }
        
        // Calculate token usage and cost
        $tokens_used = isset($data['usage']['total_tokens']) ? $data['usage']['total_tokens'] : 0;
        // GPT-4 pricing: $0.03 per 1K prompt tokens, $0.06 per 1K completion tokens
        // Simplified: average $0.045 per 1K tokens
        $cost_usd = ($tokens_used / 1000) * 0.045;

        return array(
            'content' => $optimized_data,
            'tokens_used' => $tokens_used,
            'cost_usd' => $cost_usd
        );
    }

    private function update_product($product_id, $optimized_content) {
        $title = sanitize_text_field($optimized_content['title']);
        $description = wp_kses_post($optimized_content['description']);

        $update_data = array(
            'ID' => $product_id,
            'post_title' => $title,
            'post_content' => $description
        );

        $result = wp_update_post($update_data, true);

        if (is_wp_error($result)) {
            return false;
        }

        update_post_meta($product_id, '_tsvweb_po_last_optimized', current_time('mysql'));
        update_post_meta($product_id, '_tsvweb_po_optimized', 'yes');

        wc_delete_product_transients($product_id);

        return true;
    }

    public function optimize_products($product_ids) {
        $results = array();

        foreach ($product_ids as $product_id) {
            $results[$product_id] = $this->optimize_product($product_id);
            
            // Add delay to avoid rate limiting
            usleep(500000); // 0.5 seconds
        }

        return $results;
    }
}
