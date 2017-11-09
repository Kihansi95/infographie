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

var component = {
    main_wing : {
        attribute: {
            x:5, y:10, z:25
        },

        render: function() {

            modelview = mult(modelview, rotate(90.0, 0, 0, 1));
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, scale4(5, 10, 25));
            squareTetra.render();

            // remise
            modelview = mult(modelview, scale4(1/5, 1/10, 1/25));
            modelview = mult(modelview, rotate(-90.0, 0, 0, 1));
        }
    },

    gun: {
      render: function() {

          normalMatrix = extractNormalMatrix(modelview);
          modelview = mult(modelview, translate(-5, 1.3, 2));
          modelview = mult(modelview, scale4(.5, .5, 2.3));
          cylinder.render();

          // remise
          modelview = mult(modelview, scale4(2, 2, 1/2.3));
      }
    },

    muzzle: {
      render: function() {

          normalMatrix = extractNormalMatrix(modelview);
          modelview = mult(modelview, translate(-5, 1.3, 2));
          modelview = mult(modelview, scale4(1, 1, 1));
          cylinder.render();

      }
    },

    control_center: {
       render: function() {

            modelview = mult(modelview, rotate(-3.0, 1, 0, 0));
            modelview = mult(modelview, translate(0, 0, -1));
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, scale4(9,9,14));
            cone.render();                      // TODO: make another form, a cone that is cut on the top
       }
    }
};

var spacecraft = {
  controlCenter: 0,
  leftWing: 1,
  rightWing: 2,
  gun: 3,
  muzzle: 4
}

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

        case spacecraft.controlCenter:
            figure[spacecraft.controlCenter] = createNode(m, component.control_center.render, spacecraft.leftWing, null);
            break;

        case spacecraft.leftWing:

            figure[spacecraft.leftWing] = createNode(m, component.main_wing.render, spacecraft.rightWing, spacecraft.gun);
            break;

        case spacecraft.gun:
            figure[spacecraft.gun] = createNode(m, component.gun.render, null, spacecraft.muzzle);
            break;

        case spacecraft.muzzle:
            figure[spacecraft.muzzle] = createNode(m, component.muzzle.render, null, null);
            break;

        case spacecraft.rightWing:

            m = mult(m, scale4(-1, 1, 1)); // make mirror by y-axis from left wing
            figure[spacecraft.rightWing] = createNode(m, component.main_wing.render, null, spacecraft.gun);
            break;

    }

}

function buildSpacecraft() {
    for(i=0; i< Object.keys(spacecraft).length; i++) initNodes(i);
}
