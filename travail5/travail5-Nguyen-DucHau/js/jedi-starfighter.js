// This program was developped by Daniel Audet and uses sections of code
// from http://math.hws.edu/eck/cs424/notes2013/19_GLSL.html
//
//  It has been adapted to be compatible with the "MV.js" library developped
//  for the book "Interactive Computer Graphics" by Edward Angel and Dave Shreiner.
//

"use strict";

var gl;   // The webgl context.

var CoordsLoc;       // Location of the coords attribute variable in the standard texture mappping shader program.
var NormalLoc;
var TexCoordLoc;

var ProjectionLoc;     // Location of the uniform variables in the standard texture mappping shader program.
var ModelviewLoc;
var NormalMatrixLoc;


var projection;   //--- projection matrix
var modelview;    // modelview matrix
var flattenedmodelview;    //--- flattened modelview matrix

var normalMatrix = mat3();  //--- create a 3X3 matrix that will affect normals

var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.

var prog;  // shader program identifier

var lightPosition = vec4(20.0, 20.0, 100.0, 1.0);

var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.0, 0.1, 0.3, 1.0);
var materialDiffuse = vec4(0.48, 0.55, 0.69, 1.0);
var materialSpecular = vec4(0.48, 0.55, 0.69, 1.0);
var materialShininess = 100.0;

var ambientProduct, diffuseProduct, specularProduct;

function unflatten(matrix) {
    var result = mat4();
    result[0][0] = matrix[0]; result[1][0] = matrix[1]; result[2][0] = matrix[2]; result[3][0] = matrix[3];
    result[0][1] = matrix[4]; result[1][1] = matrix[5]; result[2][1] = matrix[6]; result[3][1] = matrix[7];
    result[0][2] = matrix[8]; result[1][2] = matrix[9]; result[2][2] = matrix[10]; result[3][2] = matrix[11];
    result[0][3] = matrix[12]; result[1][3] = matrix[13]; result[2][3] = matrix[14]; result[3][3] = matrix[15];

    return result;
}

// This function computes the transpose of the inverse of
// the upperleft part (3X3) of the modelview matrix (see http://www.lighthouse3d.com/tutorials/glsl-tutorial/the-normal-matrix/ )
function extractNormalMatrix(matrix) {

    var result = mat3();
    var upperleft = mat3();
    var tmp = mat3();

    upperleft[0][0] = matrix[0][0];  // if no scaling is performed, one can simply use the upper left
    upperleft[1][0] = matrix[1][0];  // part (3X3) of the modelview matrix
    upperleft[2][0] = matrix[2][0];

    upperleft[0][1] = matrix[0][1];
    upperleft[1][1] = matrix[1][1];
    upperleft[2][1] = matrix[2][1];

    upperleft[0][2] = matrix[0][2];
    upperleft[1][2] = matrix[1][2];
    upperleft[2][2] = matrix[2][2];

    tmp = matrixinvert(upperleft);
    result = transpose(tmp);

    return result;
}

function matrixinvert(matrix) {

    var result = mat3();

    var det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) -
                 matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                 matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);

    var invdet = 1 / det;

    // inverse of matrix m
    result[0][0] = (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) * invdet;
    result[0][1] = (matrix[0][2] * matrix[2][1] - matrix[0][1] * matrix[2][2]) * invdet;
    result[0][2] = (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) * invdet;
    result[1][0] = (matrix[1][2] * matrix[2][0] - matrix[1][0] * matrix[2][2]) * invdet;
    result[1][1] = (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) * invdet;
    result[1][2] = (matrix[1][0] * matrix[0][2] - matrix[0][0] * matrix[1][2]) * invdet;
    result[2][0] = (matrix[1][0] * matrix[2][1] - matrix[2][0] * matrix[1][1]) * invdet;
    result[2][1] = (matrix[2][0] * matrix[0][1] - matrix[0][0] * matrix[2][1]) * invdet;
    result[2][2] = (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]) * invdet;

    return result;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vertexShaderSource);
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
    }
    var fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}

function getTextContent(elementID) {
    var element = document.getElementById(elementID);
    var fsource = "";
    var node = element.firstChild;
    var str = "";
    while (node) {
        if (node.nodeType == 3) // this is a text node
            str += node.textContent;
        node = node.nextSibling;
    }
    return str;
}

function traverse(Id) {
    if(Id == null) return;
    stack.push(modelview);
    modelview = mult(modelview, figure[Id].transform);
    figure[Id].render();
    if(figure[Id].child != null) traverse(figure[Id].child);
    modelview = stack.pop();
    if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

var render = function() {
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

    gl.clear( gl.COLOR_BUFFER_BIT );

    if (ntextures_loaded == ntextures_tobeloaded) {
        traverse(spacecraft.controlCenter);
    }
};

window.onload = function init() {
    try {
        var canvas = document.getElementById("glcanvas");
        gl = canvas.getContext("webgl");
        if (!gl) {
            gl = canvas.getContext("experimental-webgl");
        }
        if (!gl) {
            throw "Could not create WebGL context.";
        }

        // LOAD SHADER (standard texture mapping)
        var vertexShaderSource = getTextContent("vshader");
        var fragmentShaderSource = getTextContent("fshader");
        prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(prog);

        // locate variables for further use
        CoordsLoc = gl.getAttribLocation(prog, "vcoords");
        NormalLoc = gl.getAttribLocation(prog, "vnormal");
        TexCoordLoc = gl.getAttribLocation(prog, "vtexcoord");

        ModelviewLoc = gl.getUniformLocation(prog, "modelview");
        ProjectionLoc = gl.getUniformLocation(prog, "projection");
        NormalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix");

        gl.enableVertexAttribArray(CoordsLoc);
        gl.enableVertexAttribArray(NormalLoc);
		    gl.disableVertexAttribArray(TexCoordLoc);  // we do not need texture coordinates

        gl.enable(gl.DEPTH_TEST);

        //  create a "rotator" monitoring mouse mouvement
        rotator = new SimpleRotator(canvas, render);
        //  set initial camera position at z=40, with an "up" vector aligned with y axis
        //   (this defines the initial value of the modelview matrix )
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

		gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
		gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
		gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
		gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);

		gl.uniform4fv(gl.getUniformLocation(prog, "lightPosition"), flatten(lightPosition));

		projection = perspective(70.0, 1.0, 1.0, 200.0);
		gl.uniformMatrix4fv(ProjectionLoc, false, flatten(projection));  // send projection matrix to the shader program

		// initialize the model
        initModel();

        // build the spacecraft
        buildSpacecraft()
    }
    catch (e) {
        console.log(e);
        document.getElementById("message").innerHTML =
            "Could not initialize WebGL: " + e;
        return;
    }

    //
    // Initialize a texture
    //
    initTexture();

    render();
};
