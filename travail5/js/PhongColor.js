// default color
var COLOR = {
    AMBIENT: vec4(0.0, 0.1, 0.3, 1.0),
    DIFFUSE: vec4(0.48, 0.55, 0.69, 1.0),
    SPECULAR: vec4(0.48, 0.55, 0.69, 1.0),
    SHININESS: 100.0
};

function setColor(r,b,g) {
    setDiffuse(r,b,g);
    setAmbient(r,b,g);
}

function setDiffuse(r,b,g) {
    diffuseProduct = mult(lightDiffuse, vec4(r/255,b/255,g/255,1));
    gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
}

function setAmbient(r,b,g) {
    ambientProduct = mult(lightAmbient, vec4(r/255,b/255,g/255,1));
  	gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
}

function setSpecular(r,b,g) {
    diffuseProduct = mult(lightDiffuse, vec4(r/255,b/255,g/255,1));
    gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
}

function setShininess(shininess) {
    materialShininess = shininess;
    gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);
}

/**
 * Call after render
 */
function cleanColor() {
  ambientProduct = mult(lightAmbient, COLOR.AMBIENT);
  diffuseProduct = mult(lightDiffuse, COLOR.DIFFUSE);
  specularProduct = mult(lightSpecular, COLOR.SPECULAR);
  materialShininess = COLOR.SHININESS;

  gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
  gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);
}
