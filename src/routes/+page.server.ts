import type { Point, Tag } from '$lib/types';
import { calculateCenter } from '$lib/utils';
import type { StorageError } from '@supabase/storage-js';
import { error, fail } from '@sveltejs/kit';
import type { FeatureCollection } from 'geojson';
import osmtogeojson from 'osmtogeojson';
import { v4 as uuidv4 } from 'uuid';

export const load = async (event) => {
	const { supabase } = event.locals;

	async function getTags(): Promise<Tag[]> {
		const { data: tags, error: tagsError } = await supabase.from('tags').select('*');

		if (tagsError) {
			return error(500, 'Error fetching tags');
		}
		return tags;
	}

	async function getWaterPoints(): Promise<Point[]> {
		const overpassUrl =
			'https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="drinking_water"](38.6,-9.3,38.8,-9.0);out;';

		try {
			const response = await fetch(overpassUrl);
			const data = await response.json();
			const points = data.elements as Point[];
			return points;
		} catch {
			return error(500, 'Error fetching water points');
		}
	}

	async function getFountainPoints(): Promise<Point[]> {
		const overpassUrl =
			'https://overpass-api.de/api/interpreter?data=[out:json];nwr["amenity"="fountain"](38.6,-9.3,38.8,-9.0);out body;>;out skel qt;';

		try {
			const points: Point[] = [];
			const nodes: { [key: string]: Point } = {};
			const ways: {
				id: string;
				nodes: string[];
			}[] = [];

			const response = await fetch(overpassUrl);
			const data = await response.json();

			// 遍历数据，先处理节点
			data.elements.forEach((element) => {
				if (element.type === 'node') {
					nodes[element.id] = {
						lat: element.lat,
						lon: element.lon
					};
				} else if (element.type === 'way') {
					ways.push(element);
				} else if (element.type === 'relation') {
					// 处理关系，提取成员
					element.members.forEach((member: { type: string; ref: string }) => {
						if (member.type === 'node' && nodes[member.ref]) {
							points.push(nodes[member.ref]);
						} else if (member.type === 'way' && nodes[member.ref]) {
							const center = calculateCenter(ways.find((w) => w.id === member.ref)!, nodes);
							if (center) {
								points.push({
									lat: center.lat,
									lon: center.lon
								});
							}
						}
					});
				}
			});

			ways.forEach((way) => {
				const center = calculateCenter(way, nodes);
				if (center) {
					points.push({
						lat: center.lat,
						lon: center.lon
					});
				}
			});
			return points;
		} catch {
			return error(500, 'Error fetching fountain points');
		}
	}

	async function getShoppingMalls(): Promise<Point[]> {
		const overpassUrl =
			'https://overpass-api.de/api/interpreter?data=[out:json];nwr["shop"="mall"](38.6,-9.3,38.8,-9.0);out body;>;out skel qt;';

		try {
			const points: Point[] = [];
			const nodes: { [key: string]: Point } = {};
			const ways: {
				id: string;
				nodes: string[];
			}[] = [];

			const response = await fetch(overpassUrl);
			const data = await response.json();

			// 遍历数据，先处理节点
			data.elements.forEach((element) => {
				if (element.type === 'node') {
					nodes[element.id] = {
						lat: element.lat,
						lon: element.lon
					};
				} else if (element.type === 'way') {
					ways.push(element);
				} else if (element.type === 'relation') {
					// 处理关系，提取成员
					element.members.forEach((member: { type: string; ref: string }) => {
						if (member.type === 'node' && nodes[member.ref]) {
							points.push(nodes[member.ref]);
						} else if (member.type === 'way' && nodes[member.ref]) {
							const center = calculateCenter(ways.find((w) => w.id === member.ref)!, nodes);
							if (center) {
								points.push({
									lat: center.lat,
									lon: center.lon
								});
							}
						}
					});
				}
			});

			ways.forEach((way) => {
				const center = calculateCenter(way, nodes);
				if (center) {
					points.push({
						lat: center.lat,
						lon: center.lon
					});
				}
			});
			return points;
		} catch {
			return error(500, 'Error fetching fountain points');
		}
	}

	async function getParksAndGardens(): Promise<FeatureCollection> {
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
			return error(500, 'Error fetching parks and gardens');
		}
	}

	return {
		tags: await getTags(),
		waterPoints: await getWaterPoints(),
		fountainPoints: await getFountainPoints(),
		shoppingMalls: await getShoppingMalls(),
		parksAndGardens: await getParksAndGardens()
	};
};

export const actions = {
	tag: async (event) => {
		async function uploadImage(image: File): Promise<{ path: string; error: StorageError | null }> {
			const fileExt = image.name.split('.').pop();
			const filePath = `${uuidv4()}.${fileExt}`;

			const { data: imageFileData, error: imageFileError } = await event.locals.supabase.storage
				.from('images')
				.upload(filePath, image);

			if (imageFileError) {
				return { path: '', error: imageFileError };
			}

			return { path: imageFileData.path, error: null };
		}

		const data = await event.request.formData();
		const lat = data.get('lat');
		const lon = data.get('lon');
		const title = data.get('title');
		const comment = data.get('comment');
		const images = data.getAll('images');

		if (!lat || !lon || !title || !comment || !images) {
			return fail(400, { message: 'All fields are required' });
		}

		const imageUploads = await Promise.all(images.map((image) => uploadImage(image as File)));

		const { error } = await event.locals.supabase.from('tags').insert([
			{
				lat: Number(lat as string),
				lon: Number(lon as string),
				title: title as string,
				comment: comment as string,
				images: imageUploads.map((upload) => upload.path)
			}
		]);

		if (error) {
			return fail(500, { message: 'Error adding tag' });
		}

		return { success: true };
	},
	comment: async (event) => {
		const data = await event.request.formData();
		const comment = data.get('comment');

		if (!comment) {
			return fail(400, { message: 'Comment is required' });
		}

		const { error } = await event.locals.supabase.from('comments').insert([
			{
				comment: comment as string
			}
		]);

		if (error) {
			return fail(500, { message: 'Error adding comment' });
		}

		return { success: true };
	}
};
