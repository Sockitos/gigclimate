<script lang="ts">
	export let tagCount: number; // This should be unique

	let open = false;
</script>

<button id="community-button" aria-label="community" on:click={() => (open = true)}></button>
<div
	id="community-modal"
	class="modal"
	class:hidden={!open}
	class:flex={open}
	on:click|self={() => (open = false)}
>
	<div class="modal-content">
		<h2 id="community-title">Community Actions</h2>
		<h3 id="community-subtitle">Food Couriers in Lisbon Have Created</h3>
		<div id="community-stats">
			<div class="community-stat">
				<img src="https://mashuhao.me/wp-content/uploads/2024/06/usertags-1.png" alt="Tags Icon" />
				<span>Tags: ${tagCount}</span>
			</div>
		</div>
	</div>
</div>

<style>
	#community-button {
		position: absolute;
		bottom: 200px; /* Adjust according to your design */
		right: 16px;
		width: 48px;
		height: 48px;
		border: none;
		background: url('https://mashuhao.me/wp-content/uploads/2024/06/communityachieved.png')
			no-repeat center center; /* Replace with your icon */
		background-size: contain;
		cursor: pointer;
		z-index: 1000;
	}

	#community-modal {
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

	#community-modal .modal-content {
		background-color: #fff;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
		max-width: 600px;
		text-align: center;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	#community-modal .modal-content h2 {
		font-size: 24px;
		margin-bottom: 10px;
	}

	#community-modal .modal-content h3 {
		font-size: 18px;
		margin-bottom: 20px;
	}

	/* 社区统计样式 */
	#community-stats {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
	}

	.community-stat {
		display: flex;
		align-items: center;
		margin: 10px 0;
	}

	.community-stat img {
		width: 24px;
		height: 24px;
		margin-right: 10px;
	}

	.community-stat span {
		font-size: 18px;
		font-weight: bold;
	}
</style>
