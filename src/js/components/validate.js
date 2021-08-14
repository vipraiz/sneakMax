document.querySelectorAll(`input[type="tel"]`).forEach((el) => {
  new Inputmask("+7 (999) 999-9999").mask(el);
});

let productsFormData = null;

const validateForms = function (
  selector,
  rules,
  messages,
  colorValue,
  succesModal,
  yaGoal
) {
  new window.JustValidate(selector, {
    rules: rules,
    messages: messages,
    colorWrong: colorValue,
    submitHandler: function (form) {
      if (form.classList.contains("cart-modal__form")) {
        productsFormData = new FormData(
          document.querySelector(".cart-modal__form")
        );
        document
          .querySelectorAll(".cart-order__list .mini-cart__item")
          .forEach((el, index) => {
            const title = document.querySelector(
              ".mini-product__title"
            ).textContent;
            const price = document.querySelector(
              ".mini-product__price"
            ).textContent;
            productsFormData.append(
              `product-${index + 1}`,
              `${title}, ${price}`
            );
          });
        productsFormData.append(
          "summ",
          `${document.querySelector(".cart-order__summ span").textContent}`
        );

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log("Отправлено");
            }
          }
        };

        xhr.open("POST", "mail.php", true);
        xhr.send(productsFormData);

        form.reset();
      } else {
        const formData = new FormData(form);

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log("Отправлено");
            }
          }
        };

        xhr.open("POST", "mail.php", true);
        xhr.send(formData);

        form.reset();
      }
    },
  });
};

validateForms(
  ".callback-form",
  { name: { required: true }, phone: { required: true } },
  {
    name: { required: "Вы должны ввести имя" },
    phone: { required: "Вы должны ввести телефон" },
  },
  getComputedStyle(document.documentElement).getPropertyValue("--color-accent"),
  ".thanks-popup"
);

validateForms(
  ".cart-modal__form",
  {
    name: { required: true },
    phone: { required: true },
    email: { required: true, email: true },
  },
  {
    name: { required: "Вы должны ввести имя" },
    phone: { required: "Вы должны ввести телефон" },
    email: {
      required: "Вы должны ввести email",
      email: "Вы должны ввести корректный email",
    },
  },
  getComputedStyle(document.documentElement).getPropertyValue("--color-accent"),
  ".thanks-popup"
);
