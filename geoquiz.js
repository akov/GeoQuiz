// GeoGame 
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

var game_loop = function(svg, namebox, cities, shapes) { 
    alert(cities)
    if (cities.length == 0) {
        alert("Its over!");
        namebox.text("Done!");
        return;
    }

    city = cities.features.pop();
    namebox.text(city.properties.name);

    // for now we alert how many miles to the correct city 
    
    // fun lesson here: don't call this "onclick" its a reserved word
    // and was causing the handler to be called twice!
    click_hndlr = function(gpscoords) { 
        d = d3.geo.greatArc().distance({source: city.geometry.coordinates, 
                                        target: gpscoords});
        alert(d * 3958.76)
        game_loop(svg, namebox, cities, shapes);
    };

    svg = GameMapSVG(svg, d3.geo.albers(), shapes, click_hndlr);
}
