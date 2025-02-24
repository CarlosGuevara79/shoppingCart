const basePath = window.location.pathname.includes("shoppingCart") 
    ? "/shoppingCart" 
    : "";

document.addEventListener("DOMContentLoaded", function () {
    const header = document.createElement("header");
    header.innerHTML = `
        <div class="banner">
            <img src="${basePath}/assets/img/banner.png" class="img_banner" id="Banner_img">
        </div>
    `;
    document.body.prepend(header); // Agrega el header al inicio del <body>
});
