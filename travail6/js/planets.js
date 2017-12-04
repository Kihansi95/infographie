var PLANETS = {
    earth: 0,
    moon: 1,
    saturn: 2,
    jupiter: 3,
    signature: 4
};

var planets = new right_child_left_sibling(PLANETS);

var planets_components = {
    earth: function() {
        modelview = mult(modelview, translate(-10, -10, 30));
        modelview = mult(modelview, rotate(80, 0, 0, 1));
        modelview = mult(modelview, rotate(90, 0, 1, 0));

        angle_earth += 0.2;
        modelview = mult(modelview, rotate(angle_earth, 0, 0, 1));
        normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
        modelview = mult(modelview, scale4(5, 5,5));

        setColor(190,190,190);
        setTexture(TEXTURE.EARTH);


        sphere.render();
        modelview = mult(modelview, scale4(1/5,1/5,1/5));
    },

    moon: function() {

      angle_moon += 1;
      modelview = mult(modelview, rotate(angle_earth + angle_moon, 0, 0, 1));
      modelview = mult(modelview, translate(15, 0, 0));
      normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
      modelview = mult(modelview, scale4(1.5, 1.5, 1.5));

      setColor(190,190,190);
      setShininess(100);
      setTexture(TEXTURE.MOON);

      sphere.render();
      modelview = mult(modelview, scale4(1/1.5,1/1.5,1/1.5));
    },

    saturn: function() {

      modelview = mult(modelview, translate(0, 27, -25));
      modelview = mult(modelview, rotate(20, 0, 0, 1));
      modelview = mult(modelview, rotate(-50, 1, 0, 0));

      angle_saturn += 0.5;
      modelview = mult(modelview, rotate(angle_saturn, 0,0,1));
      normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
      modelview = mult(modelview, scale4(6, 6, 6));

      setColor(100,100,100);
      setTexture(TEXTURE.SATURN);
      sphere.render();
      modelview = mult(modelview, scale4(1/6,1/6,1/6));

      modelview = mult(modelview, scale4(15, 15, 15));
      setColor(100,100,100);
      setTexture(TEXTURE.SATURN_RING);
      m_ring.render();
    },
    
    jupiter: function() {
	
	    modelview = mult(modelview, translate(100, 0, -150));
	    modelview = mult(modelview, rotate(90, 1, 0, 0));
     
	    // animation
	    angle_jupiter += .05;
	    modelview = mult(modelview, rotate(angle_jupiter, 0, 0, 1));
	    
	    normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
	    modelview = mult(modelview, scale4(50, 50, 50));
	
	    setColor(100,100,100);
	    setTexture(TEXTURE.JUPITER);
	    
	    sphere.render();
	    modelview = mult(modelview, scale4(1/100,1/100,1/100));
    },
    
    signature: function() {
	
	    modelview = mult(modelview, translate(-25, 0, -25));
	    modelview = mult(modelview, rotate(90, 0, 1, 0));
     
	    angle_sigature += 1.5;
	    modelview = mult(modelview, rotate(angle_sigature, 0, 1, 0));
	    
	    normalMatrix = extractNormalMatrix(modelview);  // faire avant scale
	    modelview = mult(modelview, scale4(10, 10, 10));
	    
	    setColor(100,100,100);
	    setTexture(TEXTURE.SIGNATURE);
	    setTranslucent(0.5);
	    
	    m_cube.render();
	    
	    cleanTranslucent();
	    
    }
}

planets.initNodes = function(figure, id) {
    var m = mat4();

    switch (id) {
        case PLANETS.earth:
            figure[PLANETS.earth] = createNode(m, planets_components.earth, PLANETS.saturn, PLANETS.moon);
            break;

        case PLANETS.moon:
            figure[PLANETS.moon] = createNode(m, planets_components.moon, null, null);
            break;

        case PLANETS.saturn:
            figure[PLANETS.saturn] = createNode(m, planets_components.saturn, PLANETS.jupiter, null);
            break;
            
        case PLANETS.jupiter:
            figure[PLANETS.jupiter] = createNode(m, planets_components.jupiter, PLANETS.signature, null);
            break;
	
	    case PLANETS.signature:
		    figure[PLANETS.signature] = createNode(m, planets_components.signature, null, null);
		    break;
    }
}

// --- animation
var angle_earth = 0;
var angle_saturn = 0;
var angle_moon = 0;
var angle_jupiter = 0;
var angle_sigature = 0;
// -------------
