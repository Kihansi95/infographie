// spacecraft.js contains only the spacecraft definition using models.js
// require: loaded models.js
// Must be loaded before jedi-starfighter.js

var stack = [];

var figure = [];

var component = {

    // the wings
    front_wing: {
        attr: {width: 10, height: 5, depth: 25},

        render: function () {

            // object form
            modelview = mult(modelview, rotate(90.0, 0, 0, 1));
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, scale4(5, 10, 25));

            // skin
            setColor(188, 198, 201);
            setTexture(TEXTURE.FRONTWING);

            squareTetra.render();

            // remise
            cleanColor();
            gl.disableVertexAttribArray(TexCoordLoc);
            modelview = mult(modelview, scale4(1 / 5, 1 / 10, 1 / 25));
            modelview = mult(modelview, rotate(-90.0, 0, 0, 1));
        }
    },

    middle_wing: {
        render: function () {

            // object form
            modelview = mult(modelview, translate(-6, 0.40, -3.5));
            modelview = mult(modelview, rotate(15.0, 0, 0, 1));
            modelview = mult(modelview, rotate(96.0, 1, 0, 0));
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, shear(70));
            modelview = mult(modelview, scale4(11, 7, 2));   // 3rd = height

            // skin
            setColor(255, 255, 255);
            setTexture(TEXTURE.MIDDLEWING);

            m_cube.render();

            // remise
            cleanColor();
            modelview = mult(modelview, scale4(1 / 11, 1 / 7, 1 / 2));
            modelview = mult(modelview, shear(-70));
            modelview = mult(modelview, rotate(-96.0, 1, 0, 0));
        }
    },

    back_wing: {
        render: function () {

            // object form
            modelview = mult(modelview, translate(6.3, -.65, -3.2));
            modelview = mult(modelview, rotate(180, 0, 1, 0));
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, scale4(13, 2, 10));

            // skin
            setColor(110, 58, 55);
            setTexture(TEXTURE.BACKWING);
            pentagonprism.render();

            //remise
            cleanColor();
            modelview = mult(modelview, scale4(1 / 13, .5, .1));
            modelview = mult(modelview, rotate(-180, 0, 1, 0));
        }
    },

    // wings child
    gun: {
        render: function () {

            // object form
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, translate(-5.3, 1.2, 5));
            modelview = mult(modelview, scale4(.5, .5, 2.3));

            // skin
            // setColor(110, 53, 50);
            setAmbient(110, 53, 50);
            setDiffuse(0,0,0);
            setSpecular(0,0,0);

            setTexture();

            cylinder.render();

            // remise
            cleanColor();
            modelview = mult(modelview, scale4(2, 2, 1 / 2.3));
        }
    },

    muzzle: {
        render: function () {

            // object form
            modelview = mult(modelview, translate(0, 0, .3));
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, scale4(.3, .3, 2.1));

            // skin
            setColor(45, 35, 32);
            setTexture();

            cylinder.render();

            // remise
            cleanColor();
            modelview = mult(modelview, scale4(10 / 3, 10 / 3, 1 / 2.8));
        }
    },

    engine: {
        render: function () {

            // object form: engine's body
            modelview = mult(modelview, translate(4, -4, -6));
            normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
            modelview = mult(modelview, scale4(2, 2, 5));

            // skin
            setTexture(TEXTURE.ENGINE);       // since engine doesnt have texture, just need to set once
            setColor(188, 198, 201);
            cylinder.render();

            // remise
            modelview = mult(modelview, scale4(.5, .5, 1 / 7));

            // object form: engine's outside bottom
            modelview = mult(modelview, translate(0, 0, -4.5));
            modelview = mult(modelview, scale4(2, 2, 2));

            setTexture(TEXTURE.ENGINEBOTTOM);
            cylinder_non_top_outside.render();

            // object form: engine's inside bottom
            modelview = mult(modelview, scale4(0.9, 0.9, 0.9));

            //skin
            setTexture();
            // setColor(22, 109, 144);
            setAmbient(22, 109, 144);
            setDiffuse(0,0,0);
            setSpecular(0,0,0);

            cylinder_non_top_insdide.render();

            // remise
            cleanColor();
            modelview = mult(modelview, scale4(1 / 2, 1 / 2, 1 / 7));
        }
    },

    // the central
    control_center: {
        attr: {width: 4, height: 4, depth: 15},
        render: function () {

            // object form
            modelview = mult(modelview, translate(0, 1.5, -8));
            modelview = mult(modelview, rotate(180, 0, 1, 0));
            normalMatrix = extractNormalMatrix(modelview);
            modelview = mult(modelview, scale4(component.control_center.attr.width,
                component.control_center.attr.height,
                component.control_center.attr.depth));

            // skin
            setColor(188, 198, 201);
            setTexture(TEXTURE.CONTROLCENTER);

            hemicone.render();                      // TODO: make another form, a cone that is cut on the top

            // remise
            cleanColor();
            modelview = mult(modelview, rotate(180, 0, 1, 0));
            modelview = mult(modelview, scale4(1 / component.control_center.attr.width,
                1 / component.control_center.attr.height,
                1 / component.control_center.attr.depth));
        }
    },

    control_room: {
        render: function () {
            modelview = mult(modelview, translate(0, 1, -1));
            modelview = mult(modelview, rotate(97, 1, 0, 0));
            normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
            modelview = mult(modelview, scale4(
                component.control_center.attr.width, 6,
                component.control_center.attr.height));

            // skin
            // setColor(19, 19, 14);
            setAmbient(19, 19, 14);
            setDiffuse(0,0,0);
            setSpecular(0,0,0);
            setTexture();

            hemisphere.render();

            // remise
            cleanColor();
            modelview = mult(modelview, scale4(
                1 / component.control_center.attr.width, 1 / 6,
                1 / component.control_center.attr.height));
            modelview = mult(modelview, rotate(-97, 1, 0, 0));

        }
    },

    control_cover: {
        render: function () {
            modelview = mult(modelview, translate(0, -2, -7));
            normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
            modelview = mult(modelview, scale4(5, 6, 5));

            // skin
            setColor(188, 198, 201);
            setTexture(TEXTURE.CONTROLCOVER);
            trapeziumprism.render();

            // remise
            cleanColor();
            modelview = mult(modelview, scale4(5 / 5, 5 / 6, 5 / 5));
            //triangleprism.render();
        }
    },

    // r2d2

    robot: {
        render: function () {

            modelview = mult(modelview, translate(5, 2, -4));
            modelview = mult(modelview, rotate(90, 1, 0, 0));
            normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
            modelview = mult(modelview, scale4(1.2, 1.2, 1.2));

            setColor(173, 171, 173);
            setTexture(TEXTURE.R2D2HEAD);

            hemisphere.render();

            modelview = mult(modelview, translate(0, 0, .5));

            setTexture(TEXTURE.R2D2BODY);
            cylinder.render();

            cleanColor();
        }
    },

    test: function () {
        normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
        modelview = mult(modelview, scale4(6, 6, 6));
        hemicone.render(1, 3, 25, false);
    }

};

