const catalogList = document.querySelector(".catalog-list");

const loadMoreBtn = document.querySelector(".catalog__more");
const prodModal = document.querySelector(
  `[data-graph-target="prod-modal"] .modal-content`
);
const prodModalSlider = prodModal.querySelector(
  ".modal-slider .swiper-wrapper"
);
const prodModalInfo = prodModal.querySelector(".modal-info__wrapper");
const prodModalDescr = prodModal.querySelector(".modal-prod-descr");
const prodModalChars = prodModal.querySelector(".prod-chars");
const prodModalPreview = prodModal.querySelector(".modal-preview");
const prodModalNote = prodModal.querySelector(".modal-note");
const prodModalVideo = prodModal.querySelector(".prod-modal__video");
const prodModalBtn = prodModal.querySelector(".modal-info__order");

const fullPrice = document.querySelector(".mini-cart__summ");

let modal;
let loadProducts;
const quantityToShow = 6;
let prodQuantity = quantityToShow;
let dataLength = null;

const reloadProducts = () => {
  loadMoreBtn.style.display = "block";
  prodQuantity = quantityToShow;
  loadProducts(prodQuantity);
};

const resetModal = () => {
  prodModalSlider.innerHTML = "";
  prodModalInfo.innerHTML = "";
  prodModalDescr.textContent = "";
  prodModalChars.innerHTML = "";
  prodModalPreview.innerHTML = "";
  prodModalNote.innerHTML = "";
  prodModalVideo.innerHTML = "";
  prodModalVideo.style.display = "none";
  prodModalBtn.disabled = "true";
};

