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

        map.on('click', (event) => {
          /* Determine if a feature in the "locations" layer exists at that point. */
          const features = map.queryRenderedFeatures(event.point, {
            layers: ['locations']
          });
        
          /* If it does not exist, return */
          if (!features.length) return;
        
          const clickedPoint = features[0];
        
          /* Fly to the point */
          flyToLocation(clickedPoint);
        
          /* Close all other popups and display popup for clicked store */
          createPopUp(clickedPoint);          
        
          /* Highlight listing in sidebar (and remove highlight for all other listings) */
          const activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          const listing = document.getElementById(
            `listing-${clickedPoint.properties.id}`
          );
          listing.classList.add('active');
        });

        function buildLocationList(locations) {
          for (const location of locations.features) {
            /* Add a new listing section to the sidebar. */
            const listings = document.getElementById('listings');
            const listing = listings.appendChild(document.createElement('div'));
            /* Assign a unique `id` to the listing. */
            listing.id = `listing-${location.id}`;
            /* Assign the `item` class to each listing for styling. */
            listing.className = 'item';
        
            /* Add the link to the individual listing created above. */
            const link = listing.appendChild(document.createElement('a'));
            link.href = `#`;
            link.className = 'title';
            link.id = `link-${location.id}`;
            link.innerHTML = `${location.properties.Name}`;
        
            link.addEventListener('click', function () {
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
        
            /* Add details to the individual listing. */
            const details = listing.appendChild(document.createElement('div'));
            details.innerHTML = `${location.properties.Name}`;
            if (location.properties.Object) {
              details.innerHTML += ` · ${location.properties.Object}`;
            }
            if (location.properties.distance) {
              const roundedDistance = Math.round(location.properties.distance * 100) / 100;
              details.innerHTML += `<div><strong>${roundedDistance} miles away</strong></div>`;
            }
          }
        }

        map.on('load', () => {
          /* Add the data to your map as a layer */
          map.addLayer({
            id: 'locations',
            type: 'circle',
            /* Add a GeoJSON source containing place coordinates and information. */
            source: {
              type: 'geojson',
              data: locations
            }
          });
        });        

        buildLocationList(locations);

        function flyToLocation(currentFeature) {
          map.flyTo({
            center: currentFeature.geometry.coordinates,
            zoom: 18
          });
        }
        
        function createPopUp(currentFeature) {
          const popUps = document.getElementsByClassName('mapboxgl-popup');
          /** Check if there is already a popup on the map and if so, remove it */
          if (popUps[0]) popUps[0].remove();
        
          const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(currentFeature.geometry.coordinates)
            .setHTML(`<h3>Sweetgreen</h3><h4>${currentFeature.properties.Name}</h4>`)
            .addTo(map);
        }      

        // // Create default markers
        // geoJson.features.map((feature) =>
        // new mapboxgl.Marker()
        //     .setLngLat(feature.geometry.coordinates)
        //     .setPopup(
        //         new mapboxgl.Popup({ 
        //           offset: 25                  
        //         }) // add popups
        //           .setHTML(
        //             `<h3>${feature.properties.Name}</h3>
        //             <img src="./img/${feature.id}.png" />
        //             <p>${feature.properties.description}</p>
        //             <button class="bg-sky-500 hover:bg-sky-700">
        //               Some text
        //             </button>
        //             `
                    
        //           )
        //       )
        //     .addTo(map)
        // );        

                

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Clean up on unmount
        return () => map.remove();
    }, []);    

    return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;