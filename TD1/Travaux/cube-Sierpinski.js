
var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

var colorLoc;
var BaseColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var face = [
        vec3( -0.5, -0.5, 0.5 ),
        vec3( -0.5,  0.5, 0.5 ),
        vec3(  0.5,  0.5, 0.5 ),
        vec3(  0.5, -0.5, 0.5 )
    ];
    var fond = [
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    divideSquare( fond[0], fond[1], fond[2], fond[3], NumTimesToSubdivide);
    divideSquare( fond[0], fond[3], face[3], face[0], NumTimesToSubdivide);
    divideSquare( fond[0], fond[1], face[1], face[0], NumTimesToSubdivide);
    divideSquare( fond[1], fond[2], face[2], face[1], NumTimesToSubdivide);
    divideSquare( fond[2], fond[3], face[3], face[2], NumTimesToSubdivide);
    divideSquare( face[0], face[1], face[2], face[3], NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );



    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );

    // projection 3D
    var pMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
     var projectionLoc = gl.getUniformLocation(program, "projection");
     gl.uniformMatrix4fv(projectionLoc, false, flatten(pMatrix));

     colorLoc = gl.getUniformLocation( program, "color" );
     gl.enable(gl.DEPTH_TEST)
    render();
};

function square( a, b, c, d )
{
    points.push( a, b, c, a, c, d );
}

function divideSquare( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        square( a, b, c, d );
    }
    else {

        --count;

        // nines new squares

        divideSquare( a,            mix(b,a,1/3), mix(c,a,1/3), mix(d,a,1/3), count );
        divideSquare( mix(b,a,1/3), mix(b,a,2/3), mix(d,b,1/3), mix(c,a,1/3), count );
        divideSquare( mix(b,a,2/3), b,            mix(c,b,1/3), mix(d,b,1/3), count );
        divideSquare( mix(d,a,1/3), mix(c,a,1/3), mix(d,b,2/3), mix(d,a,2/3), count );

        //divideSquare( mix(c,a,1/3), mix(d,b,1/3), mix(c,a,2/3), mix(d,b,2/3), count );

        divideSquare( mix(d,b,1/3), mix(c,b,1/3), mix(c,b,2/3), mix(c,a,2/3), count );
        divideSquare( mix(d,a,2/3), mix(d,b,2/3), mix(c,d,1/3), d,            count );
        divideSquare( mix(d,b,2/3), mix(c,a,2/3), mix(c,d,2/3), mix(c,d,1/3), count );
        divideSquare( mix(c,a,2/3), mix(c,b,2/3), c,            mix(c,d,2/3), count );
    }
}

function render()
{
    // gl.clear( gl.COLOR_BUFFER_BIT );
    // gl.drawArrays( gl.TRIANGLES, 0, points.length );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.uniform4fv(colorLoc, flatten(BaseColors[0]));
    gl.drawArrays( gl.TRIANGLES, 0, points.length/6 );

    gl.uniform4fv(colorLoc, flatten(BaseColors[1]));
    gl.drawArrays( gl.TRIANGLES, points.length/6, points.length/6 );

    gl.uniform4fv(colorLoc, flatten(BaseColors[2]));
    gl.drawArrays( gl.TRIANGLES, 2*points.length/6, points.length/6 );

    gl.uniform4fv(colorLoc, flatten(BaseColors[3]));
    gl.drawArrays( gl.TRIANGLES, 3*points.length/6, points.length/6 );

    gl.uniform4fv(colorLoc, flatten(BaseColors[4]));
    gl.drawArrays( gl.TRIANGLES, 4*points.length/6, points.length/6 );

    gl.uniform4fv(colorLoc, flatten(BaseColors[5]));
    gl.drawArrays( gl.TRIANGLES, 5*points.length/6, points.length/6 );
}
