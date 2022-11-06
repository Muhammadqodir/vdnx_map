var show_types = [{
        'title': 'Еда',
        'icon': './res/icons/meal.svg',
        'color': '#444444'
    },
    {
        'title': 'Медпункт',
        'icon': './res/icons/doctor.svg',
        'color': '#444444'
    },
    {
        'title': 'Туалеты',
        'icon': './res/icons/toilet.svg',
        'color': '#444444'
    },
    {
        'title': 'Банкомат',
        'icon': './res/icons/atm.svg',
        'color': '#444444'
    },
    {
        'title': 'Сувениры',
        'icon': './res/icons/souvenirs.svg',
        'color': '#444444'
    },
    {
        'title': 'Детская площадка',
        'icon': './res/icons/child.svg',
        'color': '#444444'
    },
    {
        'title': 'Зеленая зона',
        'icon': './res/icons/tree.svg',
        'color': '#444444'
    },
    {
        'title': 'Остановка',
        'icon': './res/icons/bus_stop.svg',
        'color': '#444444'
    },
    {
        'title': 'Фонтан',
        'icon': './res/icons/fountain.svg',
        'color': '#444444'
    }
];
show_types.forEach((val) => {
    $("#types_filter").html($("#types_filter").html() + '<span onclick="showPlaces(\'' + val['title'] + '\')" class="item"><span class="circle" style="background-color: ' + val['color'] + ';"> <img src="' + val['icon'] + '"/></span> ' + val['title'] + ' </span>');
})

function showOnMap(coords) {
    console.log(coords)
    window.scrollTo(0, 0);
    map.flyTo({
        center: coords,
        zoom: 18,
        pitch: 0,
        bearing: 0
    });
}

function showPlaces(type) {
    showPointsByType(type);
    $("#places-sheet #title").html(type);
    $("#places-sheet #list").html("");
    Object.keys(placesDetails['places']).forEach(element => {
        if (placesDetails['places'][element]['type'] == type) {
            place = placesDetails['places'][element];

            if (places[element]) {
                img = 'http://vdnh.ru' + places[element]['properties']['pic'];
                $("#places-sheet #list").html($("#places-sheet #list").html() + `
                    <div class="place-card" onclick="showOnMap([` + place['coordinates'][0] + `, ` + place['coordinates'][1] + `]);">
                        <img src="` + img + `" width="100">
                        <div class="title">` + place['title'] + `</div>
                        <div class="desc">` + place['preview_text'] + `</div>
                        <div class="schedule">Открыто до 20:00</div>
                    </div>`);
            }
        }
    });

    openBottomSheet('places-sheet')
}