import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

interface MapProps {
  position: {
    lat: number,
    lng: number
  }
}

function TrucksMap(props: MapProps) {
  return (
    <APIProvider apiKey={'AIzaSyC4Z5Qz97EWcoCczNn2IcYvaYG0L9pe6Rk'}>
      <Map defaultCenter={props.position} center={props.position} defaultZoom={15}>
        <Marker position={props.position} />
      </Map>
    </APIProvider>
  );
}

export default TrucksMap;
