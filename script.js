const mensaje = document.getElementById('mensaje');
const charCount = document.querySelector('.char-count');
const matrizMensaje = document.getElementById('matrizMensaje');

const k11 = document.getElementById('k11');
const k12 = document.getElementById('k12');
const k21 = document.getElementById('k21');
const k22 = document.getElementById('k22');

const btnEncriptar = document.getElementById('encriptar');
const btnDesencriptar = document.getElementById('desencriptar');

const resultado = document.getElementById('resultado');
const resultadoDes = document.getElementById('resultadoDes');

let mapaOriginal = [];

mensaje.addEventListener('input', () => {
    const len = mensaje.value.length;
    charCount.textContent = `${len}/30`;
    mostrarMatrizMensaje();
});

function mostrarMatrizMensaje() {
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        matrizMensaje.textContent = 'Escribe un mensaje primero...';
        return;
    }

    const valores = texto.split('').map(char => char.charCodeAt(0) - 65);

    let matriz = '[';
    for (let i = 0; i < valores.length; i += 2) {
        if (i > 0) matriz += ' ';

        matriz += '[' + valores[i];

        if (i + 1 < valores.length)
            matriz += ', ' + valores[i + 1];
        else
            matriz += ', 23';

        matriz += ']';
    }
    matriz += ']';

    matrizMensaje.textContent = matriz;
}

function procesar(texto, key) {
    let numeros = texto.split('').map(c => c.charCodeAt(0) - 65);

    if (numeros.length % 2 !== 0) numeros.push(23);

    let salida = '';

    for (let i = 0; i < numeros.length; i += 2) {
        const v1 = numeros[i];
        const v2 = numeros[i + 1];

        const c1 = (key[0][0] * v1 + key[0][1] * v2) % 26;
        const c2 = (key[1][0] * v1 + key[1][1] * v2) % 26;

        const n1 = ((c1 % 26) + 26) % 26;
        const n2 = ((c2 % 26) + 26) % 26;

        salida += String.fromCharCode(65 + n1) + String.fromCharCode(65 + n2);
    }

    return salida;
}

function obtenerKey() {
    const key = [
        [parseInt(k11.value), parseInt(k12.value)],
        [parseInt(k21.value), parseInt(k22.value)]
    ];

    if (key.flat().some(v => Number.isNaN(v))) {
        mostrarError("La matriz clave tiene valores vacíos o inválidos");
        return null;
    }

    return key;
}

function modularInverse(a, m) {
    a = ((a % m) + m) % m;

    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }

    return null;
}

function obtenerMatrizInversa(key) {
    const detRaw = key[0][0] * key[1][1] - key[0][1] * key[1][0];
    const det = ((detRaw % 26) + 26) % 26;
    const detInv = modularInverse(det, 26);

    if (det === 0 || detInv === null) return null;

    const a = key[0][0], b = key[0][1];
    const c = key[1][0], d = key[1][1];

    const inv = [
        [(d * detInv) % 26, ((-b) * detInv) % 26],
        [((-c) * detInv) % 26, (a * detInv) % 26]
    ];

    return inv.map(row => row.map(v => ((v % 26) + 26) % 26));
}

function mostrarError(msg) {
    resultado.textContent = msg;
    resultado.classList.add('error');
}

function generarMapaOriginal(texto) {
    mapaOriginal = [];

    for (let i = 0; i < texto.length; i++) {
        if (/^[A-Za-z]$/.test(texto[i])) {
            mapaOriginal.push({ tipo: 'L', valor: texto[i] });
        } else {
            mapaOriginal.push({ tipo: 'E', valor: texto[i] });
        }
    }
}

function reconstruirFormato(originalMap, textoPlano) {
    let indiceLetra = 0;
    let salida = '';

    for (let item of originalMap) {
        if (item.tipo === 'L') {
            salida += textoPlano[indiceLetra] || '';
            indiceLetra++;
        } else {
            salida += item.valor;
        }
    }

    return salida;
}

btnEncriptar.addEventListener('click', () => {
    resultadoDes.textContent = '';

    const texto = mensaje.value;
    generarMapaOriginal(texto);

    const soloLetras = texto.toUpperCase().replace(/[^A-Z]/g, '');

    if (soloLetras.length === 0) return mostrarError("Ingresa un mensaje con letras");

    const key = obtenerKey();
    if (!key) return;

    resultado.textContent = procesar(soloLetras, key);
    resultado.classList.remove('error');
});

btnDesencriptar.addEventListener('click', () => {
    resultado.classList.remove('error');

    const textoCifrado = (resultado.textContent || '')
        .trim()
        .replace(/[^A-Z]/g, '');

    if (textoCifrado.length === 0)
        return mostrarError("No hay texto encriptado para desencriptar");

    const key = obtenerKey();
    if (!key) return;

    const inversa = obtenerMatrizInversa(key);

    if (!inversa) return mostrarError("La matriz no es invertible");

    const desencriptado = procesar(textoCifrado, inversa);
    const finalConFormato = reconstruirFormato(mapaOriginal, desencriptado);

    resultadoDes.textContent = finalConFormato;
    resultadoDes.classList.remove('error');
});
