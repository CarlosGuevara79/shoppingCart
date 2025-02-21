document.addEventListener("DOMContentLoaded", function () {
    const footer = document.createElement("footer");
    footer.innerHTML = `
        <p>&copy; 2025 Tienda de Zapatos - Todos los derechos reservados.</p>
        <h3>Encuéntranos en nuestras redes sociales:</h3>
        <ul>
            <li>Facebook: Zapateria UDB</li>
            <li>Instagram: Zapateria_udb</li>
        </ul>
    `;
    document.body.appendChild(footer); // Agrega el footer al final del <body>
});