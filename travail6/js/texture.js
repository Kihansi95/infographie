// need to be loaded before jedi-fighter

var ntextures_tobeloaded=0;
var ntextures_loaded=0;

// store texture
var textures = [];

// enum texture aka. code texture
var TEXTURE = {

    // spacecraft
    FRONTWING: 0,
    R2D2HEAD: 1,
    R2D2BODY: 2,
    MIDDLEWING: 3,
    CONTROLCENTER: 4,
    BACKWING: 5,
    ENGINE: 6,
    ENGINEBOTTOM: 7,
    CONTROLCOVER: 8,

    // solar system
    EARTH: 9,
    MOON: 10,
    SATURN: 11,
    SATURN_RING: 12
};

var TEXTURE_SRC = {

    // spacecraft
    FRONTWING: "img/spacecraft/front-wing.jpg",
    R2D2HEAD: "img/spacecraft/r2d2-head.jpg",
    R2D2BODY: "img/spacecraft/r2d2-body.jpg",
    MIDDLEWING: "img/spacecraft/middle-wing.jpg",
    CONTROLCENTER: "img/spacecraft/control-center.jpg",
    BACKWING: "img/spacecraft/back-wing.jpg",
    ENGINE: "img/spacecraft/engine.png",
    ENGINEBOTTOM: "img/spacecraft/push-engine.jpg",
    CONTROLCOVER: "img/spacecraft/control-cover.jpg",

    // solar system
    EARTH: "img/solarsystem/earth.jpg",
    MOON: "img/solarsystem/moon.jpg",
    SATURN: "img/solarsystem/saturn.jpg",
    SATURN_RING: "img/solarsystem/saturn_ring.jpg"
};

// only used in main js
function initTexture() {

    // iterate all the texture list to load image
    Object.keys(TEXTURE).forEach(function(component) {
        textures[TEXTURE[component]] = gl.createTexture();

        textures[TEXTURE[component]].image = new Image();
        textures[TEXTURE[component]].image.onload = function () {
            handleLoadedTexture(textures[TEXTURE[component]], component)
        }

        textures[TEXTURE[component]].image.src = TEXTURE_SRC[component];
        ntextures_tobeloaded++;
    })
}

// private
function handleLoadedTexture(texture, component) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    ntextures_loaded++;

    render();  // Call render function when the image has been loaded (to insure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Set the texture for any object. If an element doesn't have texture, call this function without variable.
 * All the texture defined in the TEXTURE array.
 * This service function is only used in object's definition, not in main js file
 * Example:
 *      setTexture(TEXTURE.FRONTWING);
 *      // draw front wing shape
 *      ...
 *      setTexture();
 *      // draw interior engine
 * @param code : use with the ENUM in TEXTURE const.
 */
function setTexture(code) {

    // disable TexCoordLoc when absent texture.
    // toggle boolean hasTexture so that fragment shader can generate object
    if(typeof code === 'undefined' || code === null) {
        gl.uniform1i(gl.getUniformLocation(prog, "hasTexture"), false);
        gl.disableVertexAttribArray(TexCoordLoc);
    } else {
        gl.activeTexture(gl['TEXTURE'+code]);
        gl.bindTexture(gl.TEXTURE_2D, textures[code]);
        gl.uniform1i(gl.getUniformLocation(prog, "texture"), code);         // send texture to sampler
        gl.uniform1i(gl.getUniformLocation(prog, "hasTexture"), true);
        gl.enableVertexAttribArray(TexCoordLoc);
    }


}
