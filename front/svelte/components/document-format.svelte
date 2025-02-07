<label for="top" class="col-2 col-form-label">フォーマット</label>
<div class="col-2 mb-3">
  <select bind:value={type} class="form-control w-100">
    {#each DOC_FORMAT as opt}
    <option value={opt[0]}>{opt[1]}</option>
    {/each}
  </select>
</div>

<script>
const DOC_FORMAT = [
  ["text",      "Text"],
  ["markdown",  "Markdown"],
  ["html",      "HTML"]
];

export let type;
</script>