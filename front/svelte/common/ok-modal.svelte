<div class="modal" id="ok-modal" tabindex="-1" data-bs-backdrop="static">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="moda-title" id="modal-label">{title}</h5>
        <button type="button" class="btn-close" id="close-button" area-label="Close"
          on:click={close_}></button>
      </div>
      <div class="modal-body">
        <p>{@html description}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger"
          on:click={() => { Answer(true)}} >はい</button>
        <button type="button" class="btn btn-primary"
          on:click={() => { Answer(false)}}>いいえ</button>
      </div>
    </div>
  </div>
</div>

<script>
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
import Modal from 'bootstrap/js/dist/modal';
const dispatch = createEventDispatcher();

export let title;
export let description;

let modal;

export const show = () => {
  modal.show();
}

const Answer = (answer) => {
  modal.hide();
  dispatch('answer', answer);
}
const close_ = () => {
  modal.hide();
}
onMount(() => {
  modal = new Modal(document.getElementById('ok-modal'));
})

</script>