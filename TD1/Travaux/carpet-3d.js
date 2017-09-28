
var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec3( -1, -1, 0 ),
        vec3( -1,  1, 0 ),
        vec3(  1,  1, 0 ),
        vec3(  1, -1, 0 )
    ];

    divideSquare( vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);

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
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
