<script lang="ts">
	import { page } from '$app/stores';
	import type { Point } from '$lib/types';

	export let open = false;
	export let location: Point;

	let name = '';
	let comment = '';
	let images: FileList;

	async function postTag() {
		const { error } = await $page.data.supabase.from('tags').insert([
			{
				lat: location.lat,
				lon: location.lon,
				title: name,
				comment: comment,
				images: []
			}
		]);
		open = false;
	}
</script>

<div
	id="tag-modal"
	class="modal"
	class:hidden={!open}
	class:flex={open}
	on:click|self={() => (open = false)}
>
	<div class="modal-content">
		<input
			type="text"
			id="tag-name"
			placeholder="Tag Name (Max. 5 words)"
			maxlength="50"
			bind:value={name}
		/>
		<textarea
			id="tag-comment"
			placeholder="Type your comments, thought, inspirations, whatever here (Max. 50 words)"
			maxlength="250"
			bind:value={comment}
		></textarea>
		<input type="file" bind:files={images} id="tag-images" accept="image/*" multiple />
		<div class="image-preview" id="image-preview"></div>
		<button id="cancel-btn" on:click={() => (open = false)}>Cancel</button>
		<button id="send-btn" on:click={postTag}>Send</button>
	</div>
</div>

<style>
	#tag-modal {
		position: fixed;
		z-index: 2000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4); /* 全屏透明背景 */
		justify-content: center; /* 水平居中 */
		align-items: center; /* 垂直居中 */
	}

	#tag-modal .modal-content {
		background-color: #fff;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
		max-width: 600px;
		text-align: center;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}
	#tag-name,
	#tag-comment {
		width: 100%;
		padding: 10px;
		margin: 10px 0;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	#tag-images {
		margin: 10px 0;
	}

	#cancel-btn,
	#send-btn {
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin: 10px 5px;
	}

	#cancel-btn {
		background-color: #f44336;
		color: white;
	}

	#send-btn {
		background-color: #4caf50;
		color: white;
	}

	.image-preview {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.image-preview img {
		width: 100px;
		height: 100px;
		object-fit: cover;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
</style>
