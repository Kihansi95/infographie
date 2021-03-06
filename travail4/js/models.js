// models.js generates some basic model we'll use in spacecraft.js
// Must be loaded before spacecraft

var config = {
    sphere: {
        radius: 1, slices: 25.0, stacks: 25.0
    },
    tetrahedron: {
        side: 10
    },
    squareTetrahedron: {
        w: 1, h: 1, d: 1
    },
    cone: {
        radius: 1, height: 2, slices: 25.0
    }
};

var sphere, tetrahedron, squareTetra, hemicone, cylinder, hemisphere,
    m_cube, m_ring, pentagonprism, trapeziumprism, triangleprism;

function initModel() {
    sphere = createModel(uvSphere(1, config.sphere.slices, config.sphere.stacks));
    tetrahedron = createModel(uvTetrahedron(config.tetrahedron.side));
    squareTetra = createModel(uvSquareTetrahedron(config.squareTetrahedron.w, config.squareTetrahedron.h, config.squareTetrahedron.d ));
    // hemicone = createModel(uvQuartersphereOutside(1, 25, 1));

    hemicone = createModel(uvHemiCone());

    cylinder = createModel(uvCylinder(1,1,25.0, false, false ));
    hemisphere = createModel(uvHemisphereOutside(1,32,16));

    m_cube = createModel(cube(1));
    m_ring = createModel(ring(0.25, 1, 8));

    pentagonprism = createModel(uvPentagonPrism(true, 1, .65, 0.8, 0.4)); // right/left = 1/2, front/back = 3/4, left/back = 0.8

    trapeziumprism = createModel(uvTrapeziumPrism(true, {a: .3, b: 1, c:0.5}, {a: .8, b: 3, c:1.2}, 3));

    triangleprism = createModel(uvCylinder(1,1, 3, false, false ));
}

function createModel(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.textureBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(CoordsLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(NormalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(TexCoordLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(ModelviewLoc, false, flatten(modelview));           //--- load flattened modelview matrix
        gl.uniformMatrix3fv(NormalMatrixLoc, false, flatten(normalMatrix));     //--- load flattened normal matrix

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    };

    return model;
}