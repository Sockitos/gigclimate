<script lang="ts">
	import { browser } from '$app/environment';
	import BottomPanel from '$lib/components/bottom-panel.svelte';
	import CommentModal from '$lib/components/comment-modal.svelte';
	import CommunityModal from '$lib/components/community-modal.svelte';
	import GuideModal from '$lib/components/guide-modal.svelte';
	import LocateButton from '$lib/components/locate-button.svelte';
	import MobileWarning from '$lib/components/mobile-warning.svelte';
	import Notification from '$lib/components/notification.svelte';
	import WeatherInfo from '$lib/components/weather-info.svelte';
	import {
		getFountainPoints,
		getParksAndGardens,
		getShoppingMalls,
		getWaterPoints
	} from '$lib/overpass';
	import type { Point, Tag } from '$lib/types';
	import type { FeatureCollection } from 'geojson';
	import 'leaflet/dist/leaflet.css';
	import { onMount } from 'svelte';
	import { GeoJSON, Icon, LeafletMap, Marker, TileLayer } from 'svelte-leafletjs?client';
	import { toast } from 'svelte-sonner';

	export let data;
	export let form;

	let map: LeafletMap;
	let waterPoints: Point[] = [];
	let fountainPoints: Point[] = [];
	let shoppingMalls: Point[] = [];
	let parksAndGardens: FeatureCollection | null;

	onMount(async () => {
		waterPoints = await getWaterPoints();
		fountainPoints = await getFountainPoints();
		shoppingMalls = await getShoppingMalls();
		parksAndGardens = await getParksAndGardens();
	});

	let currentLocation: Point | undefined;
	let selectedLocation: Point | undefined;
	let selectedLocationLabel: string | undefined;
	let selectedLocationTags: Tag[] = [];

	$: if (form) {
    if (form.success) {
        toast.success(form.message ?? 'Success');
    } else {
        toast.error(form.message ?? 'Error');
    }
	}

	$: uniqueTags = data.tags.filter(
		(tag, index, self) => index === self.findIndex((t) => t.lat === tag.lat && t.lon === tag.lon)
	);

	$: if (currentLocation) {
		map.getMap()?.setView([currentLocation.lat, currentLocation.lon], 15);
	}

	$: if (selectedLocation) {
		selectedLocationTags = data.tags.filter((tag) => {
			const distance = calculateDistance(selectedLocation!, { lat: tag.lat, lon: tag.lon });
			return distance <= 0.001; // tolerance
		});
	} else {
		selectedLocationTags = [];
	}

	function calculateDistance(point1: Point, point2: Point): number {
		const R = 6371; // earth
		const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
		const dLon = ((point2.lon - point1.lon) * Math.PI) / 180;
		const lat1 = (point1.lat * Math.PI) / 180;
		const lat2 = (point2.lat * Math.PI) / 180;

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c; // distance
	}

	function handleMapClick(e: CustomEvent) {
		selectedLocation = { lat: e.detail.latlng.lat, lon: e.detail.latlng.lng };
		selectedLocationLabel = 'No Tags Here! Creat the First!';
		map.getMap()?.setView([selectedLocation.lat, selectedLocation.lon]);
	}

	function handleMarkerClick(e: CustomEvent, label: string) {
		const clickedLocation = { lat: e.detail.latlng.lat, lon: e.detail.latlng.lng };
		const tolerance = 0.001; // tolerance range

		selectedLocation = findNearbyLocation(clickedLocation, tolerance);
		selectedLocationLabel = label;
		map.getMap()?.setView([selectedLocation.lat, selectedLocation.lon]);
	}

	function findNearbyLocation(clickedLocation: Point, tolerance: number): Point {
		let nearbyLocation: Point | undefined = clickedLocation;
		selectedLocationTags = data.tags.filter((tag) => {
			const distance = calculateDistance(clickedLocation, { lat: tag.lat, lon: tag.lon });
			return distance <= tolerance;
		});
		return nearbyLocation;
	}
</script>

