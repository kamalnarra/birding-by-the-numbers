"use client";

import { GeoJSONSource, Layer, Map, MapRef, Popup, Source } from "react-map-gl";
import { useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { WithId } from "mongodb";
import { User } from "@/app/_lib/db";
import { Point } from "geojson";

export default function GlobalMap({ profiles }: { profiles: WithId<User>[] }) {
  const mapRef = useRef<MapRef>(null);
  const [point, setPoint] = useState<{
    profileId: string;
    birdId: number;
    birdName: string;
    lat: number;
    lon: number;
  } | null>(null);

  return (
    <Map
      onMouseMove={(event) => {
        if (event.features?.[0]?.layer.id === "unclustered-point") {
          setPoint(
            event.features[0].properties as {
              profileId: string;
              birdId: number;
              birdName: string;
              lat: number;
              lon: number;
            },
          );
        } else {
          setPoint(null);
        }
      }}
      mapboxAccessToken="pk.eyJ1IjoiYm9iYnlnZW9yZ2UiLCJhIjoiY2xjdGN6cHp1MDljaDNvcnpsMmFmamxqbiJ9.EtiTP4EIKmgijooUldvG2w"
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{
        flex: 1,
      }}
      initialViewState={{
        bounds: [
          [-110, 25],
          [-90, 55],
        ],
      }}
      interactiveLayerIds={["clusters", "unclustered-point"]}
      onClick={(event) => {
        if (!event.features) return;
        const feature = event.features[0];

        if (feature?.layer.id === "clusters") {
          const clusterId = feature.properties!.cluster_id;

          const mapboxSource = mapRef.current!.getSource(
            "earthquakes",
          ) as GeoJSONSource;

          mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) {
              return;
            }

            mapRef.current!.easeTo({
              center: (feature.geometry as Point).coordinates as [
                number,
                number,
              ],
              zoom,
              duration: 500,
            });
          });
        }
      }}
      ref={mapRef}
    >
      <Source
        id="earthquakes"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: profiles.flatMap(
            (profile) =>
              profile.birds?.map(
                ({ longitude, latitude, common_name }, index) => ({
                  type: "Feature",
                  properties: {
                    profileId: profile._id,
                    birdId: index,
                    birdName: common_name,
                    lat: parseFloat(latitude),
                    lon: parseFloat(longitude),
                  },
                  geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                  },
                }),
              ) ?? [],
          ),
        }}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer
          id="clusters"
          type="circle"
          source="earthquakes"
          filter={["has", "point_count"]}
          paint={{
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          }}
        />
        <Layer
          id="cluster-count"
          type="symbol"
          source="earthquakes"
          filter={["has", "point_count"]}
          layout={{
            "text-field": "{point_count_abbreviated}",
            "text-size": 12,
          }}
        />
        <Layer
          id="unclustered-point"
          type="circle"
          source="earthquakes"
          filter={["!", ["has", "point_count"]]}
          paint={{
            "circle-color": "#11b4da",
            "circle-radius": 8,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          }}
        />
        {point && (
          <Popup longitude={point.lon} latitude={point.lat}>
            {point.birdName}
          </Popup>
        )}
      </Source>
    </Map>
  );
}
