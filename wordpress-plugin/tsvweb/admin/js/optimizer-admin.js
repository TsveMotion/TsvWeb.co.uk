/**
 * TsvWeb Product Optimizer - Admin JavaScript
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        initSelectAllCheckbox();
        initSelectButtons();
        initSingleOptimize();
        initBulkOptimize();
    });

    function initSelectAllCheckbox() {
        $('#tsvweb-po-select-all-checkbox').on('change', function() {
            $('.tsvweb-po-product-checkbox').prop('checked', $(this).prop('checked'));
        });

        $(document).on('change', '.tsvweb-po-product-checkbox', function() {
            var allChecked = $('.tsvweb-po-product-checkbox:checked').length === $('.tsvweb-po-product-checkbox').length;
            $('#tsvweb-po-select-all-checkbox').prop('checked', allChecked);
        });
    }

    function initSelectButtons() {
        $('#tsvweb-po-select-all').on('click', function() {
            $('.tsvweb-po-product-checkbox').prop('checked', true);
            $('#tsvweb-po-select-all-checkbox').prop('checked', true);
        });

        $('#tsvweb-po-deselect-all').on('click', function() {
            $('.tsvweb-po-product-checkbox').prop('checked', false);
            $('#tsvweb-po-select-all-checkbox').prop('checked', false);
        });
    }

    function initSingleOptimize() {
        $(document).on('click', '.tsvweb-po-optimize-single', function(e) {
            e.preventDefault();

            var $button = $(this);
            var productId = $button.data('product-id');
            var $row = $button.closest('tr');
            var $spinner = $row.find('.tsvweb-po-spinner');

            $button.prop('disabled', true).text(tsvwebPO.strings.optimizing);
            $spinner.show();

            $.ajax({
                url: tsvwebPO.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'tsvweb_po_optimize_single',
                    nonce: tsvwebPO.nonce,
                    product_id: productId
                },
                success: function(response) {
                    $spinner.hide();
                    $button.prop('disabled', false).text('Optimize with AI');

                    if (response.success) {
                        showMessage('success', response.data.message);
                        updateProductRow($row);
                        setTimeout(function() {
                            location.reload();
                        }, 1500);
                    } else {
                        showMessage('error', response.data.message);
                    }
                },
                error: function() {
                    $spinner.hide();
                    $button.prop('disabled', false).text('Optimize with AI');
                    showMessage('error', tsvwebPO.strings.error);
                }
            });
        });
    }

    function initBulkOptimize() {
        $('#tsvweb-po-bulk-optimize').on('click', function(e) {
            e.preventDefault();

            var $checkedBoxes = $('.tsvweb-po-product-checkbox:checked');
            
            if ($checkedBoxes.length === 0) {
                alert(tsvwebPO.strings.selectProducts);
                return;
            }

            if (!confirm(tsvwebPO.strings.confirmBulk)) {
                return;
            }

            var productIds = [];
            $checkedBoxes.each(function() {
                productIds.push($(this).val());
            });

            var $button = $(this);
            $button.prop('disabled', true).text(tsvwebPO.strings.optimizing);

            $.ajax({
                url: tsvwebPO.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'tsvweb_po_optimize_bulk',
                    nonce: tsvwebPO.nonce,
                    product_ids: productIds
                },
                success: function(response) {
                    $button.prop('disabled', false).text('Optimize Selected Products');

                    if (response.success) {
                        showMessage('success', response.data.message);
                        if (response.data.details && response.data.details.length > 0) {
                            showMessage('warning', response.data.details.join('<br>'));
                        }
                        setTimeout(function() {
                            location.reload();
                        }, 2000);
                    } else {
                        showMessage('error', response.data.message);
                    }
                },
                error: function() {
                    $button.prop('disabled', false).text('Optimize Selected Products');
                    showMessage('error', tsvwebPO.strings.error);
                }
            });
        });
    }

    function updateProductRow($row) {
        var $statusCell = $row.find('td:nth-child(4)');
        $statusCell.html('<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span> Optimized');
        
        var $lastOptimizedCell = $row.find('td:nth-child(5)');
        var now = new Date();
        $lastOptimizedCell.text(now.toLocaleString());
    }

    function showMessage(type, message) {
        var $messagesDiv = $('#tsvweb-po-messages');
        var noticeClass = 'notice-' + type;
        
        var $notice = $('<div class="notice ' + noticeClass + ' is-dismissible"><p>' + message + '</p></div>');
        $messagesDiv.html($notice);

        setTimeout(function() {
            $notice.fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }

})(jQuery);
