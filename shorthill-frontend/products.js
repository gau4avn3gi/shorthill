// Get logged in user
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

// DOM elements
const productsTable = document.querySelector("#productsTable tbody");
const actionsHeader = document.querySelector("#actionsHeader"); // optional, for hiding header
const modal = document.getElementById("productModal");
const addBtn = document.getElementById("addBtn");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productDesc = document.getElementById("productDesc");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");

let editMode = false;

// Remove Add button and Actions column header for non-admin users
if (user.role !== "admin") {
    addBtn.remove();
    if (actionsHeader) actionsHeader.remove();
}

// Load all products
const loadProducts = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/show_products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password })
    });
    const data = await res.json();
    productsTable.innerHTML = "";

    if (data.status) {
        data.data.forEach(p => {
            const row = document.createElement("tr");

            // Only admin sees buttons
            const actions = user.role === "admin"
                ? `<button class="editBtn" data-id="${p.id}">Edit</button>
                   <button class="deleteBtn" data-id="${p.id}">Delete</button>`
                : "";

            row.innerHTML = `
                <td>${p.name}</td>
                <td>${p.description || ""}</td>
                <td>${p.price}</td>
                <td>${p.stock}</td>
                ${user.role === "admin" ? `<td>${actions}</td>` : ""}
            `;

            productsTable.appendChild(row);
        });

        if (user.role === "admin") attachButtons();
    }
};

// Attach Edit/Delete button events
const attachButtons = () => {
    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const res = await fetch("http://127.0.0.1:8000/api/show_products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, password: user.password })
            });
            const data = await res.json();
            const product = data.data.find(p => p.id == id);
            if (product) openModal(product);
        });
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (!confirm("Delete this product?")) return;
            const id = btn.dataset.id;
            await fetch(`http://127.0.0.1:8000/api/delete/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, password: user.password })
            });
            loadProducts();
        });
    });
};

// Open modal for Add/Edit
const openModal = (product = null) => {
    modal.style.display = "flex";

    if (product) {
        modalTitle.innerText = "Edit Product";
        productId.value = product.id;
        productName.value = product.name;
        productDesc.value = product.description;
        productPrice.value = product.price;
        productStock.value = product.stock;
        editMode = true;
    } else {
        modalTitle.innerText = "Add Product";
        productId.value = "";
        productName.value = "";
        productDesc.value = "";
        productPrice.value = "";
        productStock.value = "";
        editMode = false;
    }
};

// Close modal
const closeModal = () => {
    modal.style.display = "none";
    editMode = false;
};

// Save product (Add/Edit)
if (user.role === "admin") {
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            email: user.email,
            password: user.password,
            data: JSON.stringify({
                id: productId.value,
                name: productName.value,
                description: productDesc.value,
                price: productPrice.value,
                stock: productStock.value
            })
        };

        const url = productId.value ? "http://127.0.0.1:8000/api/edit_product" : "http://127.0.0.1:8000/api/add_product";

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        alert(data.message);
        closeModal();
        loadProducts();
    });

    addBtn.addEventListener("click", () => openModal());
}

// Close modal events
closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// Initial load
loadProducts();
