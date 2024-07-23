import type { Tag } from '$lib/types';
import type { StorageError } from '@supabase/storage-js';
import { error, fail } from '@sveltejs/kit';
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

	return {
		tags: await getTags()
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

		const nonEmptyImages = images.filter((image) => (image as File).size > 0);

		const imageUploads = await Promise.all(
			nonEmptyImages.map((image) => uploadImage(image as File))
		);

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
