//INTEGRANTES
//JESUS ENRIQUE CRUZ MORENO, JORGE FRANCISCO ANGULO FLORES

let zonaHoraria = [0, +1, +9];
let horaDef = 0;
let minutoDef = 0;
let inputTime;
let inputButton;

function setup() {
  createCanvas(600, 200);
  angleMode(DEGREES);

  inputTime = createInput("", "text");
  inputTime.position(20, height + 20);

  inputButton = createButton('Actualizar Hora');
  inputButton.position(inputTime.x + inputTime.width + 10, height + 20);
  inputButton.mousePressed(actualizarRelojs);
  inputTime.changed(actualizarRelojs);
}

function draw() {
  background(255);
  let now = new Date();
  now.setHours(now.getHours() + horaDef);
  now.setMinutes(now.getMinutes() + minutoDef);

  dibujarReloj(100, 100, now.getHours(), now.getMinutes(), now.getSeconds(), 0, "La Paz");
  dibujarReloj(300, 100, (now.getHours() + zonaHoraria[1]) % 24, (now.getMinutes() + zonaHoraria[1] * 60) % 60, now.getSeconds(), 1, "CDMX");
  dibujarReloj(500, 100, (now.getHours() + zonaHoraria[2]) % 24, (now.getMinutes() + zonaHoraria[2] * 60) % 60, now.getSeconds(), 2, "Barcelona");
}


function PuntoBresenham(x0, y0, x1, y1, color) {
  let dx = abs(x1 - x0);
  let sx = x0 < x1 ? 1 : -1;
  let dy = -abs(y1 - y0);
  let sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let e2;

  stroke(color);
  strokeWeight(2);

  // Asegurarse de que el bucle no sea infinito
  let safetyCounter = 0;

  while (true) {
    point(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }

    // Verificación de seguridad para evitar bucles infinitos
    if (safetyCounter++ > 30) {
     // console.error('Bucle infinito detectado');
      break;
    }
  }
}

function PuntoPendiente(x, y, angle, length, color) {
  let endX = x + cos(angle) * length;
  let endY = y + sin(angle) * length;

  stroke(color);
  strokeWeight(2);
  line(x, y, endX, endY);
}

function DDA(x, y, angle, length, color) {
  let endX = x + cos(angle) * length;
  let endY = y + sin(angle) * length;

  let dx = endX - x;
  let dy = endY - y;
  let steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);
  let Xincrement = dx / steps;
  let Yincrement = dy / steps;

  stroke(color);
  strokeWeight(2);
  let X = x;
  let Y = y;
  for (let i = 0; i <= steps; i++) {
    point(X, Y);
    X += Xincrement;
    Y += Yincrement;
  }
}

function dibujarReloj(x, y, h, m, s, type, city) {
  stroke(0);
  noFill();
  ellipse(x, y, 140, 140);

  fill(0);
  ellipse(x, y, 4, 4);

  textSize(14);
  textAlign(CENTER, CENTER);
  fill(0);
  text(city, x, y - 80);

  for (let i = 0; i < 12; i++) {
    let num = (11 + i + 12) % 12 + 1;
    let angle = map(i, 0, 12, 0, 360) - 90;
    let numX = x + cos(angle) * 60;
    let numY = y + sin(angle) * 60;
    text(num, numX, numY);
  }

  //LA PAZ
  if (type === 0) {
    PuntoPendiente(x, y, map(s, 0, 60, 0, 360) - 90, 45, color(255, 0, 0));
    PuntoPendiente(x, y, map(m, 0, 60, 0, 360) - 90 + map(s, 0, 60, 0, 360) / 60, 45, color(0));
    PuntoPendiente(x, y, map(h % 12, 0, 12, 0, 360) - 90 + map(m, 0, 60, 0, 360) / 12, 30, color(0));
    
  //CDMX
  } else if (type === 1) {
    DDA(x, y, map(s, 0, 60, 0, 360) - 90, 45, color(255, 0, 0));
    DDA(x, y, map(m, 0, 60, 0, 360) - 90 + map(s, 0, 60, 0, 360) / 60, 45, color(0));
    DDA(x, y, map(h % 12, 0, 12, 0, 360) - 90 + map(m, 0, 60, 0, 360) / 12, 30, color(0));
    
  //BARCELONA
  } else {
    PuntoBresenham(x, y, x + cos(map(s, 0, 60, 0, 360) - 90) * 45, y + sin(map(s, 0, 60, 0, 360) - 90) * 45, color(255, 0, 0));
    PuntoBresenham(x, y, x + cos(map(m, 0, 60, 0, 360) - 90 + map(s, 0, 60, 0, 360) / 60) * 45, y + sin(map(m, 0, 60, 0, 360) - 90 + map(s, 0, 60, 0, 360) / 60) * 45, color(0));
    PuntoBresenham(x, y, x + cos(map(h % 12, 0, 12, 0, 360) - 90 + map(m, 0, 60, 0, 360) / 12) * 30, y + sin(map(h % 12, 0, 12, 0, 360) - 90 + map(m, 0, 60, 0, 360) / 12) * 30, color(0));
  }
}

function actualizarRelojs() {
  let inputString = inputTime.value();
  if (validarHora(inputString)) {
    let inputComponents = inputString.split(":");
    let horaNueva = int(inputComponents[0]);
    let minutoNuevo = int(inputComponents[1]);

    let now = new Date();
    let horaActual = now.getHours();
    let minutoActual = now.getMinutes();
    let diferenciaHoras = horaNueva - horaActual;
    let diferenciaMinutos = minutoNuevo - minutoActual;

    horaDef = diferenciaHoras;
    minutoDef = diferenciaMinutos;
  } else {
    console.log("Ingresar una hora válida (formato HH:MM, de 01:00 a 12:00).");
  }
}

function validarHora(horaIngresada) {
  if (horaIngresada.match(/^((0?[1-9]|1[0-2]):([0-5]\d))$/)) {
    return true;
  } else {
    return false;
  }
}
