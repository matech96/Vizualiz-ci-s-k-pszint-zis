"use strict";
const Scene = function(gl) {
  this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
  this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace_fs.essl");
  this.traceProgram = new TexturedProgram(gl, this.vsQuad, this.fsTrace);
  this.quadGeometry = new TexturedQuadGeometry(gl);  

  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.camera = new PerspectiveCamera();
  
  this.background = new TextureCube(gl, [
    "media/posx.jpg",
    "media/negx.jpg",
    "media/posy.jpg",
    "media/negy.jpg",
    "media/posz.jpg",
    "media/negz.jpg",]);
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.3, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.camera.move(dt, keysPressed);
  
  this.traceProgram.rayDirMatrix.set(this.camera.rayDirMatrix);
  this.traceProgram.eyePosition.set(this.camera.position);
  const outer = new ClippedQuadric(
    this.traceProgram.quadrics.at(0),
    this.traceProgram.clippers.at(0),
    this.traceProgram.reflectance.at(0),
    this.traceProgram.refractiveIndicies.at(0),
    this.traceProgram.phongs.at(0));

  outer.setCylinder(10, 10);

  const inner = new ClippedQuadric(
    this.traceProgram.quadrics.at(1),
    this.traceProgram.clippers.at(1),
    this.traceProgram.reflectance.at(1),
    this.traceProgram.refractiveIndicies.at(1),
    this.traceProgram.phongs.at(1));

  inner.setCylinder(5, 100);
  inner.phongs.set(1,1,1,10);



  const ballMixed = new ClippedQuadric(
    this.traceProgram.quadrics.at(2),
    this.traceProgram.clippers.at(2),
    this.traceProgram.reflectance.at(2),
    this.traceProgram.refractiveIndicies.at(2),
    this.traceProgram.phongs.at(2));

  ballMixed.setUnitSphere(2.1, 0, 5);
  ballMixed.reflectance.set(2,2,2);
  ballMixed.refractiveIndicies.set(1.2);

  const ballReflec = new ClippedQuadric(
    this.traceProgram.quadrics.at(3),
    this.traceProgram.clippers.at(3),
    this.traceProgram.reflectance.at(3),
    this.traceProgram.refractiveIndicies.at(3),
    this.traceProgram.phongs.at(3));

  ballReflec.setUnitSphere(0, 0, 5);
  ballReflec.reflectance.set(2,2,2);

  const ballRefrac = new ClippedQuadric(
    this.traceProgram.quadrics.at(4),
    this.traceProgram.clippers.at(4),
    this.traceProgram.reflectance.at(4),
    this.traceProgram.refractiveIndicies.at(4),
    this.traceProgram.phongs.at(4));

  ballRefrac.setUnitSphere(-2.1, 0, 5);
  ballRefrac.refractiveIndicies.set(1.2);

  this.traceProgram.background.set(this.background);

  this.traceProgram.commit();
  this.quadGeometry.draw();
};


