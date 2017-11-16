// need to be loaded before jedi-fighter

var ntextures_tobeloaded=0;
var ntextures_loaded=0;

var textures = [];
var TEXTURE = {
    FRONTWING: 0
};

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    ntextures_loaded++;

    render();  // Call render function when the image has been loaded (to insure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture() {
    // spacecraft texture
    texture[TEXTURE.FRONTWING] = gl.createTexture();

    siggraphTexture.image = new Image();
    siggraphTexture.image.onload = function () {
        handleLoadedTexture(texture[TEXTURE.FRONTWING])
    }

    texture[TEXTURE.FRONTWING].image.src = "img/spacecraft.jpg";
    ntextures_tobeloaded++;

}
