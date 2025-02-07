{#if (messages.length > 0) }
<div class="border rounded border-danger mb-2 ms-2 me-2 p-3">
  <h5 class="fs-5 text-danger"><i class="bi bi-exclamation-triangle-fill"></i>&nbsp;エラー</h5>
  <ul>
    {#each messages as message}
      <li class="text-danger">{message}</li>
    {/each}
  </ul>
</div>
{/if}

<script>
export let messages;
</script>