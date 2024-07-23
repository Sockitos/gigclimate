<script lang="ts">
	let open = false;
	let currentPage = 0;
	$: if (open) currentPage = 0;

	function nextPage() {
		if (currentPage < guidePages.length - 1) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	$: prevDisabled = currentPage === 0;
	$: nextDisabled = currentPage === guidePages.length - 1;

	const guidePages = [
		{
			img: 'guide1.png',
			subtitle: 'GigClimate explores how food couriers in Lisbon collaborate and handle extreme weather.'
		},
		{
			img: 'guide2.png',
			subtitle: 'GigClimate explores how food couriers in Lisbon collaborate and handle extreme weather.'
		},
		{
			img: 'guide3.png',
			subtitle: 'GigClimate explores how food couriers in Lisbon collaborate and handle extreme weather.'
		}
	];
</script>

<button id="guide-button" aria-label="Guide" on:click={() => (open = true)}></button>
<div id="guide-modal" class:hidden={!open} class:flex={open} on:click|self={() => (open = false)}>
	<div class="modal-content">
		<h2 id="guide-title">GigClimate Guide</h2>
		<h3 id="guide-subtitle">{guidePages[currentPage].subtitle} Check our <a href="https://docs.google.com/document/d/1RNxEvITQQbYddN-qhdV9RHWxs1F9zvhgsAD0GapVTJY/edit?usp=sharing" target="_blank">Terms of Use</a> and <a href="https://docs.google.com/document/d/1VNTlhNBg6_JZ0c_m-HxjXqKZDR9TNqt9Mu3IQEC20Qg/edit?usp=sharing" target="_blank">Privacy Policy</a></h3>
		<img id="guide-img" src={guidePages[currentPage].img} alt="guide img" />
		<div class="button-container">
			<button id="prev-btn" disabled={prevDisabled} on:click={prevPage}>Last</button>
			<button id="next-btn" disabled={nextDisabled} on:click={nextPage}>Next</button>
		</div>
	</div>
</div>

<style>
	#guide-button {
		position: absolute;
		bottom: 140px; /* Adjust according to your design */
		right: 16px;
		width: 48px;
		height: 48px;
		border: none;
		background: url('https://mashuhao.me/wp-content/uploads/2024/06/guide.png') no-repeat center
			center; /* Replace with your icon */
		background-size: contain;
		cursor: pointer;
		z-index: 1000;
	}

	#guide-modal {
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

	#guide-modal .modal-content {
		background-color: #fff;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
		max-width: 600px;
		text-align: center;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	#guide-modal .modal-content h2 {
		font-size: 16px;
		margin-bottom: 10px;
	}

	#guide-modal .modal-content h3 {
		font-size: 12px;
		margin-bottom: 20px;
	}

	#guide-modal .modal-content img {
		width: 100%;
		height: auto;
		margin-bottom: 20px;
	}

	#guide-modal .button-container {
		display: flex;
		justify-content: center;
		gap: 10px; /* 按钮之间的间距 */
	}

	#guide-modal .button-container button {
		background-color: #007bff;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	#guide-modal .button-container button:hover {
		background-color: #0056b3;
	}

	#guide-modal .button-container button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
</style>
