const ClippedQuadric = function(A, B, reflectance) {
  this.A = A;
  this.B = B;
  this.reflectance = reflectance;
}

ClippedQuadric.prototype.setUnitSphere = function(h, v){
  this.A.set(	1, 0, 0, -(2*h),
		0, 1, 0, -2*v,
		0, 0, 1, 0,
		0, 0, 0, -1+(h*h)+(v*v));
  this.B.set(	0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0);
  this.reflectance.set(0, 0, 0);
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

ClippedQuadric.prototype.setWalls = function(){
  this.A.set(-20, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1000);
  this.B.set(0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
}