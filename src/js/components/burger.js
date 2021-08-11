document.querySelector(".burger").addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("active");
  document.querySelector(".header__nav").classList.toggle("active");
  document.querySelector("body").classList.toggle("lock");
});
