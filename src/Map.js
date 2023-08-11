import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef } from "react";
import locations from "./mariupol-sites.json";
import "./Map.css";

mapboxgl.accessToken = 'pk.eyJ1IjoibWl0cmliZWxsIiwiYSI6ImNsa255MTNreDBlOGEzY29jYWx4ODJha3oifQ.199uSeHfeHSrqDj2qBrMOQ';

const Map = () => {
    const mapContainerRef = useRef(null);    

    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mitribell/clkp04typ003q01qx6seodzc7",
        center: [37.57, 47.1],
        zoom: 12,
        // maxBounds: [[37.0, 47.3],[38.0, 47.0]]
        });

        /* Assign a unique ID to each store */
        locations.features.forEach(function (location) {
          location.properties.id = location.id;
        });

        function buildLocationList(locations) {
          const listings = document.getElementById('listings');                     
          listings.innerHTML = ""; 
          for (const location of locations.features) {
            /* Add a new listing section to the sidebar. */            
            const listing = listings.appendChild(document.createElement('div'));
            /* Assign a unique `id` to the listing. */
            listing.id = `listing-${location.id}`;
            /* Assign the `item` class to each listing for styling. */
            listing.className = 'hover:bg-cyan-100 p-6 max-w-sm mx-auto bg-white flex items-center space-x-4';

            /* Add image to each element of listing */
            const img = listing.appendChild(document.createElement('img'));
            img.src = `./img/${location.properties.id}.png`;
            img.alt = `${location.properties.Name}`;
            img.className = 'aspect-square object-cover block mx-auto h-24 sm:mx-0 sm:shrink-0';
        
            /* Add titles to the individual listing created above. */
            const listText = listing.appendChild(document.createElement('div'));
            const title = listText.appendChild(document.createElement('div'));
            title.className = 'text-xl font-medium text-black';
            title.id = `link-${location.id}`;
            title.innerHTML = `${location.properties.Name}`;            
        
            /* Add details to the individual listing. */            
            if (location.properties.Object) {
              const details = listText.appendChild(document.createElement('div'));
              details.className = 'text-slate-500 inline';
              details.innerHTML += `${location.properties.Object}`;
            }            

            title.addEventListener('click', function () {
              for (const feature of locations.features) {
                if (this.id === `link-${feature.properties.id}`) {
                  flyToLocation(feature);
                  createPopUp(feature);
                }
              }
              const activeItem = document.getElementsByClassName('active');
              if (activeItem[0]) {
                activeItem[0].classList.remove('active');
              }
              this.parentNode.classList.add('active');
            });
          }
        }
        
        function addMarkers() {
          /* For each feature in the GeoJSON object above: */
          for (const marker of locations.features) {
            /* Create a div element for the marker. */
            const el = document.createElement('div');
            /* Assign a unique `id` to the marker. */
            el.id = `marker-${marker.properties.id}`;
            /* Assign the `marker` class to each marker for styling. */
            el.className = 'marker';
        
            /**
             * Create a marker using the div element
             * defined above and add it to the map.
             **/
            new mapboxgl.Marker(el, { offset: [0, 10] })
              .setLngLat(marker.geometry.coordinates)
              .addTo(map);
        
              el.addEventListener('click', (e) => {
                /* Fly to the point */
                flyToLocation(marker);
                /* Close all other popups and display popup for clicked store */
                createPopUp(marker);
                /* Highlight listing in sidebar */
                const activeItem = document.getElementsByClassName('active');
                e.stopPropagation();
                if (activeItem[0]) {
                  activeItem[0].classList.remove('active');
                }
                const listing = document.getElementById(`listing-${marker.properties.id}`);
                listing.classList.add('active');
              });
          }
        }
        
        function createPopUp(currentFeature) {
          const popUps = document.getElementsByClassName('mapboxgl-popup');
          /** Check if there is already a popup on the map and if so, remove it */
          if (popUps[0]) popUps[0].remove();
        
          const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(currentFeature.geometry.coordinates)
            .setHTML(
                    `<h3>${currentFeature.properties.Name}</h3>
                    <img src="./img/${currentFeature.properties.id}.png" />
                    <p>${currentFeature.properties.description}</p>
                    <button class="bg-sky-500 hover:bg-sky-700">
                      Some text
                    </button>
                    `
              )
            .addTo(map);
        }
                
        function flyToLocation(currentFeature) {
          map.flyTo({
            center: currentFeature.geometry.coordinates,
            zoom: 18
          });
        }

        map.on('load', () => {
          /* Add the data to your map as a layer */
          // map.resize();
          map.addSource('places', {
            type: 'geojson',
            data: locations
          });
          addMarkers();
        });
        
        window.onresize = () => {
          map.resize();
        };

        // console.log(locations.features.filter(feature => feature.properties.Name.toLowerCase().includes('3D'.toLowerCase())));
        const mySearch = document.getElementById('search');
        mySearch.addEventListener('input', (e) => {
          const filteredLocations = { "features" : locations.features.filter(feature => feature.properties.Name.toLowerCase().includes(e.target.value.toLowerCase()))};
          console.log(filteredLocations);
          buildLocationList(filteredLocations);
        });

        buildLocationList(locations);

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Clean up on unmount
        return () => map.remove();
    }, []);    

    return <div id="map" className="md:basis-3/4 basis-full h-screen" ref={mapContainerRef} />;
};

export default Map;