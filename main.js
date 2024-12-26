const api = "https://fakestoreapi.com/products";
const categoriesall = document.getElementById("categories");
const productsAll = document.getElementById("products");
const loader = document.getElementById("loader");
const content = document.getElementById("content");

let productsData = [];

const delay = 2000;

async function fetchProducts() {
  try {
    const response = await fetch(api);
    const products = await response.json();
    productsData = products;

    setTimeout(() => {
      renderCategories();
      renderProducts("all");
      hideLoader();
    }, delay);
  } catch (error) {
    console.error("Error fetching products:", error);
    productsAll.innerHTML = "Failed to load products.";
    hideLoader();
  }
}

function renderCategories() {
  const categories = [
    "all",
    ...new Set(productsData.map((product) => product.category)),
  ];
  categoriesall.innerHTML = categories
    .map(
      (category, index) => `
      <button class="category-btn ${
        index === 0 ? "active" : ""
      }" data-category="${category}">
        ${category}
      </button>
    `
    )
    .join("");

  document.querySelectorAll(".category-btn").forEach((button) => {
    button.addEventListener("click", handleCategoryChange);
  });
}

function handleCategoryChange(event) {
  const category = event.target.dataset.category;
  document
    .querySelectorAll(".category-btn")
    .forEach((button) => button.classList.remove("active"));
  event.target.classList.add("active");

  productsAll.innerHTML = "";
  loader.style.display = "flex";

  setTimeout(() => {
    renderProducts(category);
    hideLoader();
  }, delay);
}

function renderProducts(category) {
  const filteredProducts =
    category === "all"
      ? productsData
      : productsData.filter((product) => product.category === category);

  productsAll.innerHTML = filteredProducts
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${
        product.title
      }" style="max-width: 100%; height: 150px;">
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <div class="stars">${generateStars(product.rating.rate)}</div>
      </div>
    `
    )
    .join("");
}

function generateStars(rating) {
  const roundedRating = Math.round(rating);
  return "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
}

function hideLoader() {
  loader.style.display = "none";
  content.style.display = "block";
}

fetchProducts();
