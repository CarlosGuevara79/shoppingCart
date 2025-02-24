// Lista de productos con rutas de imágenes y cantidad disponible
import { productos as productosBase} from "./data/productos.js";
// import { productos} from "./data/productos.js";

const carrito = document.getElementById('carrito');
const abrirCarritoBtn = document.getElementById('abrirCarrito');
const cerrarCarritoBtn = document.getElementById('cerrarCarrito');

let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Si no hay productos en localStorage, cargar desde el archivo externo (asegúrate de incluir data/productos.js en tu HTML antes que este script)
if (productos.length === 0 && window.productosData) {
    productos = [...window.productosData]; // Asumiendo que data/productos.js define "window.productosData"
    localStorage.setItem("productos", JSON.stringify(productos)); // Guardar en localStorage
}


// Renderiza los productos en la página
// let productosCarrito = [];
function showProducts() {
    const productList = document.getElementById('productos');
    productList.innerHTML = ''; // Limpiar la lista antes de agregar productos

    // Obtener productos de localStorage o usar productosBase si está vacío
    if (!productos || productos.length === 0) {
        productos = productosBase;
        localStorage.setItem("productos", JSON.stringify(productosBase));
    }

    productos.forEach(producto => {
        const agotado = producto.cantidadDisponible === 0;
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 producto';

        productCard.innerHTML = `
        <div class="card">
            <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">$${producto.precio.toFixed(2)}</p>
                <p class="card-text ${agotado ? 'text-danger fw-bold' : ''}">
                    ${agotado ? 'Agotado' : `Cantidad disponible: ${producto.cantidadDisponible}`}
                </p>
                <input type="number" 
                onkeydown="return filtro(event)" 
                oninput="validarCantidad(this)" 
                max="${producto.cantidadDisponible}" 
                value="${agotado ? '0' : '1'}" 
                id="quantity-${producto.id}" 
                class="form-control mb-2"
                ${agotado ? 'disabled' : ''}>
                <button class="btn btn-primary" 
                    onclick="addToCart(${producto.id})"
                    ${agotado ? 'disabled' : ''}>
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
        productList.appendChild(productCard);
    });
}


// Evita que se escriban letras, signos y decimales
 // Evita que se ingresen valores no validos
window.filtro = function filtro(event) {
    // Permitir solo números (0-9), teclas de navegación y Backspace
    if (
        event.key >= '0' && event.key <= '9' ||
        event.key === 'Backspace' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Delete'
    ) {
        return true;
    }
    event.preventDefault();
    return false;
}

// Evita que se ingresen valores no validos
window.validarCantidad = function validarCantidad(input) {
    input.value = input.value.replace(/[^0-9]/g, ''); // Elimina todo lo que no sea número
    let max = parseInt(input.max);
    let min = parseInt(input.min);

    if (input.value === '' || isNaN(input.value)) {
        input.value = min; // Si queda vacío, se coloca el mínimo permitido
    } else if (parseInt(input.value) > max) {
        alert("Cantidad no válida el maximo es: " +max);
        input.value = max; // No permite superar el máximo disponible
    } else if (parseInt(input.value) < min) {
        input.value = min; // No permite valores menores al mínimo
    }
}



// Agrega un producto al carrito
window.addToCart = function addToCart(productId) {
    const cantidadInput = document.getElementById(`quantity-${productId}`);
    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad < 1) {
        alert("Cantidad no válida.");
        return;
    }

    // Obtener productos del localStorage (para asegurarnos de estar actualizados)
    let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];
    let producto = productos.find(p => p.id === productId);

    if (!producto || cantidad > producto.cantidadDisponible) {
        alert("No hay suficiente stock disponible.");
        return;
    }

    let productoEnCarrito = productosCarrito.find(p => p.id === productId);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
    } else {
        productosCarrito.push({ ...producto, cantidad: cantidad });
    }

    // Reducir stock disponible
    producto.cantidadDisponible -= cantidad;

    // Guardar en localStorage
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));

    // Actualizar UI
    updateCart();
    showProducts();
};



// Actualiza el carrito de compras
window.updateCart = function updateCart() {
    const cartItems = document.getElementById('productosCarrito');
    cartItems.innerHTML = '';
    let total = 0;

    let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    productosCarrito.forEach(producto => {
        const cartItem = document.createElement('li');
        cartItem.className = 'list-group-item cart-item';
        cartItem.innerHTML = `
            <span>${producto.nombre} - ${producto.cantidad} x $${producto.precio.toFixed(2)}</span>
            <span>$${(producto.precio * producto.cantidad).toFixed(2)}</span>
            <br>
            <button style="background-color: #3CB371;" class="btn btn-success btn-sm" onclick="addToCart(${producto.id})">Añadir</button>
            <button class="btn btn-danger btn-sm" onclick="deleteFromCart(${producto.id})">Eliminar</button>

        `;
        cartItems.appendChild(cartItem);

        total += producto.precio * producto.cantidad;
    });

    document.getElementById('total').textContent = total.toFixed(2);
    updateProductCount();//actualiza el contador

    // Guardar carrito en localStorage
    localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
};


// Elimina un producto del carrito
window.deleteFromCart = function deleteFromCart(productId) {
    let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];
    // let productos = JSON.parse(localStorage.getItem("productos")) || [];

    const producto = productosCarrito.find(p => p.id === productId);
    const productoOriginal = productos.find(p => p.id === productId);

    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad--; // Reducir la cantidad en 1
            productoOriginal.cantidadDisponible++; // Devolver stock al inventario
        } else {
            productoOriginal.cantidadDisponible += producto.cantidad; // Devolver stock antes de eliminar
            productosCarrito = productosCarrito.filter(p => p.id !== productId); // Eliminar del carrito
        }
    }

    // Guardar cambios en localStorage
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));

    updateCart(); // Actualizar el carrito
    showProducts(); // Refrescar productos
};


// Vacia el carrito--
window.deleteAllFromCart = function deleteAllFromCart() {
    // Obtener productos del carrito y del inventario desde localStorage
    console.log(localStorage.getItem("productosCarrito"));
    let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Restaura las cantidades disponibles en el inventario
    productosCarrito.forEach(productoCarrito => {
        // Encontrar el producto en el inventario
        const productoOriginal = productos.find(p => p.id === productoCarrito.id);
        if (productoOriginal) {
            // Aumentar la cantidad disponible en el inventario
            productoOriginal.cantidadDisponible += productoCarrito.cantidad;
        }
    });
    // Limpiar el carrito en el localStorage
    localStorage.removeItem("productosCarrito");

    // Guardar los productos actualizados en el inventario en el localStorage
    localStorage.setItem("productos", JSON.stringify(productos));
    // Actualizar la vista
    updateCart();
    showProducts();
    window.location.reload(); // Recarga la página para reflejar los cambios
};



// Nueva función para generar la factura
window.generateInvoice = function generateInvoice() {
    // Obtener productos del carrito desde localStorage
    let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    if (productosCarrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    // Configuración del impuesto (ejemplo: 13% de IVA)
    const impuestoConfigurado = 0.13;

    // Guardar el impuesto en localStorage (ya que productosCarrito ya está guardado)
    localStorage.setItem("impuesto", impuestoConfigurado);

    // Redirigir a la página de factura
    window.location.href = "factura.html";
};

// Modificar el evento de clic en el botón "Pagar"
document.getElementById('pagar').addEventListener('click', function () {
    // Generar factura antes de limpiar el carrito
    generateInvoice();

    // alert('Pago realizado con éxito.');
    // productosCarrito = [];
    updateCart();
    showProducts();
});

// Función para abrir el carrito
abrirCarritoBtn.addEventListener('click', () => {
    carrito.classList.add('abierto'); // Abre el carrito
    abrirCarritoBtn.style.display = 'none'; // Oculta el botón
});

// Función para cerrar el carrito
cerrarCarritoBtn.addEventListener('click', () => {
    carrito.classList.remove('abierto'); // Cierra el carrito
    abrirCarritoBtn.style.display = 'block'; // Muestra el botón

});

//funcion para actualizar la cantidad de productos en el carrito
window.updateProductCount = function updateProductCount() {
    // Obtener productosCarrito desde localStorage
    let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    // Sumar la cantidad total de productos en el carrito
    const contador = productosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    
    // Obtener el elemento del contador en el HTML
    const contadorCarrito = document.getElementById('contadorCarrito');
    
    // Actualizar el contador en la interfaz
    if (contadorCarrito) {
        contadorCarrito.textContent = contador;
    }
};

document.getElementById('reiniciarCompras').addEventListener('click', function () {
    if (confirm("¿Estás seguro de que quieres reiniciar las compras?")) {
        localStorage.clear(); // Borra todo el localStorage
        window.location.reload(); // Recarga la página para reflejar los cambios
    }
});


// Inicializa la tienda
showProducts();
updateCart();
