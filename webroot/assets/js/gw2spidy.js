var gw2spidy = (function() {
    var loaded = false;

    $(window).load(function() {
        loaded = true;

        $("#tablist #browse-tab li > a").on('click', function(e) {
            var $this = $(this);
            $.clearMenus();

            $("#browse-tab > a").tab('show');
            $("#tablist-content > .tab-pane").hide();
            $("#browse-pane").show();

            replacePage(this.href, "content", "browse-pane");
            // history.pushState(null, null, this.href);

            e.preventDefault();
        });
    });

    var bindItemList = function($list) {
        $list.on('click.item', function(e) {
            var $this    = $(e.target),
                $tr      = $this.closest('tr'),
                itemId   = $tr.data('item-id'),
                itemName = $tr.data('item-name');

            if (!itemId || !itemName) {
                return;
            }

            var tabshow = function() {
                $tab.tab('show');
                $("#tablist-content > .tab-pane").hide();
                $pane.show();
            };

            var $tab = $('<a data-target="#" />')
                        .attr('href', $this.attr('href'))
                        .html(itemName)
                        .on('click', function(e) {
                            tabshow();

                            e.preventDefault();
                        })
                        .appendTo($('<li />').appendTo($('#tablist')));

            var paneId = 'item-' + itemId + '-pane',
                $pane  = $('<div class="tab-pane" />')
                            .attr('id', paneId)
                            .appendTo($("#tablist-content"));

            replacePage($this.attr('href'), "content", paneId, function() {
                tabshow();

                fetchchart("/chart/" + itemId);
                bindZoomModeButtons("/chart/" + itemId);
            });


            e.preventDefault();
        });
    };

    var bindPager = function($pager) {
        $('a', $pager).on('click', function(e) {
            replacePage(this.href, "content", "browse-pane");
            // history.pushState(null, null, this.href);

            e.preventDefault();
        });
    };

    var doReplace = function($src, $dest) {
        if (!$src || !$dest) {
            return;
        }

        $dest.html($src.html());

        if ($('.pagination', $dest)) {
            bindPager($('.pagination', $dest));
        }

        if ($('.item-list-table', $dest)) {
            bindItemList($('.item-list-table', $dest));
        }
    };

    var replacePage = function(url, src, dest, callback) {
        $.ajax({
            url:      url,
            type:     'get',
            dataType: 'html',
            success: function(data) {
                var $data = $(data);

                $data.each(function(k, el) {
                    if (src && $(el).attr('id') != src) {
                        return;
                    }

                    var $dest = $("#" + (dest ? dest : $(el).attr('id')));

                    doReplace($(el), $dest);
                });

                if (typeof callback == 'function') {
                    callback();
                }
            }
        });
    };

    return {
        bindItemList : bindItemList,
        bindPager    : bindPager
    };
})();
