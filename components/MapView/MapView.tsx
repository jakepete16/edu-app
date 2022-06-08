import tagline from "assets/images/hopeedulogo.png";
import { PopoverItem } from "components";
import { navbarHeight } from "components/Navigation";
import { NavPositionContext } from "contexts";
import GoogleMapReact from "google-map-react";
import { Mappable } from "models/Mappable";
import React, { useContext, useState } from "react";
import { ListGroup, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { ClusterFeature, PointFeature } from "supercluster";
import useSupercluster from "use-supercluster";
import { getPinOpacity, getPinSize, getPinZIndex } from "utilities";
import "./MapView.scss";

// Tutorial followed for clustering: https://www.leighhalliday.com/google-maps-clustering

interface MapViewProps<I extends Mappable> {
  /** Whether the map should be displayed in the background, i.e. behind primary elements. */
  background?: boolean;
  /** Array of data to be displayed on the map. */
  data?: I[];
  /** Default zoom level. */
  defaultZoom?: number;
  /** Whether the data is still loading. */
  isLoading?: boolean;
}

/** Component that renders data on a map. */
export function MapView<I extends Mappable>({
  defaultZoom,
  background,
  isLoading,
  data,
}: MapViewProps<I>): JSX.Element {
  const [mapZoom, setMapZoom] = useState(defaultZoom || 8 );
  const [mapBounds, setMapBounds] = useState<[number, number, number, number]>([-1, -1, -1, -1]);
  const { navPosition } = useContext(NavPositionContext);

  /* generate a cluster or pointer according to the single item */
  const points: PointFeature<I>[] = data
    ? data.map((item: I) => {
        return {
          geometry: { coordinates: [item.longitude, item.latitude], type: "Point" },
          properties: item,
          type: "Feature",
        };
      })
    : [];

  /* using React Hook to generate clusters of item */
  const { clusters, supercluster } = useSupercluster({
    bounds: mapBounds,
    options: { maxZoom: 20, radius: 114 },
    points,
    zoom: mapZoom,
  });

  return (
    <>
      <div
        className={`map-container${background ? " background" : " foreground-map"}`}
        style={navPosition === "bottom" ? { top: `-${navbarHeight}` } : {}}
      >
        {isLoading && (
          <div className="pending-map-container">
            <Spinner animation="border" variant="light" />
          </div>
        )}
        {!background && <Tagline />}
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY || "" }}
          defaultCenter={{
            lat: 42.870859,
            lng: -85.865036,
          }}
          zoom={mapZoom}
          options={{ maxZoom: 15, zoomControl: !background }}
          onChange={({ zoom, bounds }) => {
            setMapZoom(zoom);
            setMapBounds([bounds.nw.lng, bounds.se.lat, bounds.se.lng, bounds.nw.lat]);
          }}
        >
          {clusters.map(pointOrCluster => {
            /* Regardless of whether pointOrCluster is a PointFeature<ClusterProperties> or a PointFeature<I>, it has a
             * 'geometry' property that we can use to get the latitude and longitude. */
            const [longitude, latitude] = pointOrCluster.geometry.coordinates;

            /* If pointOrCluster is a ClusterFeature<I>, then it has 'cluster' and 'cluster_id' properties.
             * We can use these to display cluster information on the map. */
            const cluster = pointOrCluster as ClusterFeature<I>;
            const { cluster: isCluster, cluster_id: clusterId } = cluster.properties;

            /* Otherwise, pointOrCluster is just a PointFeature<I>, and its 'properties' property is the I object itself. */
            const point = pointOrCluster as PointFeature<I>;
            const item = point.properties;

            /* If isCluster, return the element that should display for cluster pins. */
            if (isCluster) {
              const leaves = supercluster?.getLeaves(clusterId, Infinity);
              return (
                <ClusterPin
                  id={clusterId.toString()}
                  items={leaves?.map(pt => pt.properties) || []}
                  totalNumPoints={clusters.length}
                  key={clusterId}
                  lat={latitude}
                  lng={longitude}
                />
              );
            }

            /* Otherwise, return the element that should display for item pins. */
            return (
              <ItemPin
                item={item}
                key={item.id}
                lat={latitude}
                lng={longitude}
                totalNumPoints={clusters.length}
              />
            );
          })}
        </GoogleMapReact>
        {/* These divs are to block the buttons in the map */}
        <div className="click-blocker left"> </div>
        <div className="click-blocker right"> </div>
      </div>
    </>
  );
}

