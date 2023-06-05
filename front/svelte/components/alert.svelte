<div class="row">
    {#if alert}
    <div class="col-12 alert fade show {alert_level}" role="alert">
        <button type="button" class="btn-close" aria-label="Close"
            on:click="{() => {alert = undefined}}"></button>
        <strong>{alert}</strong>
    </div>
    {/if}
</div>
<script>
export let alert;
export let alert_level;
</script>