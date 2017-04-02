var stage,puck,paddle,board,messageTxt; // game objects


function load() 
{
	var queue = new createjs.LoadQueue(false);
	queue.installPlugin(createjs.Sound);
	queue.addEventListener("complete",init);
	queue.loadManifest([{id:"ping", src:"ping.mp3"}]);
	
  //init();
}

function init() {
  stage = new createjs.Stage("canvas");
  game_build();
  setControls();
  addMessageText();
  game_start();
}

function game_build() {

  // dimensions
  const CW = 800, CH = 700;   // canvas width and height
  const WT = 20;              // wall thickness
  const MH = 50;              // message board height

  // play area bounds
  const WL = WT, WR = CW-WT;  // left and right
  const CEILING = WT;
  const FLOOR = CH-MH;

  function buildPuck() {
    const PX = CW-100; // x position
    const PY = 160;    // y position
    const PS = 5;      // speed
    //
    Puck_setMoveBounds(WL,WR,CEILING,FLOOR);
    var p = new Puck();
    p.setPosition(PX,PY);
    p.setVelocity(PS,PS);
    stage.addChild(p);
    puck = p;
  }

  function buildPaddle() {
    const PC = "#3E6DC0"; // color
    const PW = 100;       // width
    const PH = 20;        // height
    const PX = 20;        // x position
    const PY = FLOOR-PH;  // y position
    const PS = 16;        // speed
    //
    Paddle_setMoveBounds(WL,WR);
    var p = new Paddle(PC,PW,PH);
    p.setPosition(PX,PY);
    p.setSpeed(PS);
    stage.addChild(p);
    paddle = p;
  }

  function buildWalls() {
    const WC = "#333"; // color
    //
    var wL = new_wall(WC,WT,CH,0,0);
    var wR = new_wall(WC,WT,CH,WR,0);
    var wT = new_wall(WC,CW,WT,0,0);
    var wB = new_wall(WC,CW,MH,0,FLOOR);
    stage.addChild(wL,wR,wT,wB);
    //
    board = wB;
    board.setBounds(0,FLOOR,CW,MH); // for messageTxt
  }

  function buildBricks() {
    addLevel(WT,WT);
    addLevel(WT,WT);
  }

  buildPuck();
  buildPaddle();
  buildWalls();
  buildBricks();
}

function new_wall(color,width,height,x,y) {
  var s = new createjs.Shape();
  var g = s.graphics;
  g.beginFill(color);
  g.drawRect(0,0,width,height);
  s.x = x;
  s.y = y;
  return s;
}

function setControls() {
  window.onkeydown = handleKeyDown;
  window.onkeyup   = handleKeyUp;
}

function handleKeyDown(e){
  switch (e.keyCode) {
    case 37:
	paddle.movingLeft = true;
	break;
    case 39: 
	paddle.movingRight = true; 
	break;
	
    case 32:
      if ( createjs.Ticker.getPaused() ) {
        createjs.Ticker.setPaused( false );
        messageTxt.text = "press spacebar to pause";
      }
      else {
        createjs.Ticker.setPaused( true );
        messageTxt.text = "press spacebar to resume";
        stage.update(); // force message to be drawn
      }
      break;
  }
}

function handleKeyUp(e) {
  switch (e.keyCode) {
    case 37:   
	paddle.movingLeft = false; 
	break;
    case 39: 
	paddle.movingRight = false; 
	break;
  }
}

function addMessageText() {
  const TM = "press spacebar to pause";
  const TF = "18px Times";  // font
  const TC = "#FFF";        // color
  //
  var t = new createjs.Text(TM,TF,TC);
  t.textAlign = "center";
  t.x = board.getBounds().width/2;
  t.y = board.y + 12;
  stage.addChild(t);
  messageTxt = t;
}

function game_start() {
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick",game_step);
}

function game_step(e) {
  if (!e.paused) {
    game_update();
    game_render();
    stage.update();
  }
}

function game_update() {
  puck.update();
  paddle.update();
  //
  checkPaddle();
  checkBricks();
}

function checkPaddle() {
  var p = puck;
  var q = paddle;
  //
  if ( p.isMovingDown() && p.hitsTopOf(q) ) {
    p.bounceUpFrom(q);
  };
}

function game_render() {
  puck.render();
  paddle.render();
}