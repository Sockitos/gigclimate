<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Point } from '$lib/types';

	export let open = false;
	export let location: Point;

	let name = '';
	let comment = '';
	let images: FileList;

	$: if ($page.form?.success) {
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
		<form method="POST" enctype="multipart/form-data" action="?/tag" use:enhance>
			<input type="hidden" name="lat" value={location.lat} />
			<input type="hidden" name="lon" value={location.lon} />
			<input
				type="text"
				id="tag-name"
				name="title"
				placeholder="Tag Name is required (Max. 5 words)."
				maxlength="50"
				bind:value={name}
			/>
			<textarea
				id="tag-comment"
				name="comment"
				placeholder="Comment is required. Type your comments, thought, inspirations, whatever here (Max. 50 words)"
				maxlength="250"
				bind:value={comment}
			></textarea>
			<div class="image-upload">
				<input
					type="file"
					name="images"
					bind:files={images}
					id="tag-images"
					accept="image/*"
					multiple
				/>
				<p class="image-upload-hint">optional, max 2 images.</p>
			</div>
			<div class="image-preview" id="image-preview">
				{#if images}
					{#each Array.from(images) as image}
						<img src={URL.createObjectURL(image)} alt="preview" />
					{/each}
				{/if}
			</div>
			<button id="cancel-btn" type="button" on:click={() => (open = false)}>Cancel</button>
			<button id="send-btn" type="submit">Send</button>
		</form>
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

	#tag-comment {
		width: 100%;
		height: 80px;
		padding: 10px;
		margin: 10px 0;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	#tag-name {
		width: 100%;
		height: 40px;
		padding: 10px;
		margin: 10px 0;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	#tag-images {
		margin-top: 10px;
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
		background-color: #3d97ea;
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

	.image-upload {
		display: flex;
		flex-direction: column;
		align-items: left;
	}

	.image-upload-hint {
		font-size: 12px;
		color: gray;
		text-align: left;
	}
</style>
