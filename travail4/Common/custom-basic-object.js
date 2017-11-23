function calcNormal(u, v) {
    return normalize(cross(u,v), false);
}

/**
 * Create a model of a tetrahedron. The tetrahedron havs one face in plan (xz)
 * and a vertex in the positive y-axis. The center of the face (xz) will be
 * in the center O (O, O, O)
 * @param side: the length of a side of the tetrahedron. If not given, the value will be 1.
 */
function uvTetrahedron(side) {
    var s = side || 1;
    var coords = [];
    var normals = []
    var texCoords = [];
    var indices = [];

    function face(xyz, nrm) {
        var start = coords.length / 3;
        var i;
        for (i = 0; i < 9; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 3; i++) {
            normals.push(nrm[0], nrm[1], nrm[2]);
        }
        texCoords.push(0, 0, .5, 1, 1, 0);
        indices.push(start, start + 1, start + 2);
    }

    var sq3 = Math.sqrt(3);
    var sq6 = Math.sqrt(6);

    face([-s / 2, 0, -sq3 * s / 6, s / 2, 0, -sq3 * s / 6, 0, 0, sq3 * s / 3], [0, -1, 0]);    //A C B
    face([0, 0, sq3 * s / 3, s / 2, 0, -s * sq3 / 6, 0, sq6 * s / 3, 0], [1, 1, 1]);   //B C D
    face([0, 0, sq3 * s / 3, 0, sq6 * s / 3, 0, -s / 2, 0, -sq3 * s / 6], [-1, 1, 1]);  //B D A
    face([s / 2, 0, -s * sq3 / 6, -s / 2, 0, -s * sq3 / 6, 0, sq6 * s / 3, 0], [0, 1, -1]);  //C A D

    return {
        vertexPositions: new Float32Array(coords),
        vertexNormals: new Float32Array(normals),
        vertexTextureCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    }
}

/**
 * Create a model of a tetrahedron. The tetrahedron havs one face in plan (xz)
 * and a vertex in the positive y-axis. The center of the face (xz) will be
 * in the center O (O, O, O)
 * @param width
 * @param height
 * @param depth
 */
function uvSquareTetrahedron(width, height, depth) {
    var w = (width || 1) / 2;
    var h = height || 1;
    var d = depth || 1;
    var coords = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    function face(xyz, nrm, coord) {
        var start = coords.length / 3;
        var i;
        for (i = 0; i < 9; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 3; i++) {
            normals.push(nrm[0], nrm[1], nrm[2]);
        }
        texCoords = texCoords.concat(coord);
        // texCoords.push(0, 0, 1, 0, 1, 0 , 0 , 1);
        indices.push(start, start + 1, start + 2);
    }

    face([-w, 0, 0, w, 0, 0, 0, 0, d], [0, -1, 0], [0, 0, 1, 0, 0, 1]);                             // A B C
    face([-w, 0, 0, 0, 0, d, 0, h, 0], calcNormal([-w, 0, -d], [-w, -h, 0]), [0, 0, 1, 0, 0, 1]);   // A C D
    face([0, 0, d, w, 0, 0, 0, h, 0], calcNormal([w, -h, 0], [w, 0, -d]), [1, 0, 0, 0, 0, 1]);      // C B D
    face([w, 0, 0, -w, 0, 0, 0, h, 0], [0, 0, -1], [0, 0, 1, 0, 0, 1]);                             //B A D

    return {
        vertexPositions: new Float32Array(coords),
        vertexNormals: new Float32Array(normals),
        vertexTextureCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    }
}

/**
 * Create a model of a prism that has the square pentagon in upper and down face.
 * The left side of the pentagon will be longer then the right side of pentagone.
 * So do the back side compare to the front side.
 * @param {boolean} hasBottom: if false, only draw the surrounding faces
 * @param backSide: the longer of the back side.
 * @param frontSide: the longer of the front side.
 * @param left: the left side
 * @param right: the right side
 * @param height
 */
