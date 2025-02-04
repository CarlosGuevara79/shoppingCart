// Lista de productos con rutas de imágenes y cantidad disponible
const productos = [
    {
        id: 1,
        nombre: "Tocones Miu Miu",
        Color: "Rojo Vino",
        precio: 199.99,
        cantidadDisponible: 10,
       /* imagen: */
    },
    {
        id: 2,
        nombre: "Zapatilla deportiva Onitsuka Tiger",
        precio: 400,
        Color: "Amarilla",
        cantidadDisponible: 5,
        /* imagen: */
    },
    {
        id: 3,
        nombre: "Mocasines",
        precio: 24.99,
        Color: "Negros",
        cantidadDisponible: 8,
      /* imagen: */
    },
    {
        id: 4,
        nombre: "Zapatillas Nike",
        precio: 169.99,
        Color: "Celeste",
        cantidadDisponible: 15,
       /* imagen: */
    },
    {
        id: 5,
        nombre: "Botines Celine",
        precio: 199.99,
        Color: "Negro",
        cantidadDisponible: 3,
       /*imagen: */
    },
    {
        id: 6,
        nombre: "Zapatillas Converse",
        precio: 149.99,
        Color: "Negro",
        cantidadDisponible: 5,
        /*imagen: */
    },
    {
        id: 7,
        nombre: "Tennis New Balance",
        precio: 149.99,
        Color: "Blancos",
        cantidadDisponible: 10,
       /* imagen: "*/
    },
    {
        id: 8,
        nombre: "Balerinas Dior",
        precio: 529.99,
        Color: "Blanco Perla",
        cantidadDisponible: 10,
      /*  imagen: */
    }
    
];

let carrito = [];

// Renderiza los productos en la página
function renderizarProductos() {
    const productList = document.getElementById('productos');
    productList.innerHTML = ''; // Limpiar la lista antes de agregar productos

    productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 producto';
        productCard.innerHTML = `
            <div class="card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio.toFixed(2)}</p>
                    <p class="card-text">Cantidad disponible: ${producto.cantidadDisponible}</p>
                    <input type="number" min="1" max="${producto.cantidadDisponible}" value="1" id="quantity-${producto.id}" class="form-control mb-2">
                    <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Agrega un producto al carrito
function agregarAlCarrito(productId) {
    const producto = productos.find(p => p.id === productId);
    const cantidad = parseInt(document.getElementById(quantity-${productId}).value);

    if (cantidad > 0 && cantidad <= producto.cantidadDisponible) {
        const productoEnCarrito = carrito.find(p => p.id === productId);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad: cantidad });
        }

        producto.cantidadDisponible -= cantidad;
        actualizarCarrito();
    } else {
        alert("Cantidad no válida.");
    }
}

// Actualiza el carrito de compras
function actualizarCarrito() {
    const cartItems = document.getElementById('carrito');
    cartItems.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const cartItem = document.createElement('li');
        cartItem.className = 'list-group-item cart-item';
        cartItem.innerHTML = `
            <span>${producto.nombre} - ${producto.cantidad} x $${producto.precio.toFixed(2)}</span>
            <span>$${(producto.precio * producto.cantidad).toFixed(2)}</span>
            <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;
        cartItems.appendChild(cartItem);

        total += producto.precio * producto.cantidad;
    });

    document.getElementById('total').textContent = total.toFixed(2);
}

// Elimina un producto del carrito
function eliminarDelCarrito(productId) {
    const producto = carrito.find(p => p.id === productId);
    const productoOriginal = productos.find(p => p.id === productId);
    productoOriginal.cantidadDisponible += producto.cantidad;
    
    carrito = carrito.filter(p => p.id !== productId);
    actualizarCarrito();
    renderizarProductos();
}


// Resto del código permanece igual

// Nueva función para generar la factura
function generarFactura() {
    const facturaDiv = document.getElementById('factura');
    facturaDiv.innerHTML = ''; // Limpiar cualquier factura anterior

    const tituloFactura = document.createElement('h3');
    tituloFactura.textContent = 'Factura de Compra';
    facturaDiv.appendChild(tituloFactura);

    const tabla = document.createElement('table');
    tabla.className = 'table mt-3';

    const encabezado = document.createElement('thead');
    encabezado.innerHTML = `
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
        </tr>
    `;
    tabla.appendChild(encabezado);

    const cuerpoTabla = document.createElement('tbody');

    let totalFactura = 0;
    carrito.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
        `;
        cuerpoTabla.appendChild(fila);
        totalFactura += producto.precio * producto.cantidad;
    });

    tabla.appendChild(cuerpoTabla);

    const filaTotal = document.createElement('tr');
    filaTotal.innerHTML = `
        <td colspan="3" class="text-right font-weight-bold">Total</td>
        <td class="font-weight-bold">$${totalFactura.toFixed(2)}</td>
    `;
    cuerpoTabla.appendChild(filaTotal);

    facturaDiv.appendChild(tabla);
}

// Modificar el evento de clic en el botón "Pagar"
document.getElementById('pagar').addEventListener('click', function() {
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    // Generar factura antes de limpiar el carrito
    generarFactura();

    alert('Pago realizado con éxito.');
    carrito = [];
    actualizarCarrito();
    renderizarProductos();
});

// Inicializa la tienda
renderizarProductos();