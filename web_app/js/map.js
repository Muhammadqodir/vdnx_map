const monument = [37.6170995, 55.8352872];
mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW1tYWRxb2RpciIsImEiOiJjanY3cTVsMG4waWp2NDRwZmptNzU1cHdxIn0.zL3ucnAwfCyQRHlYGCbqmw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'https://vdnh.ru/gis/api/rpc/get_style?style_number=1', // style URL
    center: [37.633186, 55.829537], // starting position [lng, lat]
    zoom: 15, // starting zoom
    projection: 'globe', // display the map as a 3D globe
    minZoom: 13,
    maxZoom: 20,
});

map.createMapControls = function() {
    map.obj.controls = $('<div>', {
        class: 'mapbox__controls',
        html: '<div class="mapbox__zooms">\n<a href="javascript:void(0);" data-mapbox-zoom="plus" class="mapbox__zoom mapbox__zoom--plus"></a>\n<a href="javascript:void(0);" data-mapbox-zoom="minus" class="mapbox__zoom mapbox__zoom--minus"></a>\n</div>\n<a href="javascript:void(0);" class="mapbox__control" data-mapbox-locator><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="#E22C38"/></svg></a>\n</div>\n'
    });

    map.obj.container.append(map.obj.controls);

    if (map.params.allowFullscreen && !map.params.defaultFullscreen) {
        let fullscreen = '<a href="javascript:void(0);" class="mapbox__control" data-mapbox-fullscreen><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-173.000000, -3481.000000)"><g transform="translate(100.000000, 3378.000000)"><g transform="translate(68.000000, 98.000000)"><polygon points="0 0 24 0 24 24 0 24"></polygon><path d="M7,14 L5,14 L5,19 L10,19 L10,17 L7,17 L7,14 Z M5,10 L7,10 L7,7 L10,7 L10,5 L5,5 L5,10 Z M17,17 L14,17 L14,19 L19,19 L19,14 L17,14 L17,17 Z M14,5 L14,7 L17,7 L17,10 L19,10 L19,5 L14,5 Z" fill="#000000"></path></g></g></g></g></svg><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="display: none"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-139.000000, -3481.000000)"><g transform="translate(100.000000, 3378.000000)"><g transform="translate(34.000000, 98.000000)"><polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon><path d="M5,16 L8,16 L8,19 L10,19 L10,14 L5,14 L5,16 Z M8,8 L5,8 L5,10 L10,10 L10,5 L8,5 L8,8 Z M14,19 L16,19 L16,16 L19,16 L19,14 L14,14 L14,19 Z M16,8 L16,5 L14,5 L14,10 L19,10 L19,8 L16,8 Z" fill="#000000"></path></g></g></g></g></svg></a>\n';

        $('.mapbox__controls').append(fullscreen);
    }

    if (map.params.useMobile)
        map.mobile.close.attr(map.mobile.trigger, '');

    if (map.mobile.close)
        map.obj.container.append(map.mobile.close);

    if ($('[data-mapbox-fullscreen]').is('a'))
        map.obj.fsbutton = $('[data-mapbox-fullscreen]');
}

function mapZoom(val) {
    map.flyTo({ zoom: map.getZoom() + val });
}

function readData(type = "all") {
    var result = [];
    Object.keys(places).forEach(element => {
        if (type == "all") {
            result.push(places[element])
        } else {
            if (places[element]['properties']['type'] == type) {
                result.push(places[element])
            }
        }
    });
    return result;
}

var placesDetails = [];

function loadDataJson() {
    fetch('../export.json')
        .then((response) => response.json())
        .then((json) => {
            placesDetails = json;
        });

}
loadDataJson();

map.on('load', () => {

    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': readData()
        }
    });

    map.addSource('places-dots', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': readData()
        }
    });


    // Add a layer showing the places.
    map.addLayer({
        'id': 'places-dots',
        'type': 'circle',
        'source': 'places',
        'paint': {
            'circle-translate': [0, -10],
            'circle-radius': [
                'interpolate', ['linear'],
                ['zoom'],
                13, 2,
                15, 3
            ],
            'circle-color': ['get', 'color'],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 1,
        },
        'filter': [
            'all', ['==', ['get', 'visibility'], 'visible'],
            ['!=', ['get', 'active'], true],
        ]
    });

    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'paint': {
            'text-color': '#262626',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
        },
        'layout': {
            'icon-allow-overlap': false,
            'text-allow-overlap': false,
            'icon-image': '{icon}',
            'text-field': '{map_title}',
            'text-size': 13,
            'text-anchor': 'top',
            'icon-anchor': 'bottom',
            'text-offset': [
                0, 0
            ],
            'text-font': [
                'Suisse-Intl-Book'
            ],
        },
        'filter': [
            '!=', ['get', 'active'], true
        ]
    });


    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,

    })



    map.on('mouseenter', 'places', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
        const pic = e.features[0].properties.picture;
        const type = e.features[0].properties.type;
        const colorText = e.features[0].properties.colorText;
        const schedule = e.features[0].properties.schedule;

        let template = `
                    <h4 style='color:${colorText}'>${type}</h4>
                    <div style='text-align:center'>
                        <img width='150' height='150' src="">
                        </div>
                        <h4>${schedule}</h4>
                `

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(template).addTo(map);
    });

    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});

var selected = "all";

function showPointsByType(type) {
    if (selected != type) {
        map.getSource('places').setData({
            'type': 'FeatureCollection',
            'features': readData(type)
        });
        selected = type;
    } else {
        map.getSource('places').setData({
            'type': 'FeatureCollection',
            'features': readData()
        });
        selected = 'all';
    }
    map.flyTo({
        zoom: 11
    });


}