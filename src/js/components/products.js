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

const resetModal = () => {
  prodModalSlider.innerHTML = "";
  prodModalInfo.innerHTML = "";
  prodModalDescr.textContent = "";
  prodModalChars.innerHTML = "";
  prodModalPreview.innerHTML = "";
  prodModalNote.innerHTML = "";
  prodModalVideo.innerHTML = "";
};

if (catalogList) {
  let areAvailable = false;
  let prodQuantity = 3;
  let dataLength = null;

  const prodSlider = new Swiper(".modal-slider__container", {
    slidesPerView: 1,
    spaceBetween: 20,
  });

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

            prodSlider.update();
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
                  <li class="modal-note__item">${not}</li>
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
                <img src="img/star.svg" alt="Рейтинг 5 из 5" />
                <img src="img/star.svg" alt="" />
                <img src="img/star.svg" alt="" />
                <img src="img/star.svg" alt="" />
                <img src="img/star.svg" alt="" />
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
              prodModalBtn.disabled = "true";
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
              src="https://www.youtube.com/embed/mOhNu01i0OM"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
            `;
            } else {
              prodModalVideo.style.display = "none";
            }
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
        prodSlider.update();

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
