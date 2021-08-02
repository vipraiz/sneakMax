const rangeSlider = document.getElementById("range-slider");

if (rangeSlider) {
  let minPrice = 99999,
    maxPrice = 1;

  const setRange = () => {
    fetch("../data/data-prods.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let dataLength = data.length;

        for (let i = 0; i < dataLength; i++) {
          let item = data[i];

          if (item.price > maxPrice) {
            maxPrice = item.price;
          } else if (item.price < minPrice) {
            minPrice = item.price;
          }
        }

        rangeSlider.noUiSlider.updateOptions({
          range: {
            min: minPrice,
            max: maxPrice,
          },
        });

        rangeSlider.noUiSlider.set([minPrice, maxPrice]);

        reloadProducts();
      });
  };

  noUiSlider.create(rangeSlider, {
    start: [minPrice, minPrice],
    connect: true,
    step: 1,
    range: {
      min: minPrice,
      max: maxPrice,
    },
  });

  setRange();

  const input0 = document.getElementById("input-0");
  const input1 = document.getElementById("input-1");
  const inputs = [input0, input1];

  rangeSlider.noUiSlider.on("update", function (values, handle) {
    inputs[handle].value = Math.round(values[handle]).toLocaleString();
  });

  const setRangeSlider = (i, value) => {
    let arr = [null, null];
    arr[i] = value;
    rangeSlider.noUiSlider.set(arr);
  };

  inputs.forEach((el, index) => {
    el.addEventListener("change", (e) => {
      setRangeSlider(index, e.currentTarget.value);
    });
  });
}
