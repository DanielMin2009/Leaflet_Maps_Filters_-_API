var map = L.map("mapid")
	.on("load", onMapLoad)
	.setView([41.386, 2.156], 14.4);

var tiles = L.tileLayer(
	"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	{}
).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
let data_markers = new Array();

// Array de tots els tipus de menjar de tots els restaurants
let kindsOfFood = new Array();
// Array de cada tipus de menjar, per separat
let eachKindOfFood = new Array();

function onMapLoad() {
	console.log("Load map");
	/*
	  FASE 3.1
		  1) Relleno el data_markers con una petición a la api
		  2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		  3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/
	// Em conecto a la base de dades de restaurants
	$.getJSON("http://localhost/mapa/api/apiRestaurants.php", function (restaurants) {
		let i;
		for (i = 0; i < restaurants.length; i++) {
			data_markers.push(restaurants[i]);
		}
		console.log(data_markers);

		// Creo un array amn els tipus de menjar
		$.map(restaurants, function (restaurant, i) {
			kindsOfFood.push(restaurant.kind_food);
		});
		console.log(kindsOfFood);

		// Igualo l'array de tots els tipus de menjar a l'array que vull separar i separo els seus valors 
		eachKindOfFood = kindsOfFood.toString();
		eachKindOfFood = eachKindOfFood.split(",");
		console.log(eachKindOfFood);

		// Amb el mètoded SET creo un nou array sense valors repetits. 
		// Els objectes Set són coleccions de valors, els seus elements poden ser iterats en ordre d'inserció. 
		// Un valor només pot aparèixer un cop dins el SET. Ha de ser únic.
		let cleanArray = new Set(eachKindOfFood);
		let foods = Array.from(cleanArray);
		foods.unshift("All Kinds of Food");
		foods.sort();
		console.log(foods);

		// Afegeixo la informació al select option
		let j;
		for (j = 0; j < foods.length; j++) {
			$("#kind_food_selector").append(`<option>${foods[j]}</option>`);
		}

		// Afegeixo els marcadors al mapa
		for (let marker of data_markers) {
			markers.addLayer(
				L.marker([marker.lat, marker.lng])
					.bindPopup(
						`
					<ul>
						<li>${marker.name}</li>
						<li>${marker.address}</li>
						<li>${marker.kind_food}</li>
					</ul>
					`
					)
			);
		}
		map.addLayer(markers);
	});
}

function render_to_map(data_markers, filter) {
	console.log(data_markers);
	/*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	*/

	// 1) Limpio todos los marcadores
	markers.clearLayers();

	// 2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	for (marker of data_markers) {
		if (marker.kind_food.includes(filter)) {
			markers.addLayer(L.marker([marker.lat, marker.lng])
				.bindPopup(
					`
				<ul>
					<li>${marker.name}</li>
					<li>${marker.address}</li>
					<li>${marker.kind_food}</li>
				</ul>
				`
				)
			);
		} else if (filter === "All Kinds of Food") {
			markers.addLayer(L.marker([marker.lat, marker.lng])
				.bindPopup(
					`
				<ul>
					<li>${marker.name}</li>
					<li>${marker.address}</li>
					<li>${marker.kind_food}</li>
				</ul>
				`
				)
			);
		}
	}
	map.addLayer(markers);

}

$('#kind_food_selector').on('change', function () {
	console.log(this.value);
	render_to_map(data_markers, this.value);
});