function uvPentagonPrism(hasBottom, backSide, frontSide, left, right, height) {
    var s = frontSide || 0.5;
    var b = backSide || 1;
    var l = left || 1;
    var r = right || 0.5;
    var h = height || 1;
    var coords = [];
    var normals = [];
    var texCoords = [];
    var indices = [];
    if(typeof hasBottom === undefined) hasBottom = false;

    function face(xyz, nrm) {
        var start = coords.length / 3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0], nrm[1], nrm[2]);
        }
        texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    }

    function pentagonFace(xyz, nrm) {
        var start = coords.length / 3;
        var i;
        for (i = 0; i < 15; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 5; i++) {
            normals.push(nrm[0], nrm[1], nrm[2]);
        }
        texCoords.push(0, 0, 0, 1, 1, 0);
        indices.push(start, start + 1, start + 2, start, start + 2, start + 3, start, start + 3, start + 4);
    }

    face([b, 0, 0,      0, 0, 0,    0, h, 0,    b, h, 0], [0,0,-1]);    // back
    face([0, 0, 0,      0, 0, l,    0, h, l,    0, h, 0], [-1,0,0]);      // left
    face([b, 0, 0,      b, 0, r,    b, h, r,    b, h, 0], [1,0,0]);    // first right
    face([b, 0, r,      s, 0, l,    s, h, l,    b, h, r], calcNormal([0,-1,0], [b-s, 0, r-l]));  // second right //TODO normal vector
    face([0, 0, l,      s, 0, l,    s, h, l,    0, h, l], [0,0,1]); // front

    if(hasBottom) {
        pentagonFace([0, 0, 0,      0, 0, l,    s, 0, l,    b, 0, r,    b, 0, 0], [0,-1,0]); // downner
        pentagonFace([0, h, 0,      0, h, l,    s, h, l,    b, h, r,    b, h, 0], [0,1,0]); // upper
    }

    return {
        vertexPositions: new Float32Array(coords),
        vertexNormals: new Float32Array(normals),
        vertexTextureCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    }
}

/**
 *
 * @param hasBottom
 * @param {Object} upper : contains attribute {a, b, c}
 * @param {Object} downer : contains attribute {a, b, c}
 * @param height
 */
function uvTrapeziumPrism(hasBottom, upper, downer, height) {

    var coords = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    // set default values
    var u = upper || {};
    var d = downer || {};
    var h = height || 1;
    d.a = (d.a || 0.8)/2; d.b = (d.b || 1)/2; d.c = d.c || 1;           // default downder
    u.a = (u.a || 0.4) / 2; u.b = (u.b || 0.5) / 2; u.c = u.c || 0.5;   // default upper

    console.log('value', u, d, h);

    function face(xyz, nrm) {
        var start = coords.length / 3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0], nrm[1], nrm[2]);
        }
        texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    }

    // set faces

    face([-d.b, 0, 0,       d.b, 0, 0,      u.b, 0, h,     -u.b, 0, h],     [0, -1, 0]); // bottom face
    face([-d.b, 0, 0,      -u.b, 0, h,     -u.a, u.c, h,   -d.a, d.c, 0],   calcNormal([-d.b+u.b, 0, -h], [-d.b+d.a, -d.c, 0])); // left face
    face([d.b, 0, 0,        d.a, d.c, 0,    u.a, u.c, h,    u.b, 0, h],     calcNormal([d.b-d.a, -d.c, 0], [d.b-u.b, 0, -h])); // right face //TODO calcNormal
    face([d.a, d.c, 0,     -d.a, d.c, 0,   -u.a, u.c, h,    u.a, u.c, h],   calcNormal([1, 0, 0], [d.a-u.a, d.c-u.c, -h])); // top face //TODO calcNormal

    if(hasBottom) {
        face([-d.b, 0, 0,      -d.a, d.c, 0,      d.a, d.c, 0,      d.b, 0, 0],     [0, 0, -1]); // downer
        face([-u.b, 0, h,      -u.a, u.c, h,      u.a, u.c, h,      u.b, 0, h],     [0, 0, 1]); // upper
    }

    return {
        vertexPositions: new Float32Array(coords),
        vertexNormals: new Float32Array(normals),
        vertexTextureCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    }
}

function uvTrianglePrism(largeSide, smallSide, height, angle) {
    var a = (smallSide || 1) / 2;
    var b = largeSide || 5;
    var h = height || 5;

    var delta = (1 + 1/Math.tan(radians(angle))) * h;
    function face(xyz, nrm) {
        var start = coords.length / 3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0], nrm[1], nrm[2]);
        }
        texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    }

    face([-a, h, 0,     a, h, 0,    a, 0, delta,     -a, 0, delta],         [0, 0, -1]); // back
    face([-a, h, b,    -a, h, 0,   -a, 0, delta,     -a, 0, delta + b],     [-1, 0, 0]); // left
    face([ a, h, 0,     a, h, b,    a, 0, delta+b,    a, 0, delta],         [1, 0, 0]); // right
    face([-a, h, 0,     a, h, 0,    a, 0, delta,     -a, 0, delta], [0, 0, 1]); // front
}
