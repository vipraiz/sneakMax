const catalogList = document.querySelector(".catalog-list");
const catalogFilters = document.querySelector(".catalog-filters");

let prices = [1, 999999];
let male = false;
let female = false;
let sizes = [];
let sizesMaxCount = 0;

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
  sizesMaxCount = catalogFilters.querySelectorAll(".sizes-table__btn").length;
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

const applyBtn = catalogFilters.querySelector(".catalog__apply");
applyBtn.addEventListener("click", () => {
  getFilters();
  reloadProducts();
});
