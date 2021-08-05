const catalogList = document.querySelector(".catalog-list");
const catalogFilters = document.querySelector(".catalog-filters");

let prices = [1, 999999];
let male = false;
let female = false;
let sizes = [];
let sizesMaxCount = catalogFilters.querySelectorAll(".sizes-table__btn").length;

const getFilters = () => {
  prices = Array.from(
    catalogFilters.querySelectorAll(".catalog-price__input")
  ).map((el) => {
    return parseInt(el.value.replace(/\s/g, ""));
  });
  male = catalogFilters.querySelector(".catalog-filters__male").checked;
  female = catalogFilters.querySelector(".catalog-filters__female").checked;

  sizes = Array.from(
    catalogFilters.querySelectorAll(".sizes-table__btn_active")
  ).map((el) => {
    return parseInt(el.textContent);
  });
};

const resetFilters = () => {
  setRangeSlider(0, minPrice);
  setRangeSlider(1, maxPrice);

  catalogFilters.querySelector(".catalog-filters__male").checked = false;
  catalogFilters.querySelector(".catalog-filters__female").checked = false;

  catalogFilters.querySelectorAll(".sizes-table__btn_active").forEach((el) => {
    el.classList.remove("sizes-table__btn_active");
  });

  prices = [1, 999999];
  male = false;
  female = false;
  sizes = [];
};

const filterProduct = (item) => {
  const checkSizes = () => {
    if (sizes.length > 0 && sizes.length < sizesMaxCount) {
      for (let i = 0; i < sizes.length; i++) {
        for (let j = 0; j < item.sizes.length; j++) {
          if (sizes[i] === item.sizes[j]) {
            return true;
          }
        }
      }
    } else {
      return true;
    }
  };

  if (item.price >= prices[0] && item.price <= prices[1]) {
    if ((male && female) || (!male && !female)) {
      return checkSizes();
    } else {
      if (
        Object.keys(item.chars).some((key) => {
          if (key === "Пол") {
            if (
              (male && item.chars[key] === "Мужской") ||
              (female && item.chars[key] === "Женский")
            ) {
              return true;
            }
            return false;
          }
          return false;
        })
      ) {
        return checkSizes();
      }

      return false;
    }
  }
  return false;
};

catalogFilters
  .querySelector(".catalog__apply")
  .addEventListener("click", () => {
    lazyProds = false;
    getFilters();
    reloadProducts();
  });

catalogFilters
  .querySelector(".catalog__reset")
  .addEventListener("click", () => {
    lazyProds = false;
    resetFilters();
    reloadProducts();
  });
