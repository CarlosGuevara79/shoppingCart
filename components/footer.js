document.addEventListener("DOMContentLoaded", function () {
    const footer = document.createElement("footer");
    footer.innerHTML = `
        <p>&copy; 2025 UDB Boutique - Todos los derechos reservados.</p>
        <h3>Encuéntranos en nuestras redes sociales:</h3>
        <ul>
            <li>Facebook: UDB Boutique</li>
            <li>Instagram: UDB_boutique</li>
        </ul>
    `;
    document.body.appendChild(footer); // Agrega el footer al final del <body>
});