/* creating an interface for the ClusterPin function, for easier Cluster Pin generation */
interface ClusterPinProps<I extends Mappable> {
  id: string;
  items: I[];
  totalNumPoints: number;
  lat: number;
  lng: number;
}

/** Creating the ClusterPin based on the interface above */
/** Calling this function will create the Cluster Pin with properties and styles */
function ClusterPin<I extends Mappable>({
  id,
  items,
  totalNumPoints,
}: ClusterPinProps<I>): JSX.Element {
  // Calculate the size of the pin. Better done programatically than in CSS.
  const size = getPinSize(items.length, totalNumPoints);
  return (
    <PopoverTrigger popoverId={id} items={items}>
      <button
        type="button"
        className="cluster-marker"
        style={{
          height: `${size}px`,
          opacity: 1,
          width: `${size}px`,
          zIndex: getPinZIndex(items.length),
        }}
      >
        <span>{items.length}</span>
      </button>
    </PopoverTrigger>
  );
}

/* creating an interface for the ItemPin functoin, for easier ItemPin generation */
interface ItemPinProps<I extends Mappable> {
  item: I;
  lat: number;
  lng: number;
  totalNumPoints: number;
}

/** Creating the ItemPin based on the interface above */
/** Calling this function will create the ItemPin with properties and styles */
function ItemPin<I extends Mappable>({ item, totalNumPoints }: ItemPinProps<I>): JSX.Element {
  let iconName;
  switch (item.type) {
    case "student-teacher":
      iconName = "fas fa-user";
      break;
    case "hired":
      iconName = "fas fa-user";
      break;
    case "career":
      iconName = "fas fa-briefcase";
      break;
    default:
      iconName = "fas fa-map-pin";
  }
  const size = getPinSize(1, totalNumPoints);
  return (
    <PopoverTrigger popoverId={item.id.toString()} item={item}>
      <button
        type="button"
        className="point-marker"
        style={{
          height: `${size}px`,
          opacity: 1,
          width: `${size}px`,
          zIndex: getPinZIndex(1),
        }}
      >
        <i className={iconName} />
      </button>
    </PopoverTrigger>
  );
}

/* creating an interface for the PopoverTrigger function for easier Popover list generation */
interface PopoverTriggerProps<I extends Mappable> {
  popoverId: string;
  item?: I;
  items?: I[];
  children: React.ReactElement;
}

/** Creating the Popover based on the interface above */
/** Calling this function will create the Popover with a list of items and styles */
function PopoverTrigger<I extends Mappable>({
  popoverId,
  item,
  items,
  children,
}: PopoverTriggerProps<I>): JSX.Element {
  return (
    <OverlayTrigger
      trigger="focus"
      placement="auto"
      overlay={
        <Popover id={`popover-${popoverId.toString()}`} className="map-popover">
          <Popover.Content>
            {/** generate a list of PopoverItem using the PopoverItem file */}
            {items ? (
              <ListGroup variant="flush">
                {items.map(i => (
                  <ListGroup.Item key={i.id}>
                    <PopoverItem item={i} />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              item && (
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <PopoverItem item={item} />
                  </ListGroup.Item>
                </ListGroup>
              )
            )}
          </Popover.Content>
        </Popover>
      }
    >
      {children}
    </OverlayTrigger>
  );
}

function Tagline(): JSX.Element {
  return (
    <div id="tagline-div">
      
      <h1 id="tagline">
      Bringing Hope to the World
      Through Education
      </h1 > 
      
      
    </div>
  );
}
