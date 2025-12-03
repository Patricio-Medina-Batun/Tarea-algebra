
### Cifrado Hill: Encriptador y Desencriptador Web

## Descripción del Proyecto

Este proyecto es una aplicación web interactiva que implementa el **Cifrado Hill**, un algoritmo de criptografía de sustitución poligráfica basado en el álgebra lineal. La herramienta permite a los usuarios encriptar y desencriptar mensajes de texto utilizando una matriz clave de 2x2.

El sistema transforma el texto plano en vectores numéricos y los multiplica por una matriz clave para generar el texto cifrado, manejando automáticamente la aritmética modular necesaria para asegurar que el resultado se mantenga dentro del alfabeto estándar.

## Instrucciones de Uso

Para utilizar la herramienta, sigue estos pasos:

1.  **Ingresar el Mensaje:**
    * Escribe tu texto en el campo de "Mensaje".
    * El sistema filtrará automáticamente caracteres no válidos, dejando solo letras (A-Z).
    * Observarás en tiempo real cómo tu texto se convierte en pares de números en el panel de visualización de matrices.

2.  **Configurar la Clave (Matriz 2x2):**
    * Introduce 4 números enteros en los campos de la matriz clave ($k_{11}, k_{12}, k_{21}, k_{22}$).
    * **Nota:** No te preocupes si la clave no es matemáticamente válida (no invertible); el sistema cuenta con un algoritmo de corrección automática.

3.  **Encriptar:**
    * Presiona el botón **"Encriptar"**.
    * El resultado aparecerá en el cuadro inferior. Si la longitud del mensaje es impar, el sistema agregará automáticamente una 'X' al final para completar el par necesario para la operación matricial.

## Matemáticas Detrás de la Implementación

El núcleo del proyecto se basa en aritmética modular y operaciones matriciales sobre el alfabeto inglés (26 caracteres).

### 1. El Alfabeto y Módulo
Se utiliza el módulo **26**. Cada letra se mapea a un número:
`A=0, B=1, ..., Z=25`.

### 2. Encriptación
El mensaje se divide en vectores de 2 elementos ($v_1, v_2$). La fórmula de encriptación para cada par es:

$$
\begin{pmatrix} C_1 \\ C_2 \end{pmatrix} = \begin{pmatrix} k_{11} & k_{12} \\ k_{21} & k_{22} \end{pmatrix} \begin{pmatrix} P_1 \\ P_2 \end{pmatrix} \pmod{26}
$$

Donde $C$ es el carácter cifrado y $P$ es el carácter plano.

### 3. Matriz Inversa y Desencriptación
Para desencriptar, se requiere la **matriz inversa** de la clave ($K^{-1}$). El cálculo matemático implementado sigue estos pasos:

1.  **Determinante ($\Delta$):** Se calcula $\Delta = (ad - bc) \pmod{26}$.
2.  **Inverso Modular del Determinante:** Se busca un número $x$ tal que $(\Delta \cdot x) \equiv 1 \pmod{26}$. Si este número no existe (porque $\Delta$ es 0 o comparte factores comunes con 26), la matriz no tiene inversa.
3.  **Matriz Adjunta:** Se intercambian $a$ y $d$, y se niegan $b$ y $c$.
4.  **Fórmula Final:** $K^{-1} = \Delta^{-1} \cdot \text{Adj}(K) \pmod{26}$.

## Personalización y Características Únicas

Este código incluye personalizaciones avanzadas para mejorar la experiencia de usuario y la robustez del algoritmo:

### 1. Algoritmo de Auto-Corrección de Claves (`hacerClaveInvertible`)
Una de las características más destacadas es la función `hacerClaveInvertible`. En el Cifrado Hill, si el usuario ingresa una matriz cuyo determinante es 0 o comparte factores con 26 (es par o múltiplo de 13), el mensaje matemático no se puede revertir.

* **Funcionamiento:** Antes de encriptar, el código valida si la clave ingresada tiene inversa modular.
* **Corrección:** Si la clave es inválida, el algoritmo ajusta iterativamente los valores de la matriz ($d$, luego $c$, $b$, y $a$) sumando +1 hasta encontrar una combinación que **sí** sea matemáticamente invertible. Esto evita errores de ejecución y garantiza que el cifrado siempre funcione.

### 2. Visualización de Matriz en Tiempo Real
El código incluye una función (`mostrarMatrizMensaje`) que traduce visualmente el texto escrito a su representación vectorial `[num, num]` en tiempo real. Esto permite al usuario visualizar la transformación de "Texto" a "Matriz" antes de que ocurra el cifrado.

### 3. Padding Automático
El Cifrado Hill requiere bloques de texto exactos (pares para matrices 2x2). El código detecta si el mensaje tiene una longitud impar y agrega automáticamente el carácter **'X' (valor 23)** al final para completar la matriz y permitir la multiplicación matricial sin errores.
