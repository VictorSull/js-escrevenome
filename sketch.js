let leftPaddle;
let rightPaddle;
let ball;
let leftScore = 0;
let rightScore = 0;

//sons do jogo
  let raquetada;
  let ponto;
  let trilha;
  
  function preload(){
    trilha = loadSound("trilha.mp3");
    ponto = loadSound("ponto.mp3");
    raquetada = loadSound("raquetada.mp3");
  }

function setup() {
  createCanvas(600, 400);
  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
  ball = new Ball();
  trilha.loop();
}

function draw() {
  background(0);
  
  // Desenhar raquetes e bola
  leftPaddle.show();
  rightPaddle.show();
  ball.show();
  
  // Atualizar posições
  leftPaddle.update();
  rightPaddle.update();
  ball.update();
  
  // Verificar colisões
  ball.checkPaddleCollision(leftPaddle);
  ball.checkPaddleCollision(rightPaddle);
  
  // Verificar se a bola sai pela esquerda ou pela direita
  if (ball.isOffScreen()) {
    if (ball.x < 0) {
      rightScore++;
    } else {
      leftScore++;
    }
    ball.reset();
    ponto.play();
  }
  
  // Exibir pontuação
  textAlign(CENTER);
  textSize(32);
  fill(255);
  text(leftScore, width * 0.25, 50);
  text(rightScore, width * 0.75, 50);
}

function keyPressed() {
  // Controles para a raquete esquerda
  if (key === 'W') {
    leftPaddle.move(-1);
  } else if (key === 'S') {
    leftPaddle.move(1);
  }
  
  // Controles para a raquete direita
  if (keyCode === UP_ARROW) {
    rightPaddle.move(-1);
  } else if (keyCode === DOWN_ARROW) {
    rightPaddle.move(1);
  }
}

function keyReleased() {
  // Parar raquete esquerda
  if (key === 'W' || key === 'S') {
    leftPaddle.move(0);
  }
  
  // Parar raquete direita
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    rightPaddle.move(0);
  }
}

class Paddle {
  constructor(isLeft) {
    this.w = 10;
    this.h = 80;
    this.y = height / 2;
    this.isLeft = isLeft;
    this.x = isLeft ? this.w : width - this.w;
    this.speed = 5;
    this.direction = 0;
  }
  
  update() {
    // Movimentar a raquete
    this.y += this.speed * this.direction;
    this.y = constrain(this.y, this.h / 2, height - this.h / 2);
  }
  
  show() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
  
  move(dir) {
    // Definir direção da raquete
    this.direction = dir;
  }
}

class Ball {
  constructor() {
    this.r = 12;
    this.reset();
  }
  
  update() {
    // Movimentar a bola
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    
    // Verificar se a bola bate no topo ou no fundo
    if (this.y - this.r < 0 || this.y + this.r > height) {
      this.ySpeed *= -1;
    }
  }
  
  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }
  
  checkPaddleCollision(paddle) {
    // Verificar colisão com a raquete
    if (this.x - this.r < paddle.x + paddle.w / 2 &&
        this.x + this.r > paddle.x - paddle.w / 2 &&
        this.y - this.r < paddle.y + paddle.h / 2 &&
        this.y + this.r > paddle.y - paddle.h / 2) {
      this.xSpeed *= -1;
      raquetada.play();
    }
  }
  
  isOffScreen() {
    // Verificar se a bola saiu pela esquerda ou pela direita
    return (this.x - this.r > width || this.x + this.r < 0);
  }
  
  reset() {
    // Reiniciar a bola para o centro
    this.x = width / 2;
    this.y = height / 2;
    
    // Velocidade aleatória
    let angle = random(-PI / 4, PI / 4);
    this.xSpeed = 5 * Math.cos(angle);
    this.ySpeed = 5 * Math.sin(angle);
    
    // Direção da bola
    if (random(1) < 0.5) {
      this.xSpeed *= -1;
    }
  }
}
