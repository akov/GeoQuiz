// GeoGame 
var GeoGame = (function(){
    var MARKER_WIDTH = 5;
    var MARK_DURATION = 1000;

    var PLAYER_COLOR = '#990000'
    var CORRECT_COLOR = '#000099'
    var PROJ = d3.geo.albers()

    var pub = {}

    var GameMapSVG = function(svg, proj, shapes, click_hndlr) {
        svg.selectAll("path")
           .data(shapes.features)
           .enter().append("path")
           .attr("d", d3.geo.path().projection(proj));

        svg.on("click", function(d, i) {
            xycoords = d3.mouse(this);
            gpscoords = proj.invert(xycoords);

            click_hndlr(gpscoords);
        });

        return svg;
    };

    var mark_click = function(svg, x, y, color) {
        svg.append("circle")
           .attr("cx", x)
           .attr("cy", y)
           .attr("r", MARKER_WIDTH)
           .style("fill", color)
           .transition()
           .duration(MARK_DURATION)
           .style("opacity", 0)
    };

    pub.game_loop = function(svg, namebox, cities, shapes) { 
        if (cities.length == 0) {
            namebox.text("Done!");
            svg = GameMapSVG(svg, PROJ, shapes, function(x){})
            return;
        }

        city = cities.pop();
        namebox.text(city.properties.name);

        // for now we alert how many miles to the correct city 
        
        // fun lesson here: don't call this "onclick" its a reserved word
        // and was causing the handler to be called twice!
        click_hndlr = function(gpscoords) { 
            correct_coords = city.geometry.coordinates;
            correct_xy = PROJ(correct_coords);


            d = d3.geo.greatArc().distance({source: correct_coords,
                                            target: gpscoords});

            d3.select("#dist").text(d * 3958.76)

            mark_click(svg, xycoords[0], xycoords[1], PLAYER_COLOR);
            mark_click(svg, correct_xy[0], correct_xy[1], CORRECT_COLOR);


            pub.game_loop(svg, namebox, cities, shapes);
        };

        svg = GameMapSVG(svg, PROJ, shapes, click_hndlr);
    };

    return pub;
}());
