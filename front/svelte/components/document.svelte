{#if ( viewDescription )}
<div class="row w-100">
  {#if ( editting )}
  <DocumentFormat
    bind:type={document.descriptionType}></DocumentFormat>
  {/if}
</div>
<div class="row w-100">
  {#if ( editting )}
  <Editor
    type={document.descriptionType}
    bind:value={document.description}></Editor>
  {:else}
  <div class="markdown line-numbers col-12 view">
    {@html textConvert(document.description, document.descriptionType, 'html')}
  </div>
	{/if}
</div>
{:else}
<div class="row w-100">
  <div class="col-12 abstract">
    {@html textConvert(document.description, document.descriptionType, 'text')}
  </div>
</div>
{/if}
<style>
.view {
  padding: 20px;
  min-height: 70px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.abstract {
  padding: 10px;
  height: 70px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.file {
  min-height:200px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
}

</style>
<script>
import axios from 'axios';
import DocumentFormat from './document-format.svelte';
import Editor from './editor.svelte';
import textConvert from '../../../libs/text-convert.js';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
const dispatch = createEventDispatcher();

export let document;
export let editting;
export let viewDescription;

beforeUpdate(() => {
  console.log('document beforeUpdate', {document})
  if  ( !document ) {
    document = {
      descriptionType: 'html',
      description: ''
    };
  }
})

</script>
