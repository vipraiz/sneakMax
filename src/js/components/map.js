ymaps.ready(init);

function init() {
  fetch("data/data-map-settings.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const map = new ymaps.Map("map", {
        center: data[0].coords,
        zoom: data[0].zoom,
        controls: ["zoomControl"],
        behaviors: ["drag", "dblClickZoom", "multiTouch"],
      });

      for (let i = 1; i < data.length; i++) {
        const dataItem = data[i];
        const placeMark = new ymaps.Placemark(
          dataItem.coords,
          {
            iconCaption: dataItem.iconCaption,
            balloonContent: dataItem.balloon,
          },
          dataItem.type == "main" ? { preset: "islands#redIcon" } : {}
        );
        map.geoObjects.add(placeMark);
      }
    });
}
