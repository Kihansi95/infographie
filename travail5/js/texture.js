// need to be loaded before jedi-fighter

var ntextures_tobeloaded=0;
var ntextures_loaded=0;

// store texture
var textures = [];

// enum texture aka. code texture
var TEXTURE = {
    FRONTWING: 0,
    R2D2HEAD: 1,
    R2D2BODY: 2,
    MIDDLEWING: 3
};

var TEXTURE_SRC = {
    FRONTWING: "img/spacecraft.jpg",
    R2D2HEAD: "img/r2d2-head.jpg",
    R2D2BODY: "img/r2d2-body.jpg",
    MIDDLEWING: "img/middle-wing.png"
}

// iterate all the texture list
function initTexture() {
    Object.keys(TEXTURE).forEach(function(component) {
      textures[TEXTURE[component]] = gl.createTexture();

      textures[TEXTURE[component]].image = new Image();
      textures[TEXTURE[component]].image.onload = function () {
          handleLoadedTexture(textures[TEXTURE[component]])
      }

      textures[TEXTURE[component]].image.src = TEXTURE_SRC[component];
      ntextures_tobeloaded++;
    })
}

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

// service function that is used in spacecraft's definition
function setTexture(code) {
    // code using TEXTURE.FRONTWING

    gl.activeTexture(gl['TEXTURE'+code]);
    gl.bindTexture(gl.TEXTURE_2D, textures[code]);
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), code);
    gl.uniform1i(gl.getUniformLocation(prog, "hasTexture"), true);
    gl.enableVertexAttribArray(TexCoordLoc);
}

function cleanTexture() {
    gl.uniform1i(gl.getUniformLocation(prog, "hasTexture"), false);
    gl.disableVertexAttribArray(TexCoordLoc);
}
