import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import geoJson from "./mariupol-sites.json";
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

        // Create default markers
        geoJson.features.map((feature) =>
        new mapboxgl.Marker()
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                  .setHTML(
                    `<h3>${feature.properties.Name}</h3>
                    <img src="./img/${feature.id}.png" />
                    <p>${feature.properties.description}</p>`
                  )
              )
            .addTo(map)
        );        

                

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Clean up on unmount
        return () => map.remove();
    }, []);    

    return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;