const catalogList = document.querySelector(".catalog-list");
const loadMoreBtn = document.querySelector(".catalog__more");
const prodModal = document.querySelector(
  `[data-graph-target="prod-modal"] .modal-content`
);

let prodQuantity = 3;
let dataLength = null;

if (catalogList) {
  const loadProducts = (quantity = 3) => {
    fetch("../data/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataLength = data.length;

        catalogList.innerHTML = "";

        for (let i = 0; i < dataLength; i++) {
          if (i < quantity) {
            let item = data[i];

            catalogList.innerHTML += `
              <li class="catalog-list__item">
              <article class="product">
                <div class="product__image">
                  <img src="${item.mainImage}" alt="${item.title}" />
                  <div class="product__btns">
                    <button
                      class="btn-reset product__btn"
                      aria-label="Показать информацию о товаре"
                      data-graph-path="prod-modal"
                      data-id="${item.id}"
                    >
                      <svg>
                        <use xlink:href="img/sprite.svg#eye"></use>
                      </svg>
                    </button>
                    <button
                      class="btn-reset product__btn"
                      aria-label="Добавить товар в корзину"
                    >
                      <svg>
                        <use xlink:href="img/sprite.svg#cart"></use>
                      </svg>
                    </button>
                  </div>
                </div>
                <a href="#" class="product__title">
                  ${item.title}
                </a>
                <span class="product__price">${item.price.toLocaleString()} р</span>
              </article>
            </li>
            `;
          }
        }
      })
      .then(() => {
        const modal = new GraphModal({
          isOpen: (modal) => {
            const openBtnId = modal.previousActiveElement.dataset.id;

            loadModalData(openBtnId);
          },
        });
      });
  };

  loadProducts(prodQuantity);

  const loadModalData = (id = 1) => {
    fetch("../data/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        prodModal.innerHTML = "";

        for (let dataItem of data) {
          if (dataItem.id == id) {
            console.log(dataItem);
          }
        }
      });
  };

  loadMoreBtn.addEventListener("click", () => {
    prodQuantity += prodQuantity;

    if (prodQuantity >= dataLength) {
      prodQuantity = dataLength;
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }

    loadProducts(prodQuantity);
  });
}
