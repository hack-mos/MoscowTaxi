/* ymaps.ready(init);
let myMap;
let elInfo = document.getElementById('info');
let elMsg = document.getElementById('message');
let elEvnts = document.getElementById('events');

function init () {
    myMap = new ymaps.Map('map',
        {
            center: [55.76, 37.64],
            zoom: 10,
        }
    );
}

 */
/* ymaps.ready(init);
    /* ------------------------------------------------------------ */
ymaps.ready(init);

let myMap;
let currentRoute;

function init() {
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10,
    });

    document.getElementById("buildRoute").addEventListener("click", () => {
        const startPoint = document.getElementById("startPoint").value.split(",").map(Number);
        const endPoint = document.getElementById("endPoint").value.split(",").map(Number);

        buildRoute(startPoint, endPoint);
    });

    document.getElementById("startTaxi").addEventListener("click", () => {
        if (currentRoute) startTaxi(currentRoute);
    });
}

function buildRoute(startPoint, endPoint) {
    ymaps.route([startPoint, endPoint], {
        routingMode: "masstransit", // Убедитесь, что поддерживается водный транспорт
        mapStateAutoApply: true,
    }).then((route) => {
        if (currentRoute) myMap.geoObjects.remove(currentRoute);

        const routePath = route.getPaths();
        routePath.options.set({
            strokeColor: "#00FF00",
            strokeWidth: 6,
            opacity: 0.9,
        });

        myMap.geoObjects.add(route);
        currentRoute = route;

        saveRouteToJson(startPoint, endPoint); // Сохраняем в JSON для сервера
    });
}

function startTaxi(route) {
    const path = route.getPaths().get(0).geometry.getCoordinates();
    let currentIndex = 0;

    const taxiMarker = new ymaps.Placemark(path[0], {}, {
        iconColor: "#FF0000",
    });
    myMap.geoObjects.add(taxiMarker);

    function moveTaxi() {
        if (currentIndex < path.length - 1) {
            currentIndex++;
            taxiMarker.geometry.setCoordinates(path[currentIndex]);

            setTimeout(moveTaxi, 1000); // Интервал движения
        } else {
            alert("Такси прибыло!");
        }
    }

    moveTaxi();
}

function saveRouteToJson(startPoint, endPoint) {
    const routeData = {
        startPoint,
        endPoint,
        createdAt: new Date().toISOString(),
    };

    fetch("/save_route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeData),
    }).then((res) => {
        if (res.ok) console.log("Маршрут сохранён");
    });
}