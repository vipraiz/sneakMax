const burgerBtn = document.querySelector(".burger");

burgerBtn.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("active");
  document.querySelector(".header__nav").classList.toggle("active");
  document.querySelector("body").classList.toggle("lock");
});

document.querySelectorAll(".nav__item").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (burgerBtn.classList.contains("active")) {
      burgerBtn.classList.remove("active");
      document.querySelector(".header__nav").classList.remove("active");
      document.querySelector("body").classList.remove("lock");
    }
  });
});
