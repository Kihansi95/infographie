
var solar_component = {
    earth: function() {

        // object form
        normalMatrix = extractNormalMatrix(modelview);
        modelview = mult(modelview, scale4(5, 5, 5));

        // skin
        setTexture(TEXTURE.FRONTWING);

        squareTetra.render();

        // remise
        cleanColor();
        modelview = mult(modelview, scale4(1/5, 1/5, 1/5));
    }
};

var solarsystem = right_child_left_sibling();

solarsystem.definition = {
    earth: 0
};

solarsystem.initNode = function(id) {
    switch() {

    }
};