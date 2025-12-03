btnDesencriptar.addEventListener('click', () => {
    resultado.classList.remove('error');
    let key = [
        [parseInt(k11.value) || 0, parseInt(k12.value) || 0],
        [parseInt(k21.value) || 0, parseInt(k22.value) || 0]
    ];
    key = hacerClaveInvertible(key);
    const invKey = matrizInversa(key);

    if (invKey === null) {
        resultado.textContent = 'Error: La clave no es invertible';
        resultado.classList.add('error');
        return;
    }

    const textoOriginal = mensaje.value.toUpperCase();
    const soloLetras = textoOriginal.replace(/[^A-Z]/g, '');

    if (soloLetras.length === 0) {
        resultado.textContent = 'Error: Ingresa un mensaje';
        resultado.classList.add('error');
        return;
    }

    let numeros = soloLetras.split('').map(char => char.charCodeAt(0) - 65);
    
    // Aseguramos que sea par para poder multiplicar matrices
    if (numeros.length % 2 !== 0) numeros.push(23);

    let desencriptado = '';
    for (let i = 0; i < numeros.length; i += 2) {
        const v1 = numeros[i];
        const v2 = numeros[i + 1];
        
        // Fórmula de desencriptado
        const c1 = mod(invKey[0][0] * v1 + invKey[0][1] * v2, 26);
        const c2 = mod(invKey[1][0] * v1 + invKey[1][1] * v2, 26);
        
        desencriptado += String.fromCharCode(65 + c1);
        desencriptado += String.fromCharCode(65 + c2);
    }

    // --- CORRECCIÓN AQUÍ ---
    // Si el texto desencriptado termina en 'X' (el relleno 23), la quitamos.
    // Nota: Esto asume que tu mensaje original no terminaba realmente en X.
    if (desencriptado.endsWith('X')) {
        desencriptado = desencriptado.slice(0, -1);
    }
    // ------------------------

    resultado.textContent = desencriptado;
});
