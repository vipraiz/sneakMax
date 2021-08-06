const cartBtn = document.querySelector(".cart__btn");
const miniCart = document.querySelector(".mini-cart");
const miniCartList = document.querySelector(".mini-cart__list");

cartBtn.addEventListener("click", () => {
  cartBtn.classList.toggle("cart__btn_clicked");
  cartBtn.removeEventListener("mouseover", listener1);
  cartBtn.removeEventListener("mouseout", listener2);

  if (cartBtn.classList.contains("cart__btn_clicked")) {
    miniCart.classList.add("mini-cart_visible");
  } else {
    cartBtn.addEventListener("mouseover", listener1);
    cartBtn.addEventListener("mouseout", listener2);
    miniCart.classList.remove("mini-cart_visible");
  }
});

const listener1 = () => {
  miniCart.classList.add("mini-cart_visible");
};

const listener2 = () => {
  miniCart.classList.remove("mini-cart_visible");
};

cartBtn.addEventListener("mouseover", listener1);
cartBtn.addEventListener("mouseout", listener2);

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("mini-product__delete")) {
    if (
      !e.target.classList.contains("mini-cart") &&
      !e.target.classList.contains("cart__btn") &&
      !e.target.closest(".mini-cart")
    ) {
      cartBtn.addEventListener("mouseover", listener1);
      cartBtn.addEventListener("mouseout", listener2);
      miniCart.classList.remove("mini-cart_visible");
      cartBtn.classList.remove("cart__btn_clicked");
    }
  }
});

const changeStateCartBtn = () => {
  if (miniCartList.children.length <= 0) {
    cartBtn.setAttribute("disabled", "disabled");
    cartBtn.classList.remove("cart__btn_clicked");
  } else {
    cartBtn.removeAttribute("disabled");
  }
};
