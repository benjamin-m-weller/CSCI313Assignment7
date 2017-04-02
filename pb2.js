
const BW = 76, BH = 20; // brick width and height

var bricks = [];
var level = 0; // used by addLevel and newLevel



var levels = [
  {color:"#705000", points: 1},
  {color:"#743fab", points: 2},
  {color:"#4f5e04", points: 3},
  {color:"#1b5b97", points: 4},
  {color:"#c6c43b", points: 5},
  {color:"#1a6d68", points: 6},
  {color:"#aa7223", points: 7},
  {color:"#743fab", points: 8},
  {color:"#4f5e04", points: 9},
  {color:"#1b5b97", points:10},
  {color:"#c6c43b", points:11},
  {color:"#1a6d68", points:12}
];

function addLevel(x,y) {
  const Y_SHIFT = 4*BH;
  //
  if ( level > 0 ) { moveBricks(Y_SHIFT); }
  newLevel(x,y);
  level = level + 1;
}

function moveBricks(yShift) {
  var i, brick;
  var len = bricks.length;
  for (i=0; i<len; i++) {
    brick = bricks[i];
    brick.y += yShift;
  }
}

function newLevel(x,y) {
  const BRICKS_PER_ROW = 10;
  //
  var c = levels[level].color;
  var p = levels[level].points;
  var i;
  for (i=0; i<BRICKS_PER_ROW; i++) {
    buildBrick(x,y,c,p);
    buildBrick(x,y+BH,c,p);
    x = x + BW;
  }
}

function buildBrick(x,y,c,p) {
  var s = new createjs.Shape();
  var g = s.graphics;
  g.beginFill(c);
  g.drawRect(0+1,0+1,BW-1,BH-1);
  s.x = x;
  s.y = y;
  s.points = p;
  s.collider = Brick_collider;
  stage.addChild(s);
  bricks.push(s);
}

function Brick_collider() {
  return {
    xL:this.x, xR:this.x+BW,
    yT:this.y, yB:this.y+BH
  };
}

function checkBricks() {
  
  
  var p = puck;

  var i, j, brick;
  var n = bricks.length;
  i = 0;
  for (j=0; j<n; j++) {
    brick = bricks[i];
    if ( p.hits(brick) ) 
	{
		createjs.Sound.play("ping");
      stage.removeChild(brick);
      bricks.splice(i,1);
	  //Play sound
	  
    }
    else {
      i++;
    }
  }
  if (bricks.length < n) {
    p.invertYVelocity();
  }
}
