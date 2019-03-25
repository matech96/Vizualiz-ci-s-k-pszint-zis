"use strict";
const Scene = function(gl) {
  this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
  this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace_fs.essl");
  this.traceProgram = new TexturedProgram(gl, this.vsQuad, this.fsTrace);
  this.quadGeometry = new TexturedQuadGeometry(gl);  

  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.camera = new PerspectiveCamera();
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

  const Texture3D = function(gl, mediaFileUrl,
                               width, height, depth) {
    this.width = width || 64;
    this.height = height || 64;
    this.depth = depth || 64;
    gl.pendingResources[mediaFileUrl] = ++gl.pendingResources[mediaFileUrl] || 1;
    this.mediaFileUrl = mediaFileUrl;
    this.glTexture = gl.createTexture();
    this.image = new Image();
    this.image.onload = () => this.loaded(gl);
    this.image.src = mediaFileUrl;
  };
  Texture3D.prototype.loaded = function(gl){
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = this.image.width;
    canvas.height = this.image.height;
    context.drawImage(this.image, 0, 0 );
    const imageData = context.getImageData(0, 0,
                      this.image.width, this.image.height);
    const data3d = new Uint8Array(256*256*256);
    for(let i=0; i<256; i++){
      for(let j=0; j<256; j++){
        for(let k=0; k<256; k++){
          data3d[i + 256* (j + 256 *k)] = 
            imageData.data[(i + 4096*j + 256 * (k%16) +
             4096*256*Math.floor(k/16) )*4];
  }}}
  gl.bindTexture(gl.TEXTURE_3D, this.glTexture); 
  gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8,
     this.width, this.height, this.depth, 0,
     gl.RED, gl.UNSIGNED_BYTE, 
      data3d
      );
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_3D);
    gl.bindTexture(gl.TEXTURE_3D, null);
    if( --gl.pendingResources[this.mediaFileUrl] === 0 ) {
      delete gl.pendingResources[this.mediaFileUrl];
    }
  };



  this.camera.move(dt, keysPressed);
  
  this.traceProgram.rayDirMatrix.set(this.camera.rayDirMatrix);
  this.traceProgram.eyePosition.set(this.camera.position);
  const orange = new ClippedQuadric(
    this.traceProgram.quadrics.at(0),
    this.traceProgram.clippers.at(0));

  orange.setCylinder(10, 10);

  const big = new ClippedQuadric(
    this.traceProgram.quadrics.at(1),
    this.traceProgram.clippers.at(1));

  big.setCylinder(5, 100);


  this.traceProgram.commit();
  this.quadGeometry.draw();
};


