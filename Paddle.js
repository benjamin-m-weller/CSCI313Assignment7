(function(){

  // SET_MOVE_BOUNDS

  var xL,xR; // movement bounds

  Paddle_setMoveBounds = function(left,right){ xL = left; xR = right; };

  window.Paddle_setMoveBounds;


  // NEW PADDLE

  function Paddle(color,width,height){
    var g = new createjs.Graphics();
    g.beginFill(color).drawRect(0,0,width,height);
    this.Shape_constructor(g);
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
	
  }

  var p = createjs.extend(Paddle,createjs.Shape);

  //Going to dynamically inject them here
  p.movingLeft=false;
  p.movingRight=false;
  
  p.vX = 0; // velocity
  p.sX = 0; // speed
  p.nX = 0; // next position

  p.setPosition = function(x,y){ this.x = x; this.y = y; };

  p.setSpeed = function(s){ this.sX =s ; };

  p.update = function() 
  {
    const PW = this.width;
    var nX = this.x;
	
    if (this.movingLeft) { 
      nX = nX-this.sX; 
	  if ( nX < xL ) 
	  { nX = xL; };
    }
	
	if (this.movingRight) { 
      nX = nX+this.sX; 
	  if ( nX+PW > xR ) 
	  { nX = xR-PW; };
    }
    this.nX = nX; 
  };

  p.collider = function() {
    return {
      xL:this.nX, xR:this.nX + this.width,
      yT:this.y, yB:this.y + this.height
    };
  };

  p.render = function(){ this.x = this.nX; };

  window.Paddle = createjs.promote(Paddle,"Shape");

}());

