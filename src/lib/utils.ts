import type { Point } from './types';

function interpolateColor(color1: number[], color2: number[], factor: number) {
	const result = color1.slice();
	for (let i = 0; i < 3; i++) {
		result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
	}
	return result;
}

function rgbToHex(rgb: number[]) {
	return (
		'#' +
		rgb
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			})
			.join('')
	);
}

export function getBackgroundColor(temperature: number) {
	const colors = [
		[173, 216, 230], // 浅蓝色
		[0, 0, 255], // 蓝色
		[88, 231, 53], // 绿色
		[255, 191, 116], // 黄色
		[248, 101, 101] // 红色
	];

	const minTemp = 0;
	const maxTemp = 40;
	const step = (maxTemp - minTemp) / (colors.length - 1);

	if (temperature <= minTemp) {
		return rgbToHex(colors[0]);
	} else if (temperature >= maxTemp) {
		return rgbToHex(colors[colors.length - 1]);
	} else {
		const index = Math.floor((temperature - minTemp) / step);
		const factor = (temperature - (minTemp + index * step)) / step;
		const color = interpolateColor(colors[index], colors[index + 1], factor);
		return rgbToHex(color);
	}
}

export function calculateCenter(
	way: { nodes: string[] },
	nodes: { [key: string]: Point }
): Point | null {
	if (!way || !way.nodes || way.nodes.length === 0) return null;
	let latSum = 0,
		lonSum = 0,
		count = 0;
	way.nodes.forEach((nodeId) => {
		if (nodes[nodeId]) {
			latSum += nodes[nodeId].lat;
			lonSum += nodes[nodeId].lon;
			count++;
		}
	});
	if (count === 0) return null;
	return { lat: latSum / count, lon: lonSum / count };
}
