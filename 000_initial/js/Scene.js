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
  // const orange = new ClippedQuadric(
  //   this.traceProgram.quadrics.at(0),
  //   this.traceProgram.clippers.at(0));

  // orange.setCylinder(10, 10);

  // const big = new ClippedQuadric(
  //   this.traceProgram.quadrics.at(1),
  //   this.traceProgram.clippers.at(1));

  // big.setCylinder(5, 100);



  const ballButtom = new ClippedQuadric(
    this.traceProgram.quadrics.at(0),
    this.traceProgram.clippers.at(0),
    this.traceProgram.reflectance.at(0),
    this.traceProgram.refractiveIndicies.at(0));

  ballButtom.setUnitSphere(0, -2.1);
  ballButtom.reflectance.set(1,1,1);
  ballButtom.refractiveIndicies.set(1.2);

  const ballTop = new ClippedQuadric(
    this.traceProgram.quadrics.at(1),
    this.traceProgram.clippers.at(1),
    this.traceProgram.reflectance.at(1),
    this.traceProgram.refractiveIndicies.at(1));

  ballTop.setUnitSphere(0, 2.1);

  const ballRight = new ClippedQuadric(
    this.traceProgram.quadrics.at(2),
    this.traceProgram.clippers.at(2),
    this.traceProgram.reflectance.at(2),
    this.traceProgram.refractiveIndicies.at(2));

  ballRight.setUnitSphere(2.1, 0);
  ballRight.refractiveIndicies.set(1.2);

  const ballLeft = new ClippedQuadric(
    this.traceProgram.quadrics.at(3),
    this.traceProgram.clippers.at(3),
    this.traceProgram.reflectance.at(3),
    this.traceProgram.refractiveIndicies.at(3));

  ballLeft.setUnitSphere(-2.1, 0);
  ballLeft.reflectance.set(1,1,1);

  const ballCenter = new ClippedQuadric(
    this.traceProgram.quadrics.at(4),
    this.traceProgram.clippers.at(4),
    this.traceProgram.reflectance.at(4),
    this.traceProgram.refractiveIndicies.at(4));

  ballCenter.setUnitSphere(0, 0);
  ballCenter.reflectance.set(0.5,0.5,0.5);

  this.traceProgram.background.set(this.background);

  this.traceProgram.commit();
  this.quadGeometry.draw();
};


