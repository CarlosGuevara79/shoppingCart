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
//titulos de las tablas de productos
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
        //tablas de productos.
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

function seguirComprando() {
    // Recuperar el carrito de compras
    let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    if (productosCarrito.length > 0) {
        // Recuperar el inventario de productos
        let productos = JSON.parse(localStorage.getItem("productos")) || [];

        // Restar del stock los productos comprados
        productosCarrito.forEach(productoComprado => {
            const productoEnInventario = productos.find(p => p.id === productoComprado.id);
            if (productoEnInventario) {
                // productoEnInventario.cantidadDisponible -= productoComprado.cantidad;
                if (productoEnInventario.cantidadDisponible < 0) {
                    productoEnInventario.cantidadDisponible = 0; // Evitar stock negativo
                }
            }
        });

        // Guardar los cambios en localStorage
        localStorage.setItem("productos", JSON.stringify(productos));
    }

    // Vaciar el carrito después de la compra
    // localStorage.setItem("productosCarrito", JSON.stringify([]));

    // Redirigir a la página principal
    window.location.href = "index.html";
}

window.finalizarCompra = function finalizarCompra() {
    const impuesto = parseFloat(localStorage.getItem("impuesto")) || 0;

    let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    if (productosCarrito.length === 0) {
        alert("No hay productos en el carrito.");
        return;
    }

    // Obtener historial de compras previas o inicializarlo
    let historialCompras = JSON.parse(localStorage.getItem("historialCompras")) || [];

    // Crear nueva compra con fecha y productos
    const nuevaCompra = {
        fecha: new Date().toLocaleString(),
        productos: productosCarrito,
        subtotal: productosCarrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0),
        total: (productosCarrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0) * impuesto) + productosCarrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0)
    };

    // Agregar nueva compra al historial
    historialCompras.push(nuevaCompra);
    localStorage.setItem("historialCompras", JSON.stringify(historialCompras));

    // Vaciar carrito y actualizar localStorage
    localStorage.removeItem("productosCarrito");
    alert("Compra finalizada con éxito.");
    window.location.href = "index.html"; // Redirigir a la página principal
};

window.verInventarioCompras = function verInventarioCompras() {
    let historialCompras = JSON.parse(localStorage.getItem("historialCompras")) || [];
    const historialDiv = document.getElementById("historialCompras");
    historialDiv.innerHTML = "<h3>Historial de Compras</h3>";

    if (historialCompras.length === 0) {
        historialDiv.innerHTML += "<p>No hay compras registradas.</p>";
        return;
    }

    historialCompras.forEach((compra, index) => {
        let compraHTML = `<div class="card mt-3">
            <div class="card-body">
                <h5 class="card-title">Compra ${index + 1} - ${compra.fecha}</h5>
                <ul class="list-group">`;

        compra.productos.forEach(producto => {
            compraHTML += `<li class="list-group-item">
                ${producto.nombre} - ${producto.cantidad} x $${producto.precio.toFixed(2)}
                = $${(producto.precio * producto.cantidad).toFixed(2)}
            </li>`;
        });

        compraHTML += `</ul>
                <p class="fw-bold mt-2">Total: $${compra.total.toFixed(2)}</p>
            </div>
        </div>`;
        
        historialDiv.innerHTML += compraHTML;
    });
};



// Función para descargar la factura en PDF
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