<MobileWarning />
<div class="h-full flex flex-col sm:hidden">
	{#if currentLocation}
		<WeatherInfo isCurrentLocation coordinates={currentLocation} />
	{/if}
	{#if selectedLocation}
		<WeatherInfo
			isCurrentLocation={false}
			coordinates={selectedLocation}
			on:close={() => (selectedLocation = undefined)}
		/>
	{/if}
	{#if browser}
		<div class="flex-1 h-full w-full relative">
			<LeafletMap
				bind:this={map}
				options={{
					center: [38.7164, -9.1399],
					zoom: 13
				}}
				events={['click']}
				on:click={handleMapClick}
			>
				<TileLayer
					url={'https://api.mapbox.com/styles/v1/shma/clxdu7t5q001f01qr8n636xcj/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2htYSIsImEiOiJjbHhkcjZiMjAwN25xMmpzYjg0ZGQyY3BpIn0.UtN1_cDX7aPI3EtN6ta8rg'}
					options={{
						maxZoom: 18,
						minZoom: 5,
						tileSize: 512,
						zoomOffset: -1,
						id: 'shma/clxdu7t5q001f01qr8n636xcj',
						accessToken:
							'pk.eyJ1Ijoic2htYSIsImEiOiJjbHhkcjZiMjAwN25xMmpzYjg0ZGQyY3BpIn0.UtN1_cDX7aPI3EtN6ta8rg'
					}}
				/>
				<GeoJSON
					data={parksAndGardens}
					options={{
						style: {
							color: '#18C385',
							weight: 2,
							opacity: 0.5,
							fillOpacity: 0.2,
							fillColor: '#1DFFAE'
						}
					}}
				/>
				{#each uniqueTags as tag}
					<Marker
						latLng={[tag.lat, tag.lon]}
						events={['click']}
						on:click={(e) => handleMarkerClick(e, 'Created by Food Couriers')}
					>
						<Icon
							iconUrl="courier-tag.png"
							options={{
								iconSize: [36, 36],
								popupAnchor: [1, -34],
								zIndexOffset: -100
							}}
						/>
					</Marker>
				{/each}
				{#each waterPoints as point}
					<Marker
						latLng={[point.lat, point.lon]}
						events={['click']}
						on:click={(e) => handleMarkerClick(e, 'Drinking Water Point')}
					>
						<Icon
							iconUrl="drinkingwater.png"
							options={{
								iconSize: [32, 32],
								popupAnchor: [1, -10],
								zIndexOffset: -100
							}}
						/>
					</Marker>
				{/each}
				{#each fountainPoints as point}
					<Marker
						latLng={[point.lat, point.lon]}
						events={['click']}
						on:click={(e) => handleMarkerClick(e, 'Fountain')}
					>
						<Icon
							iconUrl="fountain.png"
							options={{
								iconSize: [32, 32],
								popupAnchor: [1, -10],
								zIndexOffset: -100
							}}
						/>
					</Marker>
				{/each}
				{#each shoppingMalls as point}
					<Marker
						latLng={[point.lat, point.lon]}
						events={['click']}
						on:click={(e) => handleMarkerClick(e, 'Mall')}
					>
						<Icon
							iconUrl="shoppingmall.png"
							options={{
								iconSize: [32, 32],
								popupAnchor: [1, -10],
								zIndexOffset: -100
							}}
						/>
					</Marker>
				{/each}
				{#if currentLocation}
					<Marker latLng={currentLocation}>
						<Icon
							iconUrl="https://mashuhao.me/wp-content/uploads/2024/06/MAxt4uYSDC.gif"
							options={{
								iconSize: [36, 36],
								popupAnchor: [0, -16],
								zIndexOffset: 1000
							}}
						/>
					</Marker>
				{/if}
				{#if selectedLocation}
					<Marker latLng={selectedLocation}>
						<Icon
							iconUrl="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
							options={{
								iconSize: [25, 41],
								iconAnchor: [12, 41],
								popupAnchor: [1, -34],
								shadowUrl:
									'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
								shadowSize: [41, 41],
								zIndexOffset: 2000
							}}
						/>
					</Marker>
				{/if}
			</LeafletMap>
		</div>
	{/if}
	{#if selectedLocation && selectedLocationLabel}
		<BottomPanel
			title={selectedLocationLabel}
			tags={selectedLocationTags}
			location={selectedLocation}
		/>
	{/if}
	<LocateButton bind:location={currentLocation} />
	<GuideModal />
	<CommunityModal tagCount={uniqueTags.length} />
	<CommentModal />
</div>

<Notification />
