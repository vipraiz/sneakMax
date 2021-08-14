document.documentElement.style.setProperty(
  "--vh",
  `${window.innerHeight * 0.01}px`
);

const observer = lozad(".lozad", {
  rootMargin: "50% 0px",
});
observer.observe();

document.querySelector(".hero__btn").addEventListener("click", () => {
  document.getElementById("catalog").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
