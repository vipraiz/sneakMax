const lazyImages = document.querySelectorAll(
  "img[data-src],source[data-srcset]"
);
const map = document.querySelector(".contacts__map");
const windownHeigth = document.documentElement.clientHeight;

let lazyImagesPositions = [];
if (lazyImages.length > 0) {
  lazyImages.forEach((img) => {
    lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset);
    lazyScrollCheck();
  });
}

window.addEventListener("scroll", () => {
  if (lazyImagesPositions.length > 0) {
    lazyScrollCheck();
  }
});

function lazyScrollCheck() {
  let index = lazyImagesPositions.findIndex((item) => {
    return pageYOffset > item - windownHeigth;
  });

  if (index >= 0) {
    if (lazyImages[index].dataset.src) {
      lazyImages[index].src = lazyImages[index].dataset.src;
      lazyImages[index].removeAttribute("data-src");
    } else if (lazyImages[index].dataset.srcset) {
      lazyImages[index].srcset = lazyImages[index].dataset.srcset;
      lazyImages[index].removeAttribute("data-srcset");
    }
    delete lazyImagesPositions[index];
  }
}

function getMap() {
  const mapPos = map.getBoundingClientRect().top + pageYOffset;
  if (pageYOffset > mapPos - windownHeigth) {
  }
}
