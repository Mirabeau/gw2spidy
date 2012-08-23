var formatGW2Money = function(copper) {
    var string = "";

    var gold = Math.floor(copper / 10000);
    if (gold) {
        copper = copper % (gold * 10000);
        string += gold + "g ";
    }

    var silver = Math.floor(copper / 100);
    if (silver) {
        copper = copper % (silver * 100);
        if (silver) string += silver + "s ";
    }

    copper = Math.floor(copper);

    if (copper) string += copper + "c ";

    if (!string) {
        return copper + "c";
    } else {
        return string;
    }
};

var base_options = {
    grid: {
        hoverable: true,
    },
    tooltip:  true,
    tooltipOpts: {
        content:    "%s | %x | %y",
        stringFormat: {
            yFormat: formatGW2Money
        },
        dateFormat: "%Y-%m-%d %H:%S"
    },
    series: {
        lines:  { show: true },
        points: { show: true }
    },
    xaxis: {
        mode:            "time",
        timeformat:      "%d-%b",
        twelveHourClock: false,
        minTickSize:     [1, "day"]
    },
    yaxis: {
        minTickSize: 1,
        tickFormatter: formatGW2Money
    }
};

var initchart_navzoom = function(chartdata, callback) {
    var chartdata   = $.parseJSON(chartdata);
    var placeholder = $("#placeholder");
    var plot;
    var options     = $.extend(true, {}, base_options, {
        xaxis: {
            zoomRange:       null,
            panRange:        null
        },
        yaxis: {
            zoomRange:   false,
            panRange:    false
        },
        zoom: {
            interactive: true
        },
        pan: {
            interactive: true
        }
    });
    var xaxis_default = null;

    placeholder.bind('plotzoom', function() {
        plot.pan({left: 0, top: 0});
    });

    var render = function(extraoptions) {
        var extraoptions  = extraoptions || {};
        var renderoptions = {};
        var first = chartdata[0]['data'][0][0];

        renderoptions.xaxis = {};
        renderoptions.xaxis.panRange = [first, null];

        plot = $.plot(placeholder, chartdata, $.extend(true, {}, options, renderoptions, extraoptions));

        // add zoom out button
        $('<div class="btn" style="right:20px; bottom:23px; position:absolute;">zoom out</div>').appendTo(placeholder).click(function (e) {
            e.preventDefault();
            plot.zoomOut();
        });

    }

    render();

    if (typeof(callback) == 'function') {
        callback();
    }
};

var initchart_selectzoom = function(chartdata, callback) {
    var chartdata   = $.parseJSON(chartdata);
    var placeholder = $("#placeholder");
    var plot;
    var options     = $.extend(true, {}, base_options, {
        selection: { mode: "x" }
    });
    var xaxis_default = null;

    placeholder.unbind();
    placeholder.bind("plotselected", function (event, ranges) {
        if (xaxis_default === null) {
            xaxis_default = {
                from: plot.getAxes().xaxis.datamin,
                to:   plot.getAxes().xaxis.datamax
            };
        }

        render({ xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to } });
    });

    var render = function(extraoptions) {
        var extraoptions  = extraoptions || {};
        var renderoptions = {};

        plot = $.plot(placeholder, chartdata, $.extend(true, {}, options, renderoptions, extraoptions));

        // add zoom out button
        $('<div class="btn" style="right:20px; bottom:23px; position:absolute;">zoom out</div>').appendTo(placeholder).click(function (e) {
            e.preventDefault();

            plot.clearSelection();
            render({ xaxis: { min: xaxis_default.from, max: xaxis_default.to } });
        });

    }

    render();

    if (typeof(callback) == 'function') {
        callback();
    }
};

var bindZoomModeButtons = function(url) {
    $("#nav_zoom_mode button").click(function() {
        $("#nav_zoom_mode").hide();
        $("#select_zoom_mode").show();

        initchart = initchart_selectzoom;
        fetchchart(url, function() {
            alert('switched to select based zoom mode!');
        });
    });
    $("#select_zoom_mode button").click(function() {
        $("#nav_zoom_mode").show();
        $("#select_zoom_mode").hide();

        initchart = initchart_navzoom;
        fetchchart(url, function() {
            alert('switched to navigation based zoom mode!');
        });
    });
}

var initchart = initchart_selectzoom;
var fetchchart = function(url, callback) {
    $.ajax(url, {
        success: function(chartdata) {
            initchart(chartdata, callback);
        }
    });
}