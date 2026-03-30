<template>
	<tr>
		<td style="vertical-align: middle; padding: 12px 16px;">
			<div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
				<slot />
			</div>
		</td>
		<td>
			<v-checkbox hide-details color="primary"></v-checkbox>
		</td>
	</tr>
</template>

<script setup lang="ts">

</script>
