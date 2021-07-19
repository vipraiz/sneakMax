const sizesBtnsNodeList = document.querySelectorAll(".sizes-table__td");

if (sizesBtnsNodeList.length != 0) {
  const sizesBtns = Array.prototype.slice.call(sizesBtnsNodeList);

  sizesBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("sizes-table__td_active");
    });
  });
}
