"use client";

import ReactMapboxGl from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiYm9iYnlnZW9yZ2UiLCJhIjoiY2xjdGN6cHp1MDljaDNvcnpsMmFmamxqbiJ9.EtiTP4EIKmgijooUldvG2w",
});

export default function GlobalMap() {
  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        flex: 1,
      }}
      fitBounds={[
        [-110, 25],
        [-90, 55],
      ]}
    ></Map>
  );
}
