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
		<h2>Share Your Stories and Suggestions</h2>
		<p>
			&#x2022; How do you use this platform?
			<br />&#x2022; Is weather data helpful for you?
			<br />&#x2022; Do you find the data provided by this platform beneficial?
			<br />&#x2022; Have you participated in community building, such as tagging locations that
			help food couriers stay cool?
		</p>
		<textarea
			id="comment-text"
			placeholder="Type your feedback here (Max. 50 words)"
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
