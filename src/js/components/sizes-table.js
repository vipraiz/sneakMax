const sizesBtnsNodeList = document.querySelectorAll(".sizes-table__btn");

if (sizesBtnsNodeList.length != 0) {
  const sizesBtns = Array.prototype.slice.call(sizesBtnsNodeList);

  sizesBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("sizes-table__btn_active");
    });
  });
}
