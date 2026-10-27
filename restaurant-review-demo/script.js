const searchInput = document.querySelector("#search-input");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const restaurantCards = [...document.querySelectorAll(".restaurant-card")];
const emptyState = document.querySelector("#empty-state");
const reviewForm = document.querySelector("#review-form");
const reviewList = document.querySelector("#review-list");
const reviewCount = document.querySelector("#review-count");
const formStatus = document.querySelector("#form-status");
const restaurantSelect = document.querySelector("#restaurant-select");

let activeFilter = "All";
const userReviews = [];

function filterRestaurants() {
  const term = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  restaurantCards.forEach((card) => {
    const matchesTerm = card.dataset.search.toLowerCase().includes(term);
    const matchesFilter = activeFilter === "All" || card.dataset.cuisine === activeFilter;
    const visible = matchesTerm && matchesFilter;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
}

searchInput.addEventListener("input", filterRestaurants);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    filterRestaurants();
  });
});

document.querySelectorAll("[data-review]").forEach((button) => {
  button.addEventListener("click", () => {
    restaurantSelect.value = button.dataset.review;
    document.querySelector("#reviewer-name").focus();
    document.querySelector("#add-review").scrollIntoView({ behavior: "smooth" });
  });
});

function renderReviews() {
  reviewList.querySelectorAll("[data-user-review]").forEach((item) => item.remove());

  userReviews.slice().reverse().forEach((review) => {
    const article = document.createElement("article");
    article.className = "review-item";
    article.dataset.userReview = "true";

    const heading = document.createElement("div");
    heading.className = "review-item-heading";
    const name = document.createElement("strong");
    name.textContent = review.name;
    const rating = document.createElement("span");
    rating.className = "rating";
    rating.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    heading.append(name, rating);

    const details = document.createElement("p");
    details.textContent = review.details;
    const caption = document.createElement("small");
    caption.textContent = "Your demo review · " + review.restaurant;
    article.append(heading, details, caption);
    reviewList.prepend(article);
  });

  const total = 2 + userReviews.length;
  reviewCount.textContent = total + (total === 1 ? " note" : " notes");
}

reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(reviewForm);
  const review = {
    name: String(formData.get("reviewer")).trim(),
    restaurant: String(formData.get("restaurant")),
    rating: Number(formData.get("rating")),
    details: String(formData.get("details")).trim()
  };

  if (!review.name || !review.restaurant || !review.details || review.rating < 1 || review.rating > 5) {
    formStatus.textContent = "Please complete each field before posting.";
    return;
  }

  userReviews.push(review);
  renderReviews();
  formStatus.textContent = "Your demo review has been added below. It is stored in this page session only.";
  reviewForm.reset();
  document.querySelector("#reviews").scrollIntoView({ behavior: "smooth" });
});
