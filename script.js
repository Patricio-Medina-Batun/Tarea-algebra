const mensaje = document.getElementById('mensaje');
const charCount = document.querySelector('.char-count');
const matrizMensaje = document.getElementById('matrizMensaje');
const k11 = document.getElementById('k11');
const k12 = document.getElementById('k12');
const k21 = document.getElementById('k21');
const k22 = document.getElementById('k22');
const btnEncriptar = document.getElementById('encriptar');
const resultado = document.getElementById('resultado');

// Actualizar contador de caracteres
mensaje.addEventListener('input', () => {
    const len = mensaje.value.length;
    charCount.textContent = `${len}/30`;
    mostrarMatrizMensaje();
});

// Mostrar matriz del mensaje
function mostrarMatrizMensaje() {
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        matrizMensaje.textContent = 'Escribe un mensaje primero...';
        return;
    }
    
    const valores = texto.split('').map(char => char.charCodeAt(0) - 65);
    
    // Agrupar en pares
    let matriz = '[';
    for (let i = 0; i < valores.length; i += 2) {
        if (i > 0) matriz += ' ';
        matriz += '[' + valores[i];
        if (i + 1 < valores.length) {
            matriz += ', ' + valores[i + 1];
        } else {
            matriz += ', ' + (valores.length % 2 === 0 ? '' : '23'); // Padding con 'X'
        }
        matriz += ']';
    }
    matriz += ']';
    
    matrizMensaje.textContent = matriz;
}

// Función de encriptación Hill
btnEncriptar.addEventListener('click', () => {
    // Validar inputs
    const key = [
        [parseInt(k11.value) || 0, parseInt(k12.value) || 0],
        [parseInt(k21.value) || 0, parseInt(k22.value) || 0]
    ];
    
    if (key[0][0] === 0 && key[0][1] === 0 && key[1][0] === 0 && key[1][1] === 0) {
        resultado.textContent = 'Error: Ingresa una matriz clave válida';
        resultado.classList.add('error');
        return;
    }
    
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        resultado.textContent = 'Error: Ingresa un mensaje';
        resultado.classList.add('error');
        return;
    }
    
    // Calcular determinante
    const det = (key[0][0] * key[1][1] - key[0][1] * key[1][0]) % 26;
    
    if (det === 0) {
        resultado.textContent = 'Error: La matriz no es invertible (determinante = 0)';
        resultado.classList.add('error');
        return;
    }
    
    // Convertir texto a números
    let numeros = texto.split('').map(char => char.charCodeAt(0) - 65);
    
    // Agregar padding si es impar
    if (numeros.length % 2 !== 0) {
        numeros.push(23); // 'X'
    }
    
    // Encriptar
    let encriptado = '';
    for (let i = 0; i < numeros.length; i += 2) {
        const v1 = numeros[i];
        const v2 = numeros[i + 1];
        
        const c1 = (key[0][0] * v1 + key[0][1] * v2) % 26;
        const c2 = (key[1][0] * v1 + key[1][1] * v2) % 26;
        
        encriptado += String.fromCharCode(65 + c1);
        encriptado += String.fromCharCode(65 + c2);
    }
    
    resultado.classList.remove('error');
    resultado.textContent = encriptado;

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

// ============ UTILIDADES MATEMÁTICAS ============

function mod(n, m) {
    return ((n % m) + m) % m;
}

function det2x2(mat) {
    return mod(mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0], 26);
}

function inversoMod26(a) {
    a = mod(a, 26);
    for (let i = 1; i < 26; i++) {
        if (mod(a * i, 26) === 1) return i;
    }
    return null;
}

function matrizInversa(key) {
    const det = det2x2(key);
    const detInv = inversoMod26(det);
    if (detInv === null) return null;

    const a = key[0][0], b = key[0][1];
    const c = key[1][0], d = key[1][1];

    // Inversa 2x2: (1/det) * [[d, -b], [-c, a]] mod 26
    return [
        [mod(detInv * d, 26), mod(detInv * -b, 26)],
        [mod(detInv * -c, 26), mod(detInv * a, 26)]
    ];
}

// Hace que la clave SIEMPRE sea invertible módulo 26
function hacerClaveInvertible(key) {
    // Normalizar elementos a 0..25
    let a = mod(key[0][0], 26);
    let b = mod(key[0][1], 26);
    let c = mod(key[1][0], 26);
    let d = mod(key[1][1], 26);

    let base = [
        [a, b],
        [c, d]
    ];

    if (inversoMod26(det2x2(base)) !== null) {
        return base;
    }

    // Probar ajustar solo 'd'
    for (let delta = 1; delta < 26; delta++) {
        let d2 = mod(d + delta, 26);
        let k = [
            [a, b],
            [c, d2]
        ];
        if (inversoMod26(det2x2(k)) !== null) {
            return k;
        }
    }

    // Probar ajustar 'c'
    for (let delta = 1; delta < 26; delta++) {
        let c2 = mod(c + delta, 26);
        let k = [
            [a, b],
            [c2, d]
        ];
        if (inversoMod26(det2x2(k)) !== null) {
            return k;
        }
    }

    // Probar ajustar 'b'
    for (let delta = 1; delta < 26; delta++) {
        let b2 = mod(b + delta, 26);
        let k = [
            [a, b2],
            [c, d]
        ];
        if (inversoMod26(det2x2(k)) !== null) {
            return k;
        }
    }

    // Probar ajustar 'a'
    for (let delta = 1; delta < 26; delta++) {
        let a2 = mod(a + delta, 26);
        let k = [
            [a2, b],
            [c, d]
        ];
        if (inversoMod26(det2x2(k)) !== null) {
            return k;
        }
    }

    // Si nada funcionó (caso ultra raro), usar una clave fija válida
    return [
        [3, 3],
        [2, 5]
    ];
}

// ============ LÓGICA DE INTERFAZ ============

// Actualizar contador de caracteres
mensaje.addEventListener('input', () => {
    const len = mensaje.value.length;
    charCount.textContent = `${len}/30`;
    mostrarMatrizMensaje();
});

// Mostrar matriz del mensaje (solo letras, sin espacios)
function mostrarMatrizMensaje() {
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        matrizMensaje.textContent = 'Escribe un mensaje primero...';
        return;
    }
    
    const valores = texto.split('').map(char => char.charCodeAt(0) - 65);
    
    // Agrupar en pares
    let matriz = '[';
    for (let i = 0; i < valores.length; i += 2) {
        if (i > 0) matriz += ' ';
        const v1 = valores[i];
        const v2 = (i + 1 < valores.length) ? valores[i + 1] : 23; // padding con 'X'
        matriz += `[${v1}, ${v2}]`;
    }
    matriz += ']';
    
    matrizMensaje.textContent = matriz;
}

// ============ ENCRIPTAR (respetando espacios) ============

btnEncriptar.addEventListener('click', () => {
    resultado.classList.remove('error');

    let key = [
        [parseInt(k11.value) || 0, parseInt(k12.value) || 0],
        [parseInt(k21.value) || 0, parseInt(k22.value) || 0]
    ];

    // Convertimos la clave en una clave siempre válida
    key = hacerClaveInvertible(key);
    
    const textoOriginal = mensaje.value.toUpperCase();
    const soloLetras = textoOriginal.replace(/[^A-Z]/g, '');
    
    if (soloLetras.length === 0) {
        resultado.textContent = 'Error: Ingresa un mensaje';
        resultado.classList.add('error');
        return;
    }
    
});
