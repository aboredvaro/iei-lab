import React from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

const MapContainer = ({
	google,
	containerStyle,
	center,
	zoom,
	results,
  showDetails
}) => {

	return (
		<div className="relative flex flex-col w-full h-full">
			<Map
				google = {google}
				zoom = {zoom}
				mapId = {process.env.APIKEY_GOOGLE_MAP_ID}
				initialCenter = {center}
				containerStyle = {containerStyle}
			>
			
				{
					results.map(library => (
						<Marker
              onClick={() => { showDetails(library) }}
							key={library.id}
							position={{
								lat: library.latitud,
								lng: library.longitud
							}}
						/>
					))
				}
			</Map>
		</div>
		
	)
}

export default GoogleApiWrapper({
	apiKey: process.env.NEXT_PUBLIC_APIKEY_GOOGLE,
	language: 'ES'
})(MapContainer)