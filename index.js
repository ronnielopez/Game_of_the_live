var canvas;
var context;
var canvasAlto = 500;
var canvasAncho = 500;

var matriz;
var filas = 25;
var columnas = 25;

var colorVivo = "#02FFFF";
var colorMuerto = "#252525";

var dibuja = false;

var xAnchoCasilla = canvasAncho / columnas;
var yAltoCasilla = canvasAlto / filas;

var timer;
var refrescoFps = 10;
var gridActiva = true;

$(document).ready(function () {
    cargarConfiguracinInicial();
});

function cargarConfiguracinInicial() {
    canvas = document.getElementById("matrizJuego");
    context = canvas.getContext("2d");
    canvas.widhth = canvasAncho;
    canvas.height = canvasAlto;
    matriz = construirMatriz(filas, columnas);
    cargarMatriz(matriz);
    grid(canvasAncho, canvasAlto, xAnchoCasilla, yAltoCasilla);

    canvas.addEventListener('mousedown', () => {
        dibuja = true;
    });

    canvas.addEventListener('mousemove', event => {
        if (dibuja) {
            let xPixel = event.offsetX - 10;
            let yPixel = event.offsetY - 10;
            let xColumna = Math.floor(xPixel / xAnchoCasilla);
            let yFila = Math.floor(yPixel / yAltoCasilla);

            const desdePosicionX = xColumna * xAnchoCasilla;
            const desdePosicionY = yFila * yAltoCasilla;

            matriz[xColumna][yFila] = colorVivo;

            context.fillStyle = matriz[xColumna][yFila];
            context.fillRect(desdePosicionX, desdePosicionY, xAnchoCasilla, yAltoCasilla);
        }
    });

    canvas.addEventListener('mouseup', () => {
        dibuja = false;
    });
}


function construirMatriz(filas, columnas) {
    let array = new Array(filas);
    for (let i = 0; i < filas; i++) {
        array[i] = new Array(columnas);
    }
    return array;
}

function cargarMatriz(matriz) {
    for (let x = 0; x < filas; x++) {
        for (let y = 0; y < columnas; y++) {
            matriz[x][y] = colorMuerto;
            context.fillStyle = matriz[x][y];

            let X = x * xAnchoCasilla;
            let Y = y * yAltoCasilla;

            context.fillRect(X, Y, xAnchoCasilla, yAltoCasilla);
        }
    }
}

$("#iniciar").on("click", function () {
    timer = setInterval(() => { refresh(); }, 1000 / refrescoFps);
})


$("#reiniciar").on("click", function () {
    location.reload();
})

function grid(canvasAncho, canvasAlto, xAnchoCasilla, yAltoCasilla) {
    if (gridActiva) {
        for (x = 0; x <= canvasAncho; x += xAnchoCasilla) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasAlto);
            for (y = 0; y <= canvasAlto; y += yAltoCasilla) {
                context.moveTo(0, y);
                context.lineTo(canvasAncho, y);
            }
        }
        context.strokeStyle = "#014C4F";
        context.stroke();
    }
}

function refresh() {
    recalcularEscenario(matriz);
}

function recalcularEscenario(matriz) {
    var temporal = construirMatriz(filas, columnas);
    let estadoVivo = 0;
    for (let x = 0; x < columnas; x++) {
        for (let y = 0; y < filas; y++) {
            let colorEvaluacion = matriz[x][y];
            var vecinosVivos = 0;
            vecinosVivos += evalua(x - 1, y - 1); //1
            vecinosVivos += evalua(x, y - 1); //2
            vecinosVivos += evalua(x + 1, y - 1); //3
            vecinosVivos += evalua(x - 1, y); //4
            vecinosVivos += evalua(x - 1, y + 1); //5
            vecinosVivos += evalua(x, y + 1); //6
            vecinosVivos += evalua(x + 1, y + 1); //7
            vecinosVivos += evalua(x + 1, y); //8

            if (colorEvaluacion == colorVivo) {
                if (vecinosVivos < 2 || vecinosVivos > 3) {
                    temporal[x][y] = colorMuerto;
                } else {
                    temporal[x][y] = colorVivo;
                }
            } else if (colorEvaluacion == colorMuerto) {
                if (vecinosVivos == 3) {
                    temporal[x][y] = colorVivo;
                } else {
                    temporal[x][y] = colorMuerto;
                }
            }

        }
    }

    for (let x = 0; x < columnas; x++) {
        for (let y = 0; y < filas; y++) {
            matriz[x][y] = temporal[x][y];
            context.fillStyle = matriz[x][y];
            let X = x * xAnchoCasilla;
            let Y = y * yAltoCasilla;
            context.fillRect(X, Y, xAnchoCasilla, yAltoCasilla);
        }
    }

    grid(canvasAncho, canvasAlto, xAnchoCasilla, yAltoCasilla);

}


function evalua(xColumna, yFila) {

    if (xColumna > 0 && yFila > 0) {
        if (xColumna < matriz.length && yFila < matriz.length) {
            if (matriz[xColumna][yFila] != null && matriz[xColumna][yFila] != "undefined") {
                if (matriz[xColumna][yFila] === colorVivo) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }
    }
}


$("#borrar").on("click", function () {
    clearInterval(timer);
})

