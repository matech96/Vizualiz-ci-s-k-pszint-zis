const ClippedQuadric = function(A, B, reflective = false) {
  this.A = A;
  this.B = B;
  this.reflective = reflective;
}

ClippedQuadric.prototype.setUnitSphere = function(){
  this.A.set(	1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.B.set(	0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

  ClippedQuadric.prototype.setCylinder = function(diaginal, height){
    this.A.set(1, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, -1*diaginal);
    this.B.set(0, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, -1*height);
  }

  ClippedQuadric.prototype.translate = function(x,y,z){
    this.A.translate(x, y, z);
    this.B.translate(x, y, z);
  }