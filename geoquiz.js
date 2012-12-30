// GeoGame 
var GeoGame = (function(){
    var MARKER_WIDTH = 5;
    var MARK_DURATION = 1000;

    var PLAYER_COLOR = '#990000'
    var CORRECT_COLOR = '#000099'
    var PROJ = d3.geo.albers()

    var player_score = 0

    var pub = {}

    var GameMapSVG = function(svg, proj, shapes, click_hndlr) {
        svg.selectAll("path")
           .data(shapes.features)
           .enter().append("path")
           .attr("d", d3.geo.path().projection(proj));

        svg.on("click", function(d, i) {
            var xycoords = d3.mouse(this);
            gpscoords = proj.invert(xycoords);

            click_hndlr(gpscoords, xycoords);
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

    // convert a distance in miles to a score
    var score = function(dist) {
        return ((1 / (dist)) * 5).toFixed(0)
    }

    pub.game_loop = function(svg, namebox, scorebox, cities, shapes) { 
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
        click_hndlr = function(gpscoords, xycoords) { 
            correct_coords = city.geometry.coordinates;
            correct_xy = PROJ(correct_coords);


            d = d3.geo.greatArc().distance({source: correct_coords,
                                            target: gpscoords});

            player_score = Number(player_score) + Number(score(d))
            scorebox.text(player_score)

            mark_click(svg, xycoords[0], xycoords[1], PLAYER_COLOR);
            mark_click(svg, correct_xy[0], correct_xy[1], CORRECT_COLOR);

            var mid_pt = [d3.interpolate(xycoords[0], correct_xy[0])(0.5),
                          d3.interpolate(xycoords[1], correct_xy[1])(0.5)]
                        

            svg.append("text")
               .attr("x", mid_pt[0])
               .attr("y", mid_pt[1])
               .text((d * 3958.76).toFixed(0) + " miles")
               .style("font-weight", "bold")
               .transition()
               .duration(MARK_DURATION)
               .style("opacity", 0)


            pub.game_loop(svg, namebox, scorebox, cities, shapes);
        };

        svg = GameMapSVG(svg, PROJ, shapes, click_hndlr);
    };

    return pub;
}());
