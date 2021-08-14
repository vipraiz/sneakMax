function init() {
  fetch("data/data-map-settings.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const map = new ymaps.Map(
        "map",
        {
          center: data[0].coords,
          zoom:
            document.body.clientWidth > 576 ? data[0].zoom : data[0].zoom - 1,
          controls: ["zoomControl"],
          behaviors: ["drag", "dblClickZoom", "multiTouch"],
        },
        {
          restrictMapArea: [
            [59.738, 29.611],
            [60.056, 30.829],
          ],
        }
      );

      const placeMarks = new Array(data.length - 1);

      for (let i = 1; i < data.length; i++) {
        const dataItem = data[i];
        placeMarks[i - 1] = new ymaps.Placemark(
          dataItem.coords,
          {
            iconCaption: dataItem.iconCaption,
            balloonContent: dataItem.balloon,
          },
          dataItem.type == "main" ? { preset: "islands#redIcon" } : {}
        );
        placeMarks[i - 1].events.add("click", () => {
          if (map.getZoom() < 16) {
            map.setZoom(16);
          }
          map.setCenter(dataItem.coords);
        });
      }

      map.geoObjects.add(new ymaps.Clusterer({}).add(placeMarks));
    })
    .then(() => {
      map.style.backgroundImage = "none";
    });
}
