import type { Point } from '$lib/types';
import { calculateCenter } from '$lib/utils';
import type { FeatureCollection } from 'geojson';
import osmtogeojson from 'osmtogeojson';

export async function getWaterPoints(): Promise<Point[]> {
	const overpassUrl =
		'https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="drinking_water"](38.6,-9.3,38.8,-9.0);out;';

	try {
		const response = await fetch(overpassUrl);
		const data = await response.json();
		const points = data.elements as Point[];
		return points;
	} catch {
		return [];
	}
}

export async function getFountainPoints(): Promise<Point[]> {
	const nwrUrl =
		'https://overpass-api.de/api/interpreter?data=[out:json];nwr["amenity"="fountain"](38.6,-9.3,38.8,-9.0);out body;>;out skel qt;';
	const nodeUrl =
		'https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="fountain"](38.6,-9.3,38.8,-9.0);out body;>;out skel qt;';

	try {
		const points: Point[] = [];

		// Fetch and process data from the nwr URL
		const nwrResponse = await fetch(nwrUrl);
		const nwrData = await nwrResponse.json();

		const nwrNodes: { [key: string]: Point } = {};
		const nwrWays: {
			id: string;
			nodes: string[];
		}[] = [];

		nwrData.elements.forEach((element) => {
			if (element.type === 'node') {
				nwrNodes[element.id] = {
					lat: element.lat,
					lon: element.lon
				};
			} else if (element.type === 'way') {
				nwrWays.push(element);
			} else if (element.type === 'relation') {
				// 处理关系，提取成员
				element.members.forEach((member: { type: string; ref: string }) => {
					if (member.type === 'node' && nwrNodes[member.ref]) {
						points.push(nwrNodes[member.ref]);
					} else if (member.type === 'way') {
						const way = nwrWays.find((w) => w.id === member.ref);
						if (way) {
							const center = calculateCenter(way, nwrNodes);
							if (center) {
								points.push({
									lat: center.lat,
									lon: center.lon
								});
							}
						}
					}
				});
			}
		});

		nwrWays.forEach((way) => {
			const center = calculateCenter(way, nwrNodes);
			if (center) {
				points.push({
					lat: center.lat,
					lon: center.lon
				});
			}
		});

		// Fetch and process data from the node URL
		const nodeResponse = await fetch(nodeUrl);
		const nodeData = await nodeResponse.json();

		nodeData.elements.forEach((element) => {
			if (element.type === 'node') {
				points.push({
					lat: element.lat,
					lon: element.lon
				});
			}
		});

		return points;
	} catch {
		return [];
	}
}



export async function getShoppingMalls(): Promise<Point[]> {
	const nwrUrl =
		'https://overpass-api.de/api/interpreter?data=[out:json];nwr["shop"="mall"](38.6,-9.3,38.8,-9.0);out body;>;out skel qt;';
	const nodeUrl =
		'https://overpass-api.de/api/interpreter?data=[out:json];node["shop"="mall"](38.6,-9.3,38.8,-9.0);out body;>;out skel qt;';

	try {
		const points: Point[] = [];

		// Fetch and process data from the nwr URL
		const nwrResponse = await fetch(nwrUrl);
		const nwrData = await nwrResponse.json();

		const nwrNodes: { [key: string]: Point } = {};
		const nwrWays: {
			id: string;
			nodes: string[];
		}[] = [];

		nwrData.elements.forEach((element) => {
			if (element.type === 'node') {
				nwrNodes[element.id] = {
					lat: element.lat,
					lon: element.lon
				};
			} else if (element.type === 'way') {
				nwrWays.push(element);
			} else if (element.type === 'relation') {
				// 处理关系，提取成员
				element.members.forEach((member: { type: string; ref: string }) => {
					if (member.type === 'node' && nwrNodes[member.ref]) {
						points.push(nwrNodes[member.ref]);
					} else if (member.type === 'way') {
						const way = nwrWays.find((w) => w.id === member.ref);
						if (way) {
							const center = calculateCenter(way, nwrNodes);
							if (center) {
								points.push({
									lat: center.lat,
									lon: center.lon
								});
							}
						}
					}
				});
			}
		});

		nwrWays.forEach((way) => {
			const center = calculateCenter(way, nwrNodes);
			if (center) {
				points.push({
					lat: center.lat,
					lon: center.lon
				});
			}
		});

		// Fetch and process data from the node URL
		const nodeResponse = await fetch(nodeUrl);
		const nodeData = await nodeResponse.json();

		nodeData.elements.forEach((element) => {
			if (element.type === 'node') {
				points.push({
					lat: element.lat,
					lon: element.lon
				});
			}
		});

		return points;
	} catch {
		return [];
	}
}

export async function getParksAndGardens(): Promise<FeatureCollection | null> {
	const overpassUrl = 'https://overpass-api.de/api/interpreter';
	const overpassQuery = `
        [out:json];
        (
            way["leisure"="park"](38.6,-9.3,38.8,-9.0);
            relation["leisure"="park"](38.6,-9.3,38.8,-9.0);
            way["leisure"="garden"](38.6,-9.3,38.8,-9.0);
            relation["leisure"="garden"](38.6,-9.3,38.8,-9.0);
        );
        out body;
        >;
        out skel qt;
		convert item ::=::,::geom=geom(),_osm_type=type();
		out geom;
    `;

	try {
		const response = await fetch(overpassUrl, {
			method: 'POST',
			body: `data=${encodeURIComponent(overpassQuery)}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		const data = await response.json();
		const geojson = osmtogeojson(data);
		return geojson;
	} catch {
		return null;
	}
}
