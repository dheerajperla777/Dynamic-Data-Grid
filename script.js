const productsBox = document.getElementById("products");
const search = document.getElementById("search");
const category = document.getElementById("category");
const sort = document.getElementById("sort");
const status = document.getElementById("status");

let products = [];

async function loadProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok) {
            throw new Error("Could not load products");
        }

        products = await response.json();

        const categories = [...new Set(
            products.map(product => product.category)
        )];

        categories.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            category.appendChild(option);
        });

        displayProducts();
    } catch (error) {
        status.textContent =
            "Unable to load products. Check your internet and try again.";
    }
}

function displayProducts() {
    const keyword = search.value.toLowerCase();

    let filtered = products.filter(product => {
        const matchesName =
            product.title.toLowerCase().includes(keyword);

        const matchesCategory =
            category.value === "all" ||
            product.category === category.value;

        return matchesName && matchesCategory;
    });

    if (sort.value === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort.value === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    productsBox.replaceChildren();
    status.textContent = `${filtered.length} product(s) found`;

    filtered.forEach(product => {
        const card = document.createElement("article");
        card.className = "product";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;
        image.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = product.title;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = `$${product.price.toFixed(2)}`;

        card.append(image, title, price);
        productsBox.appendChild(card);
    });
}

search.addEventListener("input", displayProducts);
category.addEventListener("change", displayProducts);
sort.addEventListener("change", displayProducts);

loadProducts();
