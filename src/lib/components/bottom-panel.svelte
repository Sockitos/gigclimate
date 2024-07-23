<script lang="ts">
	import { page } from '$app/stores';
	import type { Point, Tag } from '$lib/types';
	import TagModal from './tag-modal.svelte';

	export let title: string;
	export let location: Point;
	export let tags: Tag[];

	let openModal = false;
</script>

<div id="bottom-content">
	<div id="tag-title">{title}</div>
	{#if tags.length > 0}
		<div id="tag-list">
			{#each tags as tag}
				<b class="tag-name">{tag.title}</b>{tag.comment}
				{#each tag.images as image}
					<img
						src={$page.data.supabase.storage.from('images').getPublicUrl(image).data.publicUrl}
						style="width: 50%; height: auto;"
					/>
				{/each}
			{/each}
		</div>
	{:else}
		<div id="no-tags">No Tags and Comments Yet</div>
	{/if}
	<button id="add-tags-btn" on:click={() => (openModal = true)}>Add Tags and Comments</button>
</div>

<TagModal bind:open={openModal} {location} />

<style>
	#bottom-content {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: white;
		border-top: 1px solid #ccc;
		padding: 5px 20px;
		display: flex;
		flex-direction: column; /* 改为垂直布局 */
		justify-content: flex-start; /* 调整内容在容器中的位置 */
		align-items: stretch; /* 使子元素占满容器宽度 */
		box-sizing: border-box;
		z-index: 1000;
	}

	#tag-title {
		font-size: 18px;
		font-weight: bold;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: #ffffff;
		border: 1px solid #ffffff;
		box-sizing: border-box;
	}

	#tag-list {
		max-height: 200px; /* 调整标签列表的最大高度 */
		overflow-y: auto;
		width: 100%;
		background: #ffffff;
		border-top: 1px solid #141414;
		margin-bottom: 16px; /* 与按钮之间的间距 */
		box-sizing: border-box; /* 使元素内边距和边框包含在宽度和高度内 */
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.tag-name {
		margin-top: 16px;
	}

	#no-tags {
		overflow-y: auto;
		width: 100%;
		background: #f9f9f9;
		border: 1px solid #ddd;
		padding: 10px;
		margin-bottom: 10px; /* 与按钮之间的间距 */
		box-sizing: border-box; /* 使元素内边距和边框包含在宽度和高度内 */
	}

	#add-tags-btn {
		padding: 10px 20px;
		background-color: #3D97EA;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		width: 100%; /* 按钮占满宽度 */
		box-sizing: border-box; /* 使元素内边距和边框包含在宽度和高度内 */
		font-size: 16px;
	}

	#add-tags-btn:hover {
		background-color: #45a049;
	}
</style>