var spacecraft = {
    controlCenter: 0,
    leftWing: 1,
    rightWing: 2,
    gun: 3,
    muzzle: 4,
    controlRoom: 5,
    middleWing: 6,
    backWing: 7,
    controlCover: 8,
    engine: 9,
    r2d2: 10,
    test: 11
};

for (var i = 0; i < Object.keys(spacecraft).length; i++) figure[i] = createNode(null, null, null, null);

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
function createNode(transform, render, sibling, child) {
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

    switch (Id) {

        // central
        case spacecraft.controlCenter:
            figure[spacecraft.controlCenter] = createNode(m, component.control_center.render, spacecraft.leftWing, spacecraft.controlRoom);
            break;

        case spacecraft.controlRoom:
            figure[spacecraft.controlRoom] = createNode(m, component.control_room.render, spacecraft.controlCover, null);
            break;

        case spacecraft.controlCover:
            figure[spacecraft.controlCover] = createNode(m, component.control_cover.render, null, null);
            break;

        // wings
        case spacecraft.leftWing:

            figure[spacecraft.leftWing] = createNode(m, component.front_wing.render, spacecraft.rightWing, spacecraft.gun);
            break;

        case spacecraft.gun:
            figure[spacecraft.gun] = createNode(m, component.gun.render, spacecraft.middleWing, spacecraft.muzzle);
            break;

        case spacecraft.middleWing:
            figure[spacecraft.middleWing] = createNode(m, component.middle_wing.render, null, spacecraft.backWing);
            break;

        case spacecraft.backWing:
            figure[spacecraft.backWing] = createNode(m, component.back_wing.render, null, spacecraft.engine);
            break;

        case spacecraft.muzzle:
            figure[spacecraft.muzzle] = createNode(m, component.muzzle.render, null, null);
            break;

        case spacecraft.rightWing:
            m = mult(m, scale4(-1, 1, 1)); // make mirror by y-axis from left wing
            figure[spacecraft.rightWing] = createNode(m, component.front_wing.render, spacecraft.r2d2, spacecraft.gun);
            break;

        // engine
        case spacecraft.engine :
            figure[spacecraft.engine] = createNode(m, component.engine.render, null, null);
            break;

        case spacecraft.r2d2:
            figure[spacecraft.r2d2] = createNode(m, component.robot.render, null, null);
            break;

        case spacecraft.test:
            figure[spacecraft.test] = createNode(m, component.test, null, null);
            break;
    }

}

function buildSpacecraft() {
    for (i = 0; i < Object.keys(spacecraft).length; i++) initNodes(i);
}
