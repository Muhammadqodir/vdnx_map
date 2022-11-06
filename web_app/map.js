(function(w, $) {

    vdnhMap = function(options) {

        if (typeof places === undefined) {
            console.log("tes");
            return false;
        }

        var map = this;

        let settings = {
            mapbox: {
                center: [37.624130, 55.833883],
                zoom: 14,
                activeZoom: 16
            },
            allowFullscreen: true,
            fullscreenContainer: null,
            fullscreenDuration: 300,
            defaultFullscreen: false,
            type: 'places',
            places: {},
            showSlider: true,
            defaultSlider: false,
            sliderActiveFirst: false,
            sliderAction: 'short', //short - only activate place, //full - activate place and map.flyTo
            favSlider: false,
            useMobile: true,
            minZoom: 13,
            maxZoom: 20,
            styleNumber: 1,
            hoverMarker: true,
            apiUrl: 'https:vdnh.ru/local/api/',
            mapStyle: 'https://vdnh.ru/gis/api/rpc/get_style?style_number=',
            mapStyleAlt: 'https://vdnh.ru/yo_dev/map/map_style_1.php',
            mapToken: 'pk.eyJ1IjoidmRuaG1hcCIsImEiOiJjanU4ZnY5bHYxM3kzM3lrOWh2enl0MzBiIn0.xyvARfcr4SMjCbfUEmKBqQ',
            features: [],
            location: [55.826685, 37.625001]
        }

        let dependences = {
            mapboxJs: 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.js',
            mapboxCss: 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css',
            placesJs: 'https://vdnh.ru/local/templates/v3_new_header/js/places-s1.js',
            mapCss: 'https://vdnh.ru/local/css/vdnh_events/map.css'
        }

        map.params = $.extend(settings, options);

        map.mobile = {
            class: 'v__map--mobile',
            close: null,
            trigger: null
        }

        if (map.params.useMobile) {
            map.mobile = $.extend(map.mobile, {
                trigger: 'data-map-mobile',
                close: $('<div>', {
                    class: 'close close--map',
                    text: 'Скрыть карту'
                })
            });
        }

        map.obj = {
            body: $('body'),
            container: $(map),
            controls: null,
            card: null,
            slider: null,
            slides: null,
            fullscreen: null,
            fsbutton: null
        };

        if (map.params.allowFullscreen)
            map.obj.fullscreen = !map.params.fullscreenContainer ?
            $(map) :
            typeof map.params.fullscreenContainer === 'object' ?
            map.params.fullscreenContainer :
            $(map.params.fullscreenContainer);

        map.result = {
            action: '',
            default: [],
            visible: [],
            active: [],
            update: [],
            times: null,
            allowLoc: false,
            center: map.params.mapbox.center,
            zoom: map.params.mapbox.zoom,
            hovered: null,
            fullscreen: null,
            features: null
        };

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

        map.filter = function(values) {

            for (x in map.result.update) {
                let place = map.result.update[x];
                let events = place.properties.events;

                if (events === undefined)
                    return true;
            }
        }

        map.layers = function(action, layers = []) {

            map.box.addSource('places', { 'type': 'geojson', 'data': { 'type': 'FeatureCollection', 'features': [] } });

            switch (action) {
                case 'add':
                    for (x in layers) {
                        map.box.addLayer(map.data.layers[layers[x]]);
                    }
                    break;

                case 'check':

                    break;
            }
        }

        map.reinit = function(opt) {
            map.params = $.extend(map.params, opt);
            map.box = null;
            map.init();
            map.result = {
                    action: '',
                    features: [],
                    active: '',
                    center: opt.mapbox.center,
                    zoom: opt.mapbox.zoom
                }
                // map.obj.controls.remove();
        }

        map.load = async function(type) {

            let method = 'get_features';
            let url = new URL(map.params.apiUrl + method);
            url.searchParams.set('type', type);

            try {
                let response = await fetch(url);

                if (response.status == 200) {
                    let result = await response.json();
                    return JSON.parse(result);
                }

            } catch (err) {
                console.error('Error : ', err);
                return false;
            }
        }

        map.url = function(val) {

            let url = new URL(window.location.href);
            let pathname = '/' + url.pathname.split('/')[1] + '/';
            let params = url.searchParams;

            if (!params.has('filter'))
                params.append('filter', 'Y');

            if (params.has(val.key))
                params.set(val.key, val.value);
            else
                params.append(val.key, val.value);

            return pathname + url.search;
        }

        map.init = function(result = false) {

            if (!result) {
                console.warn('Features not defined in map.init');
                return false;
            }

            map.result.features = result.features;

            if (map.result.features.length == 0) {
                console.warn('Features not defined in map.init');
                return false;
            }

            if (places === undefined) {
                console.warn('Places.js not found in map.init');
                return false;
            }

            for (x in map.result.features) {
                let place_id = Number(map.result.features[x]);
                map.params.places[place_id] = places[place_id];
            }

            let errors = [];

            if (result.update !== undefined) {
                for (f in result.update) {
                    let place = map.params.places[f];
                    let upd = result.update[f];

                    if (upd['more'] !== undefined) {
                        upd['title'] = upd['title'] + '<br/><small>' + upd['more'] + '</small>';
                        upd['title_s1'] = upd['title_s1'] + '<br/><small>' + upd['more'] + '</small>';
                    }

                    if (map.params.places[f] !== undefined)
                        map.params.places[f]['properties']['url_params'] = null;
                    else {
                        errors.push(f);
                        return true;
                    }

                    for (u in upd) {
                        let val = upd[u];
                        if (u == 'url' && typeof val !== 'string') {
                            map.params.places[f]['properties']['url_params'] = val;
                            val = map.url(val);
                        }

                        map.params.places[f]['properties'][u] = val;
                    }
                }
            }

            if (errors.length > 0)
                console.warn('Following places has wrong data in map.init : ', errors);

            map.obj.card = document.createElement('div');
            map.obj.card.className = 'mapbox__marker';
            map.obj.cardHover = new mapboxgl.Marker(map.obj.card);

            map.createMapControls();
            mapboxgl.accessToken = map.params.mapToken;
            map.box = new mapboxgl.Map({
                container: map.obj.container.attr('id'),
                style: map.params.mapStyle + map.params.styleNumber,
                center: map.result.center,
                zoom: map.result.zoom,
                minZoom: map.params.minZoom,
                maxZoom: map.params.maxZoom,
                maxBounds: [
                    [37.624130 - 0.07, 55.833883 - 0.04],
                    [37.624130 + 0.07, 55.833883 + 0.04]
                ]
            });

            map.box.on("load", function(event) {

                map.layers('add', ['places-dots', 'places', 'places-active']);

                if (map.obj.fsbutton) {
                    map.obj.fsbutton.on('click', function() {
                        map.fullscreen();
                    });
                }

                map.result.action = 'init';
                map.result.update = map.set(map.result.features, 'visible', true);

                map.update();
                map.resize();
                $(window).on('resize', map.resize);

                map.box.once("render", function(event) {
                    if (map.params.allowFullscreen && map.params.defaultFullscreen)
                        map.fullscreen('set');

                    map.trigger('render', []);
                }).on("zoom", function(a, b, c) {
                    map.controls();
                }).on("zoomend", function(a, b, c) {

                }).on('mouseover', function(e) {
                    map.trigger('mouseover', []);
                }).on('mouseleave', function(e) {
                    map.trigger('mouseleave', []);
                }).on('mousemove', function(event) {
                    map.hover(event);
                }).on('click', function(event) {
                    map.click(event);
                });

                $('[data-mapbox-zoom]').on('click', function(event) {
                    map.zoom(event);
                });

                $(document).on('click', '[' + map.mobile.trigger + ']', function() {
                    action = !map.result.fullscreen ? 'set' : 'unset';
                    map.fullscreen(action);
                });

                map.trigger('init', [map]);

            });
        }

        map.click = function(event) {

            let features = map.box.queryRenderedFeatures(event.point, { layers: ['places', 'places-dots', 'places-active'] });

            if (features.length === 0)
                return false;

            let feature = features[0];

            if (map.result.fullscreen && map.obj.slider) {

                let current = map.obj.slider.find('[data-item-id="' + feature.id + '"]');
                let current_index = current.data('slick-index');

                map.obj.slider.slick('slickGoTo', current_index, false);
                return false;
            }

            if (map.check(feature.id)) {
                map.url(feature.id);
                map.active(feature.id);
            }
        }

        map.center = function(center = false, zoom = false, animate = true) {

            center = !center ? map.params.mapbox.center : center;
            zoom = !zoom ? map.params.mapbox.zoom : zoom;

            if (map.result.fullscreen)
                zoom = map.params.mapbox.zoom;

            if (animate) {
                map.box.flyTo({
                    center: center,
                    zoom: zoom
                });
            } else {
                map.box.jumpTo({
                    center: center,
                    zoom: zoom
                });
            }
        }

        map.hover = function(event) {

            if (!map.params.hoverMarker)
                return false;

            let feature = map.box.queryRenderedFeatures(event.point, { layers: ['places', 'places-dots', 'places-active'] });

            if (feature.length > 0 && !map.result.hovered && map.obj.card.innerHTML.length == 0) {

                let data = '';
                map.result.hovered = feature[0];

                if (map.result.hovered.properties.active) {
                    map.result.hovered = null;
                    map.trigger('click_active', [map, map.result.hovered]);

                    return false;
                }

                for (x in map.result.update) {
                    if (map.result.update[x].id == map.result.hovered.id)
                        data = map.result.update[x];
                }

                map.card('show', data);
                map.trigger('hover', [map, data]);

                return true;

            } else if (feature.length == 0 && map.result.hovered && map.obj.card.innerHTML.length > 0) {
                map.result.hovered = null;
                map.obj.card.innerHTML = '';
                map.card('hide');

                return false;
            }
        }

        map.check = function(feature) {
            let currentActive = map.get('active');
            return ($.inArray(feature, currentActive) < 0 || (currentActive.length > 1 && $.inArray(feature, currentActive) >= 0));
        }

        map.slider = function() {

            var current = null;
            var current_feature = false;

            map.obj.slider = $('<div>', {
                class: 'mapbox__slider'
            });

            for (x in map.result.features) {

                let item_id = map.result.features[x];
                let data = map.params.places[item_id];
                let slide = $('<div>', {
                    class: 'mapbox__marker--slide',
                    attr: {
                        'data-item-id': item_id
                    }
                });

                let title = data.properties['title_' + map.params.siteId] ?
                    data.properties['title_' + map.params.siteId] :
                    data.properties.title_s1;

                let html = '';

                html += '<div class="mapbox__marker--type">' + data.properties['type_' + map.params.siteId] + '</div>';

                if (map.params.favSlider)
                    html += '<span class="block-favorite" data-favorite="' + data.id + '" data-favorite-type="' + map.params.type + '"></span>';

                html += '<div class="mapbox__marker--title">' + title + '</div>';
                html += '<div class="mapbox__marker--time">' + data.properties.time + '</div>';

                if (data.properties.pic)
                    html += '<div class="mapbox__marker--pic" style="background-image: url(' + data.properties.pic + ')">';

                if (map.params.defaultFullscreen)
                    html += '<span class="mapbox__marker--more">подробно</span>';

                if (data.properties.pic)
                    html += '</div>';

                slide.html(html);

                map.obj.slider.append(slide);
            }

            map.obj.body.append(map.obj.slider);

            map.obj.slides = map.obj.slider.find('.mapbox__marker--slide');

            map.obj.slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {

                let current = $(slick.$slides[currentSlide]);
                let feature = current.data('item-id');

                if (map.check(feature))
                    map.active(feature, true, true);

                $('.feature-active').each(function() {
                    $(this).removeClass('feature-active');
                });

                current.addClass('feature-active');

                map.trigger('slider_change', [map, map.obj.slider, current, feature]);
            });

            map.obj.slider.on('init', function(slick) {
                map.on('show', function(event, map, features, update, active) {
                    map.obj.slides.each(function() {
                        let item = $(this);
                        let item_id = item.data('item-id');

                        if ($.inArray(item_id, features) < 0) {
                            item.hide();
                        } else {
                            item.show();
                        }
                    });
                });
            });

            map.obj.slider.slick({
                'accessibility': true,
                'autoplay': false,
                'adaptiveHeight': true,
                'draggable': true,
                'infiniti': true,
                'LazyLoad': 'progressive',
                'fade': false,
                'swipe': true,
                'prevArrow': false,
                'nextArrow': false,
                'TouchMove': true,
                'touchThreshold': 5,
                'pauseOnFocus': true,
                'variableWidth': true,
                'swipeToSlide': true,
                'swipe': true
            });

            map.obj.slides.each(function() {
                $(this).on('click', function() {
                    let slide = $(this);
                    let index = slide.index();

                    if (!slide.hasClass('feature-active')) {
                        map.obj.slider.slick('slickGoTo', index, false);
                    } else {
                        let feature = slide.data('item-id');
                        let place = map.params.places[feature];

                        map.trigger('active_slide_click', [feature, place]);
                    }
                });
            });

            map.on('fullscreen_set', function() {

                var active = map.get('active');
                var current = false;

                if (active.length == 1) {
                    current = map.obj.slider.find('[data-item-id="' + active[0] + '"]');
                } else if (active.length == 0 && map.params.sliderActiveFirst) {
                    current = $(map.obj.slides[0]);
                }

                if (current) {
                    let current_feature = current.data('item-id');
                    let current_index = current.data('slick-index');

                    map.obj.slider.slick('slickGoTo', current_index, false);
                }
            });
        }

        map.fullscreen = function(action = false) {

            map.result.fullscreen = !map.result.fullscreen ? true : false;

            if (map.obj.fsbutton)
                map.obj.fsbutton.find('svg').toggle();

            let activePlace = map.params.places[map.get('active')[0]];
            let hasActive = activePlace !== undefined;
            let center = hasActive ? activePlace.geometry.coordinates : map.params.mapbox.center;

            if (!action)
                action = map.result.fullscreen ? 'set' : 'unset';

            if (action && action == 'set') {

                map.trigger('before_fullscreen_set');

                if (!map.obj.slider && map.params.showSlider)
                    map.slider();

                map.obj.fullscreen.addClass('v__map--fullscreen');

                map.params.hoverMarker = false;

                if (map.obj.container.hasClass(map.mobile.class))
                    map.obj.container.animate({ opacity: 1 }, map.params.fullscreenDuration);

                setTimeout(function() {

                    if (!map.obj.container.hasClass(map.mobile.class) && hasActive)
                        map.center(center, map.params.mapbox.zoom);

                    if (map.obj.slider) {
                        map.obj.slider.addClass('v__map--active');
                        map.obj.body.addClass('v__pos--fixed');
                    }

                    map.trigger('fullscreen_set');

                }, Math.floor(map.params.fullscreenDuration + 50));

            } else if (action && action == 'unset') {

                map.trigger('before_fullscreen_unset');

                map.obj.body.removeClass('v__pos--fixed');

                if (map.obj.container.hasClass(map.mobile.class))
                    map.obj.container.animate({ opacity: 0 }, Math.floor(map.params.fullscreenDuration - 150));

                if (map.obj.slider) {
                    map.obj.slider.removeClass('v__map--active');
                    map.obj.fullscreen.removeClass('v__map--fullscreen');
                }

                setTimeout(function() {
                    if (!map.obj.container.hasClass(map.mobile.class) && hasActive)
                        map.center(center, 16);

                    map.params.hoverMarker = true;

                    map.trigger('fullscreen_unset');

                }, map.params.fullscreenDuration);
            }

            var mw = 0;
            var mto = setInterval(function() {
                map.box.resize();
                mw = Math.floor(mw + 1);
                mw == map.params.fullscreenDuration ? clearInterval(mto) : null;
            }, 1);
        }

        map.card = function(action, data = false) {

            if ($(window).width() < 1024)
                return false;

            if (action == 'show') {

                let title = data.properties['title_' + map.params.siteId] ?
                    data.properties['title_' + map.params.siteId] :
                    data.properties.title_s1;

                map.box.getCanvas().style.cursor = 'pointer';

                map.obj.card.innerHTML = '<div class="mapbox__marker--inner">' +
                    '<div class="mapbox__marker--type">' + data.properties['type_' + map.params.siteId] + '</div>' +
                    '<div class="mapbox__marker--title">' + title + '</div>' +
                    '<div class="mapbox__marker--time">' + data.properties.time + '</div>' +
                    '<div class="mapbox__marker--pic" style="background-image: url(' + data.properties.pic + ')"></div>' +
                    '</div>';

                map.obj.cardHover.setLngLat(data.geometry.coordinates).addTo(map.box);
                $(".mapbox__marker--inner").addClass("fadeIn");

            } else {
                map.box.getCanvas().style.cursor = '';
                $(".mapbox__marker--inner").removeClass("fadeIn");
            }
        }

        map.zoom = function(event) {

            if (!$(event.target).hasClass('mapbox__zoom'))
                return false;

            let zoom = Math.floor(map.box.getZoom());
            let new_zoom = $(event.target).data('mapbox-zoom') == 'plus' ? zoom + 1 : zoom - 1;
            let active = map.box.queryRenderedFeatures(event.point, { layers: ['places-active'] })[0];
            let center = map.box.getCenter();

            if (new_zoom < map.params.minZoom || new_zoom > map.params.maxZoom)
                return false;

            if (active !== undefined) {
                center = new_zoom == map.params.minZoom ?
                    map.params.mapbox.center :
                    active.geometry.coordinates;
            }

            map.box.flyTo({
                center: center,
                zoom: new_zoom
            });
        }

        map.controls = function() {

            let zoom = map.box.getZoom();

            if (zoom == map.params.minZoom)
                $('[data-mapbox-zoom="minus"]').css({ opacity: 0.3, pointerEvents: 'none' });
            else
                $('[data-mapbox-zoom="minus"]').css({ opacity: 1, pointerEvents: 'auto' });

            if (zoom == map.params.maxZoom)
                $('[data-mapbox-zoom="plus"]').css({ opacity: 0.3, pointerEvents: 'none' });
            else
                $('[data-mapbox-zoom="plus"]').css({ opacity: 1, pointerEvents: 'auto' });
        }

        map.get = function(data, value = true, full = false) {

            if (data === undefined)
                return false;

            var result = [];
            for (x in map.params.places) {
                let place = map.params.places[x];
                if (place.properties[data] !== undefined && place.properties[data] == value) {
                    let res = full ? place : place.id
                    result.push(res);
                }
            }

            return result;
        }

        map.show = function(features) {
            map.result.update = map.set(features, 'visible', true);
            map.update();

            map.trigger('show', [map, features, map.result.update, map.get('active')]);
        }

        map.active = function(feature, value = true, animate = true, link = false) {

            map.card('hide');

            feature = $.isArray(feature) ? feature : [feature];

            var places = [];
            var errors = [];

            for (x in feature) {
                feature[x] = Number(feature[x]);
                let place = map.params.places[feature[x]];
                if (place !== undefined)
                    places.push(place);
                else
                    errors.push(x);
            }

            if (errors.length > 0) {
                console.warn('Place not found in map.active', errors);
                return false;
            }

            let multiple = true;
            let active = map.get('active');

            if (value && active)
                map.set(active, 'active', false);

            map.set(feature, 'active', value);
            map.update();

            if (places.length == 1) {
                multiple = false;

                if (value && animate)
                    map.center(places[0].geometry.coordinates, 16);
            }

            if (!value && map.obj.slides) {
                map.obj.slides.each(function() {
                    if ($(this).hasClass('feature-active')) {
                        $(this).removeClass('feature-active');
                    }
                });
            }

            if (value)
                link = link ? link : places[0].properties.url;

            map.trigger('active', [feature, places, value, active, multiple, link]);
        }

        map.reset = function(deactivate = true) {

            if (deactivate)
                map.active(map.get('active'), false);

            map.show(map.result.features);
            map.center();

            map.trigger('reset', [map]);
        }

        map.clear = function() {
            map.show([]);
            map.active(map.get('active'), false);
        }

        map.set = function(features, action, value) {

            var result = [];
            var errors = [];

            if (!$.isArray(features))
                features = [features];

            for (var x in features) {

                let place = map.params.places[features[x]];

                if (place === undefined) {
                    errors.push(features[x]);
                } else {
                    map.params.places[features[x]].properties[action] = value;
                    result.push(place);
                }
            }

            if (errors.length)
                console.warn('Places not found in map.set : ', errors);

            return result;
        }

        map.update = function() {

            let features = [];
            let source = map.box.getSource('places');

            if (source === undefined) {
                map.trigger('update_errors', [action, 'map update error']);
                return false;
            }

            source.setData({ "type": "FeatureCollection", "features": map.result.update });

            map.trigger('update', [map.result.update, map.get('active')]);
        }

        map.resize = function() {

            map.box.resize();

            if ($(window).width() > 1024 && map.obj.container.hasClass(map.mobile.class)) {
                map.obj.container.removeClass(map.mobile.class).css({ opacity: 1 });

                if (map.obj.fsbutton)
                    map.obj.fsbutton.show();

            } else if ($(window).width() <= 1024 && !map.obj.container.hasClass(map.mobile.class)) {
                map.obj.container.addClass(map.mobile.class).css({ opacity: 0 });

                if (map.obj.fsbutton)
                    map.obj.fsbutton.hide();
            }
        }

        map.data = {
            layers: {
                'places-dots': {
                    'id': 'places-dots',
                    'type': 'circle',
                    'source': 'places',
                    'paint': {
                        'circle-translate': [0, -10],
                        'circle-radius': [
                            'interpolate', ['linear'],
                            ['zoom'],
                            13, 2,
                            15, 5
                        ],
                        'circle-color': ['get', 'color'],
                        'circle-stroke-color': '#ffffff',
                        'circle-stroke-width': 1,
                    },
                    'filter': [
                        'all', ['==', ['get', 'visibility'], 'visible'],
                        ['!=', ['get', 'active'], true],
                    ]
                },
                'places': {
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
                },
                'places-active': {
                    'id': 'places-active',
                    'type': 'symbol',
                    'source': 'places',
                    'paint': {
                        'text-color': '#262626',
                        'text-halo-color': '#ffffff',
                        'text-halo-width': 1,
                    },
                    'layout': {
                        'icon-allow-overlap': true,
                        'text-allow-overlap': true,
                        'icon-image': '{icon}-active',
                        'text-field': '{map_title}',
                        'text-size': 13,
                        'text-anchor': 'top',
                        'icon-anchor': 'bottom',
                        'text-font': [
                            'Suisse-Intl-Book'
                        ],
                    },
                    'filter': [
                        '==', ['get', 'active'], true
                    ]
                }
            }
        }

        map.utils = {

            prepareMethod: function(str) {
                return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
                    return index === 0 ? word.toLowerCase() : word.toUpperCase();
                }).replace(/\s+/g, '');
            },

            sclon: function(n, text_forms) {
                n = Math.abs(n) % 100;
                var n1 = n % 10;
                if (n > 10 && n < 20) { return text_forms[2]; }
                if (n1 > 1 && n1 < 5) { return text_forms[1]; }
                if (n1 == 1) { return text_forms[0]; }
                return text_forms[2];
            },

            resize: function() {

            }
        };

        if (map.params.features.length == 0) {
            map.load(map.params.type)
                .then(result => map.init(result));
        } else {
            map.init({ features: map.params.features });
        }

        return map;
    }

})(window, jQuery);