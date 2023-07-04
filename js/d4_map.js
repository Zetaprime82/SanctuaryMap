var mapBounds = L.latLngBounds(L.latLng(-800, -500), L.latLng(500, 800));
var map = new L.Map('map', { minZoom: 0, maxZoom: 18, crs: L.CRS.Simple, attributionControl: false, zoomControl: false, preferCanvas: true, maxBounds: mapBounds }).setView([-100, 100], 3);
<img src="img/zone/zone_dry_steppes.png" class="leaflet-marker-icon active zoneName undefined leaflet-zoom-animated leaflet-interactive" style="margin-left: -75px; margin-top: -10px; width: 150px; height: 20px; transform: translate3d(701px, 304px, 0px); z-index: 304; outline: none;" alt="Marker" tabindex="0" role="button">
<img src="img/zone/zone_kehjistan.png" class="leaflet-marker-icon active zoneName undefined leaflet-zoom-animated leaflet-interactive" style="margin-left: -75px; margin-top: -10px; width: 150px; height: 20px; transform: translate3d(649px, 467px, 0px); z-index: 467;" alt="Marker" tabindex="0" role="button">
<img src="img/zone/zone_hawezar.png" class="leaflet-marker-icon active zoneName undefined leaflet-zoom-animated leaflet-interactive" style="margin-left: -75px; margin-top: -10px; width: 150px; height: 20px; transform: translate3d(1103px, 570px, 0px); z-index: 570;" alt="Marker" tabindex="0" role="button">
<img src="img/zone/zone_fractured_peaks.png" class="leaflet-marker-icon active zoneName undefined leaflet-zoom-animated leaflet-interactive" style="margin-left: -75px; margin-top: -10px; width: 150px; height: 20px; transform: translate3d(1101px, 314px, 0px); z-index: 314;" alt="Marker" tabindex="0" role="button">
<img src="img/zone/zone_scosglen.png" class="leaflet-marker-icon active zoneName undefined leaflet-zoom-animated leaflet-interactive" style="margin-left: -75px; margin-top: -10px; width: 150px; height: 20px; transform: translate3d(1003px, 180px, 0px); z-index: 180;" alt="Marker" tabindex="0" role="button">
var tileLayerBounds = L.latLngBounds(L.latLng(-185, 5), L.latLng(-5, 185));
var tileLayer = L.tileLayer('img/Sanctuary/{z}/{x}/{y}.png', { minZoom: 0, maxZoom: 18, noWrap: true, tms: false, maxNativeZoom: 4, bounds: tileLayerBounds }).addTo(map);

var altarIcon = { url: 'img/mapicons/Altar_Of_Lilith.webp', size: [30, 30] };
var dungeonIcon = { url: 'img/mapicons/Dungeon.webp', size: [30, 30] };
var cellarIcon = { url: 'img/mapicons/Cellar.webp', size: [30, 30] };
var waypointIcon = { url: 'img/mapicons/Waypoint.webp', size: [30, 30] };
var chestIcon = { url: 'img/mapicons/Helltide_Chest.webp', size: [30, 30] };
var eventIcon = { url: 'img/mapicons/Event.webp', size: [30, 30] };
var questIcon = { url: 'img/mapicons/Side_Quest.webp', size: [30, 30] };
var worldbossIcon = { url: 'img/mapicons/World_Boss.webp', size: [30, 30] };
var legioneventIcon = { url: 'img/mapicons/Legion_Event.webp', size: [30, 30] };
var namesToSearch = [];
var markers = [];
var locationMap = [];
var overlayMapNames = ['Waypoints', 'Dungeons', 'Altars of Lilith', 'Cellars', 'Helltide Chests', 'Events', 'Side Quests', 'World Boss', 'Legion Event'];
var icons = [waypointIcon, dungeonIcon, altarIcon, cellarIcon, chestIcon, eventIcon, questIcon, worldbossIcon, legioneventIcon];
var groupings = [waypoints, dungeons, altars, cellars, chests, events, sidequests, worldboss, legionevents];
var overlayMaps = {};

