<?php
/**
 * SEO Optimizer Class
 * Handles SEO-specific optimizations for products
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class TsvWeb_SEO_Optimizer {

    /**
     * OpenAI API endpoint
     */
    private $api_endpoint = 'https://api.openai.com/v1/chat/completions';

    /**
     * OpenAI API key
     */
    private $api_key;

    /**
     * Constructor
     */
    public function __construct() {
        $this->api_key = getenv('OPENAI_API_KEY');
        
        // Add hooks for automatic SEO optimization
        add_action('save_post_product', array($this, 'auto_optimize_on_save'), 20, 1);
    }

    /**
     * Auto-optimize product SEO when saved (if enabled)
     */
    public function auto_optimize_on_save($product_id) {
        // Check if optimizer is enabled
        if (!get_option('tsvweb_po_enabled', false)) {
            return;
        }

        // Check if auto-SEO is enabled
        if (!get_option('tsvweb_po_auto_seo', false)) {
            return;
        }

        // Don't run on autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Schedule SEO optimization in background
        wp_schedule_single_event(time() + 10, 'tsvweb_po_optimize_seo', array($product_id));
    }

    /**
     * Optimize product for SEO
     * 
     * @param int $product_id Product ID
     * @return array Result with success status
     */
    public function optimize_product_seo($product_id) {
        if (empty($this->api_key)) {
            return array('success' => false, 'error' => 'API key not configured');
        }

        $product = wc_get_product($product_id);
        if (!$product) {
            return array('success' => false, 'error' => 'Product not found');
        }

        $results = array(
            'meta_title' => $this->generate_seo_title($product),
            'meta_description' => $this->generate_meta_description($product),
            'focus_keyword' => $this->extract_focus_keyword($product),
            'alt_texts' => $this->generate_image_alt_texts($product),
            'schema_markup' => $this->generate_schema_markup($product),
        );

        // Save SEO data
        $this->save_seo_data($product_id, $results);

        return array('success' => true, 'results' => $results);
    }

    /**
     * Generate SEO-optimized title
     */
    private function generate_seo_title($product) {
        $prompt = sprintf(
            "Generate an SEO-optimized meta title (max 60 characters) for this product:\n\nTitle: %s\nDescription: %s\n\nThe title should be compelling, include relevant keywords, and encourage clicks.",
            $product->get_name(),
            wp_strip_all_tags($product->get_description())
        );

        $response = $this->call_openai_api($prompt, 100);
        
        if ($response['success']) {
            $title = trim($response['content']);
            // Ensure it's not too long
            if (strlen($title) > 60) {
                $title = substr($title, 0, 57) . '...';
            }
            return $title;
        }

        return $product->get_name();
    }

    /**
     * Generate meta description
     */
    private function generate_meta_description($product) {
        $prompt = sprintf(
            "Generate an SEO-optimized meta description (max 160 characters) for this product:\n\nTitle: %s\nDescription: %s\nPrice: %s\n\nThe description should be compelling, include a call-to-action, and relevant keywords.",
            $product->get_name(),
            wp_strip_all_tags($product->get_short_description() ?: $product->get_description()),
            $product->get_price_html()
        );

        $response = $this->call_openai_api($prompt, 200);
        
        if ($response['success']) {
            $description = trim($response['content']);
            // Ensure it's not too long
            if (strlen($description) > 160) {
                $description = substr($description, 0, 157) . '...';
            }
            return $description;
        }

        return wp_strip_all_tags($product->get_short_description());
    }

    /**
     * Extract focus keyword
     */
    private function extract_focus_keyword($product) {
        $prompt = sprintf(
            "Extract the most important SEO focus keyword or keyphrase (2-4 words) for this product:\n\nTitle: %s\nDescription: %s\n\nReturn only the keyword/phrase, nothing else.",
            $product->get_name(),
            wp_strip_all_tags($product->get_description())
        );

        $response = $this->call_openai_api($prompt, 50);
        
        if ($response['success']) {
            return trim(strtolower($response['content']));
        }

        return '';
    }

    /**
     * Generate image alt texts
     */
    private function generate_image_alt_texts($product) {
        $image_id = $product->get_image_id();
        if (!$image_id) {
            return array();
        }

        $alt_texts = array();
        
        // Main image
        $prompt = sprintf(
            "Generate a descriptive, SEO-friendly alt text for the main product image of:\n\nProduct: %s\nDescription: %s\n\nThe alt text should describe what's in the image and include relevant keywords. Max 125 characters.",
            $product->get_name(),
            wp_strip_all_tags($product->get_short_description())
        );

        $response = $this->call_openai_api($prompt, 100);
        
        if ($response['success']) {
            $alt_text = trim($response['content']);
            if (strlen($alt_text) > 125) {
                $alt_text = substr($alt_text, 0, 122) . '...';
            }
            
            // Update image alt text
            update_post_meta($image_id, '_wp_attachment_image_alt', $alt_text);
            $alt_texts['main'] = $alt_text;
        }

        // Gallery images
        $gallery_ids = $product->get_gallery_image_ids();
        foreach ($gallery_ids as $index => $gallery_id) {
            $prompt = sprintf(
                "Generate a descriptive, SEO-friendly alt text for gallery image #%d of:\n\nProduct: %s\n\nMax 125 characters.",
                $index + 1,
                $product->get_name()
            );

            $response = $this->call_openai_api($prompt, 100);
            
            if ($response['success']) {
                $alt_text = trim($response['content']);
                if (strlen($alt_text) > 125) {
                    $alt_text = substr($alt_text, 0, 122) . '...';
                }
                
                update_post_meta($gallery_id, '_wp_attachment_image_alt', $alt_text);
                $alt_texts['gallery_' . $index] = $alt_text;
            }
        }

        return $alt_texts;
    }

    /**
     * Generate Schema.org markup
     */
    private function generate_schema_markup($product) {
        $schema = array(
            '@context' => 'https://schema.org/',
            '@type' => 'Product',
            'name' => $product->get_name(),
            'description' => wp_strip_all_tags($product->get_description()),
            'sku' => $product->get_sku(),
            'image' => wp_get_attachment_url($product->get_image_id()),
            'offers' => array(
                '@type' => 'Offer',
                'url' => get_permalink($product->get_id()),
                'priceCurrency' => get_woocommerce_currency(),
                'price' => $product->get_price(),
                'availability' => $product->is_in_stock() ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            ),
        );

        // Add brand if available
        $brand = $product->get_attribute('brand');
        if ($brand) {
            $schema['brand'] = array(
                '@type' => 'Brand',
                'name' => $brand,
            );
        }

        // Add ratings if available
        $average_rating = $product->get_average_rating();
        $review_count = $product->get_review_count();
        
        if ($average_rating > 0 && $review_count > 0) {
            $schema['aggregateRating'] = array(
                '@type' => 'AggregateRating',
                'ratingValue' => $average_rating,
                'reviewCount' => $review_count,
            );
        }

        return $schema;
    }

    /**
     * Save SEO data to product meta
     */
    private function save_seo_data($product_id, $data) {
        // Save to Rank Math SEO if installed
        if (class_exists('RankMath')) {
            update_post_meta($product_id, 'rank_math_title', $data['meta_title']);
            update_post_meta($product_id, 'rank_math_description', $data['meta_description']);
            update_post_meta($product_id, 'rank_math_focus_keyword', $data['focus_keyword']);
            update_post_meta($product_id, 'rank_math_schema_Product', wp_json_encode($data['schema_markup']));
        }

        // Save to Yoast SEO if installed
        if (defined('WPSEO_VERSION')) {
            update_post_meta($product_id, '_yoast_wpseo_title', $data['meta_title']);
            update_post_meta($product_id, '_yoast_wpseo_metadesc', $data['meta_description']);
            update_post_meta($product_id, '_yoast_wpseo_focuskw', $data['focus_keyword']);
        }

        // Save to our own meta as backup
        update_post_meta($product_id, '_tsvweb_seo_title', $data['meta_title']);
        update_post_meta($product_id, '_tsvweb_seo_description', $data['meta_description']);
        update_post_meta($product_id, '_tsvweb_seo_keyword', $data['focus_keyword']);
        update_post_meta($product_id, '_tsvweb_schema_markup', wp_json_encode($data['schema_markup']));
        update_post_meta($product_id, '_tsvweb_seo_optimized_date', current_time('mysql'));
    }

    /**
     * Call OpenAI API
     */
    private function call_openai_api($prompt, $max_tokens = 500) {
        $response = wp_remote_post($this->api_endpoint, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json',
            ),
            'body' => wp_json_encode(array(
                'model' => 'gpt-4o-mini',
                'messages' => array(
                    array(
                        'role' => 'system',
                        'content' => 'You are an expert SEO copywriter. Provide concise, optimized content that follows SEO best practices.',
                    ),
                    array(
                        'role' => 'user',
                        'content' => $prompt,
                    ),
                ),
                'max_tokens' => $max_tokens,
                'temperature' => 0.7,
            )),
            'timeout' => 30,
        ));

        if (is_wp_error($response)) {
            return array('success' => false, 'error' => $response->get_error_message());
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (isset($data['choices'][0]['message']['content'])) {
            return array(
                'success' => true,
                'content' => $data['choices'][0]['message']['content'],
                'tokens' => $data['usage']['total_tokens'] ?? 0,
            );
        }

        return array('success' => false, 'error' => 'Invalid API response');
    }
}

// Register cron hook for background SEO optimization
add_action('tsvweb_po_optimize_seo', function($product_id) {
    $optimizer = new TsvWeb_SEO_Optimizer();
    $optimizer->optimize_product_seo($product_id);
});
