let lazyImages = document.querySelectorAll("img[data-src],source[data-srcset]");

const map = document.getElementById("map");

const windownHeigth = document.documentElement.clientHeight;

let lazyImagesPositions = [];

if (lazyImages.length > 0) {
  lazyImages.forEach((img) => {
    lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset);
    lazyScrollCheck();
  });
}

window.addEventListener("scroll", () => {
  if (
    document.querySelectorAll("img[data-src],source[data-srcset]").length > 0
  ) {
    lazyScrollCheck();
  }
  if (!map.classList.contains("map_loaded")) {
    getMap();
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
    lazyImages[index].parentNode.classList.remove("lazyload-bg");
    delete lazyImagesPositions[index];
    // lazyImagesPositions.splice(index, 1);
  }
}

function getMap() {
  const mapPos = map.getBoundingClientRect().top + pageYOffset;
  if (pageYOffset > mapPos - windownHeigth) {
    ymaps.ready(init);
    map.classList.add("map_loaded");
  }
}

function addLazyImages() {
  lazyImages = document.querySelectorAll("img[data-src],source[data-srcset]");
  lazyImagesPositions = [];
  lazyImages.forEach((img) => {
    lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset);
    lazyScrollCheck();
  });
}
