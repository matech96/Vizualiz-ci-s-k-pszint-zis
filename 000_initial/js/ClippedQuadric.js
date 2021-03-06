const ClippedQuadric = function(A, B, reflectance, refractiveIndicies, phongs) {
  this.A = A;
  this.B = B;
  this.reflectance = reflectance;
  this.refractiveIndicies = refractiveIndicies;
  this.phongs = phongs;
}

ClippedQuadric.prototype.setUnitSphere = function(h, v, d = 0, s = 1){
  this.A.set(	1, 0, 0, -(2*h),
		0, 1, 0, -2*v,
		0, 0, 1, -2*d,
		0, 0, 0, -s+(h*h)+(v*v)+(d*d));
  this.B.set(	0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0);
  this.reflectance.set(0, 0, 0);
  this.refractiveIndicies.set(-1);
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