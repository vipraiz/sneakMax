const cartBtn = document.querySelector(".cart__btn");
const miniCart = document.querySelector(".mini-cart");
const miniCartList = document.querySelector(".mini-cart__list");

cartBtn.addEventListener("click", () => {
  cartBtn.removeEventListener("mouseover", listener1);
  cartBtn.removeEventListener("mouseout", listener2);

  if (!miniCart.classList.contains("mini-cart_visible")) {
    miniCart.classList.add("mini-cart_visible");
    cartBtn.addEventListener("mouseover", listener1);
    cartBtn.addEventListener("mouseout", listener2);
  } else {
    // miniCart.classList.remove("mini-cart_visible");
  }
  // miniCart.classList.toggle("mini-cart_visible");
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
    }
  }
});

const changeStateCartBtn = () => {
  if (miniCartList.children.length <= 0) {
    cartBtn.setAttribute("disabled", "disabled");
  } else {
    cartBtn.removeAttribute("disabled");
  }
};
