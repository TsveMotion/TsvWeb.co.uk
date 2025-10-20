<?php
/**
 * Product Optimizer Class
 * Handles OpenAI API integration for product optimization
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class TsvWeb_Product_Optimizer {

    /**
     * OpenAI API endpoint
     */
    private $api_endpoint = 'https://api.openai.com/v1/chat/completions';

    /**
     * OpenAI API key from environment variable
     */
    private $api_key;

    /**
     * Constructor
     */
    public function __construct() {
        $this->api_key = getenv('OPENAI_API_KEY');
    }

    /**
     * Check if API key is available
     * 
     * @return bool
     */
    public function has_api_key() {
        return !empty($this->api_key);
    }

    /**
     * Optimize a single product
     * 
     * @param int $product_id Product ID to optimize
     * @return array Result array with success status and message
     */
    public function optimize_product($product_id) {
        // Validate product ID
        if (empty($product_id)) {
            return array(
                'success' => false,
                'message' => __('Invalid product ID', 'tsvweb-product-optimizer')
            );
        }

        // Check API key
        if (!$this->has_api_key()) {
            return array(
                'success' => false,
                'message' => __('OpenAI API key not configured', 'tsvweb-product-optimizer')
            );
        }

        // Get product
        $product = wc_get_product($product_id);
        if (!$product) {
            return array(
                'success' => false,
                'message' => __('Product not found', 'tsvweb-product-optimizer')
            );
        }

        // Get product data
        $current_title = $product->get_name();
        $current_description = $product->get_description();
        $short_description = $product->get_short_description();
        
        // Get product attributes/features
        $attributes = $product->get_attributes();
        $features = array();
        foreach ($attributes as $attribute) {
            if (is_a($attribute, 'WC_Product_Attribute')) {
                $features[] = wc_attribute_label($attribute->get_name()) . ': ' . implode(', ', $attribute->get_options());
            }
        }

        // Build prompt for OpenAI
        $prompt = $this->build_optimization_prompt($current_title, $current_description, $short_description, $features);

        // Call OpenAI API
        $optimized_content = $this->call_openai_api($prompt);

        if (is_wp_error($optimized_content)) {
            return array(
                'success' => false,
                'message' => $optimized_content->get_error_message()
            );
        }

        // Update product with optimized content
        $update_result = $this->update_product($product_id, $optimized_content);

        if ($update_result) {
            return array(
                'success' => true,
                'message' => __('Product optimized successfully', 'tsvweb-product-optimizer'),
                'data' => $optimized_content
            );
        } else {
            return array(
                'success' => false,
                'message' => __('Failed to update product', 'tsvweb-product-optimizer')
            );
        }
    }

    /**
     * Build optimization prompt for OpenAI
     * 
     * @param string $title Current product title
     * @param string $description Current product description
     * @param string $short_description Short description
     * @param array $features Product features
     * @return string Formatted prompt
     */
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

    /**
     * Call OpenAI API
     * 
     * @param string $prompt The prompt to send
     * @return array|WP_Error Optimized content or error
     */
    private function call_openai_api($prompt) {
        // Prepare request body
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

        // Prepare request headers
        $headers = array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->api_key
        );

        // Make API request
        $response = wp_remote_post($this->api_endpoint, array(
            'headers' => $headers,
            'body' => json_encode($body),
            'timeout' => 60,
            'sslverify' => true
        ));

        // Check for errors
        if (is_wp_error($response)) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code !== 200) {
            $error_body = wp_remote_retrieve_body($response);
            $error_data = json_decode($error_body, true);
            $error_message = isset($error_data['error']['message']) ? $error_data['error']['message'] : 'Unknown API error';
            return new WP_Error('api_error', sprintf(__('OpenAI API error: %s', 'tsvweb-product-optimizer'), $error_message));
        }

        // Parse response
        $response_body = wp_remote_retrieve_body($response);
        $data = json_decode($response_body, true);

        if (!isset($data['choices'][0]['message']['content'])) {
            return new WP_Error('invalid_response', __('Invalid API response format', 'tsvweb-product-optimizer'));
        }

        // Extract optimized content from JSON response
        $content = $data['choices'][0]['message']['content'];
        
        // Clean up the response (remove markdown code blocks if present)
        $content = preg_replace('/```json\s*/', '', $content);
        $content = preg_replace('/```\s*$/', '', $content);
        $content = trim($content);
        
        $optimized_data = json_decode($content, true);

        if (!$optimized_data || !isset($optimized_data['title']) || !isset($optimized_data['description'])) {
            return new WP_Error('invalid_content', __('Failed to parse optimized content', 'tsvweb-product-optimizer'));
        }

        return $optimized_data;
    }

    /**
     * Update product with optimized content
     * 
     * @param int $product_id Product ID
     * @param array $optimized_content Optimized title and description
     * @return bool Success status
     */
    private function update_product($product_id, $optimized_content) {
        // Sanitize content
        $title = sanitize_text_field($optimized_content['title']);
        $description = wp_kses_post($optimized_content['description']);

        // Update product post
        $update_data = array(
            'ID' => $product_id,
            'post_title' => $title,
            'post_content' => $description
        );

        $result = wp_update_post($update_data, true);

        if (is_wp_error($result)) {
            return false;
        }

        // Store optimization timestamp
        update_post_meta($product_id, '_tsvweb_po_last_optimized', current_time('mysql'));
        update_post_meta($product_id, '_tsvweb_po_optimized', 'yes');

        // Clear product cache
        wc_delete_product_transients($product_id);

        return true;
    }

    /**
     * Optimize multiple products
     * 
     * @param array $product_ids Array of product IDs
     * @return array Results for each product
     */
    public function optimize_products($product_ids) {
        $results = array();

        foreach ($product_ids as $product_id) {
            $results[$product_id] = $this->optimize_product($product_id);
            
            // Add small delay to avoid rate limiting
            usleep(500000); // 0.5 seconds
        }

        return $results;
    }
}
