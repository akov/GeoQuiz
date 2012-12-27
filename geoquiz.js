// GeoGame 

var GameMapSVG = function(svg, proj, shapes, onclick) {
    svg.selectAll("path")
       .data(shapes.features)
       .enter().append("path")
       .attr("d", d3.geo.path().projection(proj));

    svg.on("click", function(d, i) {
        xycoords = d3.mouse(this);
        gpscoords = proj.invert(xycoords);
        onclick(gpscoords);
    });

    return svg;
};