if (catalogList) {
  let areAvailable = false;

  const prodSlider = new Swiper(".modal-slider__container", {
    slidesPerView: 1,
    spaceBetween: 20,
  });

  modal = new GraphModal({
    isOpen: (modal) => {
      if (modal.modalContainer.classList.contains("prod-modal")) {
        const openBtnId = modal.previousActiveElement.dataset.id;
        if (openBtnId) {
          loadModalData(openBtnId);
        } else {
          console.log(modal);
        }
      }
    },
  });

  loadProducts = (quantity) => {
    fetch("../data/data-prods.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataLength = data.length;

        catalogList.innerHTML = "";

        const listCart = [].slice.call(miniCartList.children);

        const getFirteredProdIds = () => {
          let arr = [];
          for (let i = 0; i < dataLength; i++) {
            const item = data[i];
            if (filterProduct(item)) {
              arr.push(item.id);
            }
          }
          return arr;
        };

        const filteredProdIds = getFirteredProdIds();

        if (quantity >= filteredProdIds.length) {
          quantity = filteredProdIds.length;
          loadMoreBtn.style.display = "none";
        }

        for (let i = 0; i < dataLength; i++) {
          if (i < quantity) {
            const item = data[i];

            if (!filteredProdIds.includes(item.id)) {
              quantity++;
              continue;
            }

            let isInCart = false;

            for (let i = 0; i < listCart.length; i++) {
              if (listCart[i].dataset.id == item.id) {
                isInCart = true;
                listCart.splice(i, 1);
                break;
              }
            }

            catalogList.innerHTML += `
              <li class="catalog-list__item">
              <article class="product">
                <div class="product__image">
                  <img src="${item.mainImage}" alt="${item.title}" />
                  <div class="product__btns">
                    <button
                      class="btn-reset product__btn product__btn_info"
                      aria-label="Показать информацию о товаре"
                      data-graph-path="prod-modal"
                      data-id="${item.id}"
                    >
                      <svg>
                        <use href="img/sprite.svg#eye"></use>
                      </svg>
                    </button>
                    <button
                      class="btn-reset product__btn product__btn_cart"
                      aria-label="Добавить товар в корзину"
                      data-id="${item.id}"
                      ${isInCart ? `disabled="disabled"` : ""}
                    >
                      <svg>
                        <use href="img/sprite.svg#cart"></use>
                      </svg>
                    </button>
                  </div>
                </div>
                <button href="#" class="product__title btn-reset"
                  data-graph-path="prod-modal"
                  data-id="${item.id}">
                  ${item.title}
                </button>
                <span class="product__price">${item.price.toLocaleString()} р</span>
              </article>
            </li>
            `;
          }
        }
      })
      .then(() => {
        cartLogic();
      });
  };

  // loadProducts(prodQuantity);

  const loadModalData = (id = 1) => {
    fetch("../data/data-prods.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resetModal();

        for (let dataItem of data) {
          if (dataItem.id == id) {
            const slides = dataItem.gallery.map((image, idx) => {
              return `
              <div class="swiper-slide" ondragstart="return false" data-index="${idx}">
               <img src="${image}" alt="">
              </div>
              `;
            });

            const preview = dataItem.gallery.map((image, idx) => {
              return `
              <button class="btn-reset modal-preview__item
              ${idx === 0 ? "modal-preview__item_active" : ""}"
              data-index="${idx}">
                <img src="${image}" alt="">
              </button>
              `;
            });

            const sizes = dataItem.sizes.map((size) => {
              return `
              <li class="modal-sizes__item">
               <button class="modal-sizes__btn btn-reset">${size}</button>
              </li>
              `;
            });

            let note;
            if (dataItem.note) {
              note = dataItem.note.map((not) => {
                return `
                  <li class="modal-note__item">${not}
                    <svg class="modal-note__check" aria-hidden="true">
                      <use href="img/sprite.svg#check"></use>
                    </svg>
                  </li>
                `;
              });
            }

            prodModalSlider.innerHTML = slides.join("");
            prodModalPreview.innerHTML = preview.join("");

            if (dataItem.quantity == 0) {
              areAvailable = false;
            } else {
              areAvailable = true;
            }

            prodModalInfo.innerHTML = `
              <div class="modal-info__top">
                <span class="modal-info__vendor">Артикул:
                  ${dataItem.vendor}</span>
                <div class="modal-info__quantity">
                  ${
                    areAvailable
                      ? `В наличии: <span>${dataItem.quantity} шт</span>`
                      : "Нет в наличии"
                  }
               </div>
              </div>
              <h3 class="modal-info__title">
                ${dataItem.title}
              </h3>
              <div class="modal-info__rating">
                <svg aria-label="Рейтинг 5 из 5">
                 <use href="img/sprite.svg#star"></use>
                </svg>
                <svg>
                  <use href="img/sprite.svg#star"></use>
                </svg>
                <svg>
                 <use href="img/sprite.svg#star"></use>
                </svg>
                <svg>
                  <use href="img/sprite.svg#star"></use>
                </svg>
                <svg>
                  <use href="img/sprite.svg#star"></use>
                </svg>
              </div>
              <div class="modal-info__sizes">
                <span class="modal-info__subtitle">Выберите размер</span>
                <ul class="list-reset modal-info__sizes-list modal-sizes">
                 ${sizes.join("")}
                </ul>
              </div>
              <div class="modal-info__price">
                <span class="modal-info__current-price">${dataItem.price.toLocaleString()} р</span>
                <span class="modal-info__old-price">
                  ${
                    dataItem.oldPrice
                      ? dataItem.oldPrice.toLocaleString() + " р"
                      : ""
                  }
                </span>
              </div>
            `;

            if (areAvailable) {
              prodModalBtn.removeAttribute("disabled");
            } else {
              prodModalBtn.setAttribute("disabled", "disabled");
            }

            prodModalNote.innerHTML = `${note ? note.join("") : ""}`;
            prodModalDescr.textContent = `${dataItem.description}`;

            let charsItems = "";
            Object.keys(dataItem.chars).forEach((key) => {
              charsItems += `<p class="prod-bottom__descr modal-prod-descr">${key}: ${dataItem.chars[key]}</p>`;
            });

            prodModalChars.innerHTML = charsItems;

            if (dataItem.video) {
              prodModalVideo.style.display = "block";
              prodModalVideo.innerHTML = `
              <iframe
              src="${dataItem.video}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
            `;
            } else {
              prodModalVideo.style.display = "none";
            }
            break;
          }
        }
      })
      .then(() => {
        document.querySelectorAll(".swiper-slide").forEach((el) => {
          el.addEventListener("click", function (event) {
            window.open(event.target.src);
          });
        });
        prodSlider.setProgress(0);
        prodSlider.on("slideChangeTransitionStart", function () {
          let idx = prodModal.querySelector(".swiper-slide-active").dataset
            .index;

          prodModal.querySelectorAll(".modal-preview__item").forEach((el) => {
            el.classList.remove("modal-preview__item_active");
          });

          prodModal
            .querySelector(`.modal-preview__item[data-index="${idx}"]`)
            .classList.add("modal-preview__item_active");
        });

        prodModal.querySelectorAll(".modal-preview__item").forEach((el) => {
          el.addEventListener("click", (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);

            prodModal.querySelectorAll(".modal-preview__item").forEach((el) => {
              el.classList.remove("modal-preview__item_active");
            });

            e.currentTarget.classList.add("modal-preview__item_active");

            prodSlider.slideTo(idx);
          });
        });

        prodSlider.update();
      });
  };

  loadMoreBtn.addEventListener("click", () => {
    prodQuantity += prodQuantity;

    if (prodQuantity >= dataLength) {
      prodQuantity = dataLength;
      loadMoreBtn.style.display = "none";
    } // else {
    //   loadMoreBtn.style.display = "block";
    // }

    loadProducts(prodQuantity);
  });

  let totalPrice = 0;

  const plusTotalPrice = (price) => {
    totalPrice += price;
  };

  const minusTotalPrice = (price) => {
    totalPrice -= price;
  };

  const printTotalPrice = () => {
    fullPrice.textContent = `${totalPrice.toLocaleString()} р`;
  };

  const printQuantity = (quantity) => {
    if (quantity > 0) {
      cartCount.classList.add("cart__count_visible");
    } else {
      cartCount.classList.remove("cart__count_visible");
      cartCount.textContent = "";
      return;
    }

    cartCount.textContent = quantity;
  };

  const cartCount = document.querySelector(".cart__count");
  const miniCartList = document.querySelector(".mini-cart__list");

  const cartLogic = () => {
    const productBtn = document.querySelectorAll(".product__btn_cart");
    const miniCart = document.querySelector(".mini-cart");

    const loadCartData = (id = 1) => {
      fetch("../data/data-prods.json")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          for (let dataItem of data) {
            if (dataItem.id == id) {
              miniCartList.insertAdjacentHTML(
                "afterbegin",
                `
              <li class="mini-cart__item" data-id="${dataItem.id}">
                <article class="mini-cart__product mini-product">
                  <div class="mini-product__image">
                    <img src="${dataItem.mainImage}" alt="${
                  dataItem.title
                }" data-graph-path="prod-modal" data-id="${dataItem.id}">
                  </div>
                  <div class="mini-product__content">
                    <div class="mini-product__text">
                      <button class="mini-product__title btn-reset" data-graph-path="prod-modal" data-id="${
                        dataItem.id
                      }">${dataItem.title}</button>
                      <span class="mini-product__price">${dataItem.price.toLocaleString()} р</span>
                    </div>
                    <button class="mini-product__delete btn-reset" aria-label="Удалить товар">Удалить
                      <svg>
                        <use href="img/sprite.svg#trash"></use>
                      </svg>
                    </button>
                  </div>
                </article>
              </li>
            `
              );
              return dataItem.price;
            }
          }
        })
        .then((price) => {
          plusTotalPrice(price);
          printTotalPrice();
          changeStateCartBtn();
          printQuantity(
            miniCartList.querySelectorAll(".mini-cart__list .mini-cart__item")
              .length
          );
        });
    };

    productBtn.forEach((el) => {
      el.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        loadCartData(id);
        e.currentTarget.setAttribute("disabled", "disabled");
      });
    });
  };

  miniCartList.addEventListener("click", (e) => {
    if (e.target.classList.contains("mini-product__delete")) {
      const self = e.target;
      const parentProduct = self.closest(".mini-cart__item");
      const price = parseInt(
        parentProduct
          .querySelector(".mini-product__price")
          .textContent.replace(/\s/g, "")
      );
      const id = parentProduct.dataset.id;

      catalogList
        .querySelector(`.product__btn_cart[data-id="${id}"]`)
        .removeAttribute("disabled");

      minusTotalPrice(price);
      printTotalPrice();
      parentProduct.remove();

      const quantity = miniCartList.querySelectorAll(
        ".mini-cart__list .mini-cart__item"
      ).length;
      changeStateCartBtn();
      printQuantity(quantity);
      if (quantity <= 0) {
        miniCart.classList.remove("mini-cart_visible");
      }
    }
  });

  const openModalOrder = miniCart.querySelector(".mini-cart__btn");
  const cartOrder = document.querySelector(".cart-order");
  const cartOrderList = cartOrder.querySelector(".cart-order__list");
  const cartOrderShow = cartOrder.querySelector(".cart-order__show");

  openModalOrder.addEventListener("click", () => {
    const productHtml = miniCartList.innerHTML;
    const orderQuantity = cartOrder.querySelector(".cart-order__quantity span");
    const orderSumm = cartOrder.querySelector(".cart-order__summ span");

    cartOrderList.innerHTML = productHtml;
    orderQuantity.textContent = `${
      miniCartList.querySelectorAll(".mini-cart__list .mini-cart__item").length
    } шт`;
    orderSumm.textContent = fullPrice.textContent;
  });

  cartOrderShow.addEventListener("click", () => {
    cartOrderList.classList.toggle("cart-order__list_visible");
    cartOrderShow.classList.toggle("cart-order__show_active");
  });

  cartOrderList.addEventListener("click", (e) => {
    if (e.target.classList.contains("mini-product__delete")) {
      console.log("labanav");
      const self = e.target;
      const parentProduct = self.closest(".mini-cart__item");
      const price = parseInt(
        parentProduct
          .querySelector(".mini-product__price")
          .textContent.replace(/\s/g, "")
      );
      const id = parentProduct.dataset.id;

      catalogList
        .querySelector(`.product__btn_cart[data-id="${id}"]`)
        .removeAttribute("disabled");

      minusTotalPrice(price);
      printTotalPrice();
      cartOrder.querySelector(".cart-order__summ span").textContent =
        fullPrice.textContent;

      parentProduct.remove();
      miniCartList
        .querySelector(
          `.mini-cart__item[data-id="${parentProduct.dataset.id}"]`
        )
        .remove();

      const quantity = miniCartList.querySelectorAll(
        ".mini-cart__list .mini-cart__item"
      ).length;
      changeStateCartBtn();
      printQuantity(quantity);
      cartOrder.querySelector(
        ".cart-order__quantity span"
      ).textContent = `${cartCount.textContent} шт`;

      if (quantity <= 0) {
        miniCart.classList.remove("mini-cart_visible");

        modal.close();
      }
    }
  });
}
