<script lang="ts">
	import { page } from '$app/stores';

	let open = false;

	let comment = '';

	async function postComment() {
		const { error } = await $page.data.supabase.from('comments').insert([
			{
				comment: comment
			}
		]);
		open = false;
	}
</script>

<button id="comment-button" aria-label="comment" on:click={() => (open = true)}></button>
<div
	id="comment-modal"
	class="modal"
	class:hidden={!open}
	class:flex={open}
	on:click|self={() => (open = false)}
>
	<div class="modal-content">
		<h2>Share Couriers Stories</h2>
		<p>
			&#x2022; How do you use this platform in your daily food delivery work?
			<br />&#x2022; How does weather data impact your choices during the day?
			<br />&#x2022; How has information on drinking water points, fountains, malls, parks, and gardens been beneficial to you?
			<br />&#x2022; Have you tagged locations offering shelter for food couriers? If so, please share your experiences.
			<br />&#x2022; Why might you hesitate to tag and comment on places during a heatwave?
		</p>
		<textarea
			id="comment-text"
			placeholder="The above questions are for reference. Please share your suggestions on using this platform in 250 characters or less."
			maxlength="250"
			bind:value={comment}
		></textarea>
		<button id="comment-cancel-btn" on:click={() => (open = false)}>Cancel</button>
		<button id="comment-send-btn" on:click={postComment}>Send</button>
	</div>
</div>

<style>
	#comment-button {
		position: absolute;
		bottom: 260px; /* 根据你的设计调整 */
		right: 16px;
		width: 48px;
		height: 48px;
		border: none;
		background: url('https://mashuhao.me/wp-content/uploads/2024/06/comment.png') no-repeat center
			center;
		background-size: contain;
		cursor: pointer;
		z-index: 1000;
	}

	#comment-modal {
		position: fixed;
		z-index: 2000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		justify-content: center;
		align-items: center;
	}

	#comment-modal .modal-content {
		background-color: #fff;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
		max-width: 600px;
		text-align: center;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	#comment-text {
		width: 100%;
		height: 80px;
		padding: 10px;
		margin: 10px 0;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	#comment-cancel-btn,
	#comment-send-btn {
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin: 10px 5px;
	}

	#comment-cancel-btn {
		background-color: #f44336;
		color: white;
	}

	#comment-send-btn {
		background-color: #4caf50;
		color: white;
	}

	#comment-modal .modal-content p {
		text-align: left;
	}
</style>
