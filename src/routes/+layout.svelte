<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
</script>

<Toaster position="top-center" toastOptions={{ duration: 2000 }} />
<slot />