var urlParams = new URLSearchParams(window.location.search);
var x = urlParams.get('x');
var y = urlParams.get('y');
var cow = urlParams.get('cow');

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}
function getMap(x, y) {
    var points = rotate(1449, 2909, x, y, -45);
    var rotatedScaledX = points[0] * 1.0666667 * 194 / 4096;
    var rotatedScaledY = points[1] * 1.0666667 * 194 / 4096;
    var mapX = -146.5 - rotatedScaledY;
    var mapY = 194 - rotatedScaledX;
    return [mapX, mapY];
}


if(x != null && y != null)
{
    var points = rotate(1449, 2909, x, y, -45);
    var rotatedScaledX = points[0] * 1.0666667 * 194 / 4096;
    var rotatedScaledY = points[1] * 1.0666667 * 194 / 4096;
    var mapX = -146.5 - rotatedScaledY;
    var mapY = 194 - rotatedScaledX;
    L.marker([mapX, mapY]).addTo(map);
    map.flyTo([mapX, mapY], 5);
}
else if (cow != null)
{
    var cowIcon = { url: 'img/mapicons/cow.png', size: [30, 30] };
    var markers = [];
    var locationMap = [];
    var overlayMapNames = ['ambient_cow', 'other cows'];
    var overlayMaps = {};

    var ambient = L.layerGroup();
    var other = L.layerGroup();
    for (m of cows) {
        var tooltip = m.name;
        var grouping = tooltip.includes('ambient_cow') ? ambient : other;
        var pos = [m.x, m.y];// getMap(m.x, m.y);
        markers.push({name: m.name, marker: L.canvasMarker(pos, {img: cowIcon}).addTo(grouping).bindTooltip(tooltip)});
        locationMap[tooltip] = pos;
    }
    ambient.addTo(map);
    other.addTo(map);
    overlayMaps['ambient_cow'] = ambient;
    overlayMaps['other cows'] = other;
}
else
{
    for (let i = 0; i < territories.names.length; i++) {
        var territoryName = territories.names[i];
        var points = territories.points[i].map((point) => getMap(point.x, point.y));
        
        var latlngs = [[0, 0],[-100,0],[-100,100],[0,100]];
        var polygon = L.polygon(points, {fill: false, color: 'grey', weight: 2}).addTo(map).bindTooltip(territoryName);
    }
    for (let i = 0; i < groupings.length; i++) {
        var g = groupings[i];
        var icon = icons[i];
        var group = L.layerGroup();
        for (m of g) {
            var tooltip = m.name;
            if (m.description != null) tooltip += '</br>' + m.description;
            namesToSearch.push(tooltip);
            var pos = getMap(m.x, m.y);
            var marker = L.canvasMarker(pos, {img: icon}).addTo(group).bindTooltip(tooltip);
            markers.push({name: m.name, marker: marker});
            locationMap[tooltip] = pos;
        }
        group.addTo(map);
        overlayMaps[overlayMapNames[i]] = group;
    }
}

var layerControl = L.control.layers(null, overlayMaps).addTo(map);

var oms = new OverlappingMarkerSpiderfier(map);
for (let i = 0; i < markers.length; i++) {
    var marker = markers[i].marker;
    oms.addMarker(marker);
}

var fuse = new Fuse(namesToSearch, { shouldSort: true, threshold: 0.2, location: 0, distance: 1000, minMatchCharLength: 1});
var searchbox = L.control.searchbox({ position: 'topright', expand: 'left'}).addTo(map);
searchbox.onInput("keyup", function (e) {
    var value = searchbox.getValue();
    if (value != "") {
        var results = fuse.search(value);
        searchbox.setItems(results.map(res => res.item).slice(0, 5));
        $('.leaflet-searchbox-autocomplete-item').each(function(){                
            $(this)[0].onclick = function() {
                map.flyTo(locationMap[$(this)[0].textContent], 5);
            };
         });
    } else {
        searchbox.clearItems();
    }
});
