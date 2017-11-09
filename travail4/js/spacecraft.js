// spacecraft.js contains only the spacecraft definition using models.js
// require: loaded models.js
// Must be loaded before jedi-starfighter.js



// TODO: clear all this:
var torsoHeight = 5.0;
var torsoWidth = 1.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;

var stack = [];

var figure = [];

var spacecraft = {
    leftWing : {
        id: 0, width: 3.0, height: 1.0, depth: 6.0,
        render: function() {

            modelview = mult(modelview, translate(0, 0, 0));
            modelview = mult(modelview, rotate(0.0, 1, 0, 0));
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, scale4(10, 10, 10));
            sphere.render();
        }
    },
    rightWing : {
        id: 1, width: 3.0, height: 1.0, depth: 6.0,
        render: function() {

            tetrahedron.render();
        }
    }
};

for( var i=0; i<Object.keys(spacecraft).length; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------

/**
 * This function is called inside initNodes(Id). This create a new node from parameter.
 * @param {mat4} transform: transformation mattrix relative to its parent
 * @param {function} render: function for render view
 * @param {int} sibling: sibling's id
 * @param {int} child: child's id
 * @returns {{transform: *, render: *, sibling: *, child: *}}
 */
function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child
    };
    return node;
}

/**
 * Definition node's form from their id
 * @param Id
 */
function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {

        case spacecraft.leftWing.id:
            var leftWing = spacecraft.leftWing;
            m = mat4();

            figure[leftWing.id] = createNode(m, leftWing.render, null, null);
            break;

        case spacecraft.rightWing.id:
            var rightWing = spacecraft.rightWing;
            m = mat4();
            m = mult(m, rotate(90.0,1,0,0));
            figure[rightWing.id] = createNode(m, rightWing.render, null, null);
            break;
    
        case rightLowerLegId:

            m = translate(0.0, upperLegHeight, 0.0);
            m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
            figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
            break;
    
    }

}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function buildSpacecraft() {
    for(i=0; i< Object.keys(spacecraft).length; i++) initNodes(i);
}