document.addEventListener("DOMContentLoaded", function () {
    const facturaDiv = document.getElementById('factura');
    
    // Recuperar los datos del carrito
    const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];
    const impuesto = parseFloat(localStorage.getItem("impuesto")) || 0;

    if (productosCarrito.length === 0) {
        facturaDiv.innerHTML = "<h3>No hay productos en la factura.</h3>";
        return;
    }

    let subtotal = 0;

    let tablaHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    productosCarrito.forEach(producto => {
        const totalProducto = producto.precio * producto.cantidad;
        subtotal += totalProducto;

        tablaHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>$${totalProducto.toFixed(2)}</td>
            </tr>
        `;
    });

    // Calcular impuestos y total final
    const impuestoCalculado = subtotal * impuesto;
    const totalFinal = subtotal + impuestoCalculado;

    // Agregar filas de subtotal, impuestos y total
    tablaHTML += `
            <tr>
                <td colspan="3" class="text-right font-weight-bold">Subtotal</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="3" class="text-right font-weight-bold">Impuesto (${(impuesto * 100).toFixed(2)}%)</td>
                <td>$${impuestoCalculado.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="3" class="text-right font-weight-bold">Total</td>
                <td class="font-weight-bold">$${totalFinal.toFixed(2)}</td>
            </tr>
        </tbody>
    </table>
    `;

    facturaDiv.innerHTML = tablaHTML;
});

// ✅ Función para volver a la tienda sin perder productos comprados
function seguirComprando() {
    window.location.href = "index.html";
}

// ✅ Función para descargar la factura en PDF
function descargarFactura() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Factura de Compra", 80, 10);

    let y = 20;

    const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];
    const impuesto = parseFloat(localStorage.getItem("impuesto")) || 0;
    let subtotal = 0;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    productosCarrito.forEach(producto => {
        const totalProducto = producto.precio * producto.cantidad;
        subtotal += totalProducto;

        doc.text(`${producto.nombre} - ${producto.cantidad} x $${producto.precio.toFixed(2)} = $${totalProducto.toFixed(2)}`, 10, y);
        y += 10;
    });

    const impuestoCalculado = subtotal * impuesto;
    const totalFinal = subtotal + impuestoCalculado;

    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, y + 10);
    doc.text(`Impuesto (${(impuesto * 100).toFixed(2)}%): $${impuestoCalculado.toFixed(2)}`, 10, y + 20);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${totalFinal.toFixed(2)}`, 10, y + 30);

    doc.save("factura.pdf");
}
