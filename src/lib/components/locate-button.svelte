<script lang="ts">
	import type { Point } from '$lib/types';
	import { onMount } from 'svelte';

	export let location: Point | undefined;

	function locateMe() {
		if (navigator.geolocation) {
			console.log('Geolocation is supported by this browser.');
			navigator.geolocation.getCurrentPosition(
				function (position) {
					console.log('Geolocation position obtained.');
					location = {
						lat: position.coords.latitude,
						lon: position.coords.longitude
					};
					console.log('Current Position:', location.lat, location.lon);
				},
				function (error) {
					console.error('Error getting location:', error);
					alert('Error getting location: ' + error.message);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
			alert('Geolocation is not supported by this browser.');
		}
	}

	onMount(locateMe);
</script>

<button id="locate-btn" aria-label="Locate Me" on:click={locateMe}></button>

<style>
	#locate-btn {
		position: absolute;
		bottom: 80px;
		right: 16px;
		width: 48px;
		height: 48px;
		border: none;
		background: url('https://mashuhao.me/wp-content/uploads/2024/06/locateMe.png') no-repeat center
			center;
		background-size: contain;
		cursor: pointer;
		z-index: 1000;
	}
</style>
