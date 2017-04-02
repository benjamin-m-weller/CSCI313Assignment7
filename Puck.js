

(function(){

  // SET_MOVE_BOUNDS

  var xL,xR,yC,yF; // movement bounds (used by Puck update)

  Puck_setMoveBounds = function(left,right,ceiling,floor){ 
    xL=left; xR=right; yC=ceiling; yF=floor; 
  };

  window.Puck_setMoveBounds;


  // NEW PUCK

  const PW = 10, PH = 10; // width and height
  const PC = "#ffffff";   // color

  function Puck(){
    var g = new createjs.Graphics();
    g.beginFill(PC).drawRect(0,0,PW,PH);
    this.Shape_constructor(g);
    this.x = 0;
    this.y = 0;
  }

  var p = createjs.extend(Puck,createjs.Shape);

  // vX,vY,nX,nY should be private
  p.vX = p.vY = 0; // velocity
  p.nX = p.nY = 0; // next position

  p.setPosition = function(x,y){ this.x = x; this.y = y; };

  p.setVelocity = function(vX,vY){ this.vX = vX; this.vY = vY; };

  p.update = function()
  { 
    var nX = this.x + this.vX;
    if ( nX    < xL ) 
	{ nX = xL;    this.vX = -this.vX; };
    if ( nX+PW > xR ) 
	{ nX = xR-PW; this.vX = -this.vX; };
    this.nX = nX;
    var nY = this.y + this.vY;
    if ( nY    < yC )
	{ nY = yC;    this.vY = -this.vY; };
    if ( nY+PH > yF ) 
	{ 
	nY = yF-PH; 
	this.vY = -this.vY; 
	};
    this.nY = nY;
  };

  p.isMovingDown = function(){ return (this.vY > 0); };

  p.hitsTopOf = function(o) 
  {
    var q = o.collider();
    return ( this.nY+PH > q.yT && this.nX+PW >= q.xL && this.nX <= q.xR );
  };

  // Assumption: puck is moving down
  p.bounceUpFrom = function(o) 
  { 
    this.nY = o.collider().yT - PH; 
    this.vY = -this.vY; 
  };

  p.hits = function(o) {
    var c = o.collider();
    var hitX = this.nX <= c.xR && this.nX+PW >= c.xL;
    var hitY = this.nY <= c.yB && this.nY+PH >= c.yT;
    return hitX && hitY;
  };

  p.invertYVelocity = function(){ this.vY = -this.vY; };

  p.render = function(){ this.x = this.nX; this.y = this.nY; };

  window.Puck = createjs.promote(Puck,"Shape");

}());

