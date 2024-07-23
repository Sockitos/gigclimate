<script lang="ts">
	import type { Point } from '$lib/types';
	import { getBackgroundColor } from '$lib/utils';

	export let coordinates: Point;
	export let isCurrentLocation = false;

	let weatherInfo:
		| {
				temperature: number;
				windspeed: number;
				weathercode: number;
				elevation: number;
		  }
		| undefined;

	$: backgroundColor = weatherInfo ? getBackgroundColor(weatherInfo.temperature) : undefined;

	let error: string | undefined;

	const weatherIconUrl = 'https://mashuhao.me/wp-content/uploads/2024/06/sunny.png'; // 替换为实际的天气图标URL
	const windIconUrl = 'https://mashuhao.me/wp-content/uploads/2024/06/wind.png'; // 替换为实际的风速图标URL
	const tempIconUrl = 'https://mashuhao.me/wp-content/uploads/2024/06/temp.png'; // 替换为实际的温度图标URL
	const elevationIconUrl = 'https://mashuhao.me/wp-content/uploads/2024/06/elevation.png'; // 替换为实际的海拔图标URL

	const weatherCodeMapping: { [key: number]: string } = {
		0: 'Clear sky',
		1: 'Mainly clear',
		2: 'Partly cloudy',
		3: 'Overcast',
		45: 'Fog',
		48: 'Depositing rime fog',
		51: 'Light drizzle',
		53: 'Moderate drizzle',
		55: 'Dense drizzle',
		56: 'Light freezing drizzle',
		57: 'Dense freezing drizzle',
		61: 'Slight rain',
		63: 'Moderate rain',
		65: 'Heavy rain',
		66: 'Light freezing rain',
		67: 'Heavy freezing rain',
		71: 'Slight snow fall',
		73: 'Moderate snow fall',
		75: 'Heavy snow fall',
		77: 'Snow grains',
		80: 'Slight rain showers',
		81: 'Moderate rain showers',
		82: 'Violent rain showers',
		85: 'Slight snow showers',
		86: 'Heavy snow showers',
		95: 'Thunderstorm',
		96: 'Thunderstorm with slight hail',
		99: 'Thunderstorm with heavy hail'
	};

	$: weatherDescription = weatherCodeMapping[weatherInfo?.weathercode ?? -1] || 'Unknown weather';

	async function getWeather() {
		const params = {
			latitude: coordinates.lat,
			longitude: coordinates.lon,
			current_weather: true,
			timezone: 'auto'
		};

		const timestamp = new Date().getTime();
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&current_weather=true&timezone=${params.timezone}&_=${timestamp}`;

		function fetchElevation(lat: number, lon: number) {
			const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`;
			return fetch(url, { cache: 'no-store' })
				.then((response) => response.json())
				.then((data) => data.elevation)
				.catch((error) => {
					console.error('Error fetching elevation data:', error);
					return 'Unknown';
				});
		}

		try {
			const weatherResponse = await fetch(weatherUrl);
			const weatherData = await weatherResponse.json();
			const elevation = await fetchElevation(coordinates.lat, coordinates.lon);

			if (weatherData && weatherData.current_weather) {
				const weather = weatherData.current_weather;
				const temperature = weather.temperature;
				const windspeed = weather.windspeed;
				const weathercode = weather.weathercode;

				weatherInfo = { temperature, windspeed, weathercode, elevation };
			} else {
				error = 'Weather data not available';
			}
		} catch (error) {
			console.error('Error fetching weather data:', error);
			error = 'Error fetching weather data';
		}
	}

	$: if (coordinates) {
		getWeather();
	}

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onClose() {
		dispatch('close');
	}
</script>

<div
	id={isCurrentLocation ? 'current-weather-info' : 'additional-weather-info'}
	style={backgroundColor ? `background-color: ${backgroundColor}` : ''}
>
	{#if weatherInfo}
		<div class="weather-info weather-title">
			<span>{isCurrentLocation ? 'Current Location' : 'Selected Location'}</span>
			{#if !isCurrentLocation}
				<button class="close-btn" aria-label="Close" on:click={onClose}>&times;</button>
			{/if}
		</div>
		<div class="weather-content">
			<img src={weatherIconUrl} alt="weather icon" class="weather-icon" />
			<span>{weatherDescription}</span>
			<img src={windIconUrl} alt="wind icon" class="weather-icon" />
			<span>{weatherInfo.windspeed} km/h</span>
		</div>
		<div class="weather-content">
			<img src={tempIconUrl} alt="temperature icon" class="weather-icon" />
			<span>{weatherInfo.temperature}°C</span>
			<img src={elevationIconUrl} alt="elevation icon" class="weather-icon" />
			<span>{weatherInfo.elevation} m</span>
		</div>
	{:else if error}
		{error}
	{:else}
		Loading weather data...
	{/if}
</div>

<style>
	#current-weather-info,
	#additional-weather-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 10px 20px;
		font-size: 14px;
		z-index: 1800;
		overflow: hidden;
		border-radius: 4px;
		width: calc(100% - 40px);
		box-sizing: border-box;
		position: fixed;
		left: 20px;
	}

	#current-weather-info {
		top: 20px;
		background-color: #4caf50;
		color: white;
		transition: top 0.3s ease-out;
	}

	#additional-weather-info {
		top: 120px;
		background-color: #f44336;
		color: white;
		transition: top 0.3s ease-out;
	}

	.weather-info {
		display: flex;
		justify-content: flex-start; /* 左对齐 */
		align-items: center;
		width: 100%;
		margin: 5px 0;
	}

	.weather-icon {
		width: 24px;
		height: 24px;
		margin-right: 10px; /* 添加右边距，使图标和文本有间隔 */
	}

	.weather-title {
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		position: relative; /* 为绝对定位的按钮提供参考 */
	}

	.weather-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.weather-content span {
		flex: 1; /* 使每个span占据相等宽度 */
		text-align: left; /* 左对齐文本 */
	}

	.close-btn {
		background: none;
		border: none;
		color: white;
		font-size: 24px;
		cursor: pointer;
		position: absolute; /* 使用绝对定位 */
		right: 0; /* 右对齐 */
		top: 50%; /* 垂直居中 */
		transform: translateY(-50%); /* 调整位置 */
	}
</style>
