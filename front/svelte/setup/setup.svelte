<div class="bg-white p-5 rounded col-11 col-lg-4">
  <h1 class="text-center">初期セットアップ</h1>
  <p class="text-center">最初に使用する会計年度を登録します</p>
  {#if serverError !== ""}
  <p class="text-danger">エラーが発生しました。{serverError}</p>
  {/if}
  <div class="border rounded p-3">
    <form novalidate>
      <div class="mb-3">
        <label for="year" class="form-label">会計年度（西暦）&nbsp;<span class="badge bg-danger">必須</span></label>
        <div class="input-group">
          <input type="number" class="form-control {invalid.year ? "is-invalid" : "is-valid"} " placeholder="会計年度（西暦）" id="year" min="1900" bind:value={form.year} >
          <span class="input-group-text">年度</span>
        </div>
        {#if invalid.year }
          <div class="text-danger">
            {message.year}
          </div>
        {/if}
      </div>
      <div class="mb-3">
        <label for="term" class="form-label">期&nbsp;<span class="badge bg-danger">必須</span></label>
        <div class="input-group">
          <input type="number" class="form-control {invalid.term ? "is-invalid" : "is-valid"}" placeholder="期" id="term" min="1" bind:value={form.term} >
          <span class="input-group-text">期</span>
        </div>
        {#if invalid.term }
          <div class="text-danger">
            {message.term}
          </div>
        {/if}
      </div>
      <div class="mb-3">
        <label for="startDate" class="form-label">開始日付&nbsp;<span class="badge bg-danger">必須</span></label>
        <input type="date" id="startDate" class="form-control {invalid.startDate ? "is-invalid" : "is-valid"}" bind:value={form.startDate} >
        {#if invalid.startDate }
          <div class="text-danger">
            {message.startDate}
          </div>
        {/if}
      </div>
      <div class="mb-3">
        <label for="endDate" class="form-label">終了日付&nbsp;<span class="badge bg-danger">必須</span></label>
        <input type="date" id="endDate" class="form-control {invalid.endDate ? "is-invalid" : "is-valid"}" bind:value={form.endDate} >
        {#if invalid.endDate }
          <div class="text-danger">
            {message.endDate}
          </div>
        {/if}
      </div>
      <div class="d-flex justify-content-center">
        {#if loding }
          <button type="button" class="btn btn-primary col-lg-8 col-12" disabled>
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            登録しています...
          </button>
        {:else }
          <button type="button" class="btn btn-primary col-lg-8 col-12" on:click={submit}>
            登録
          </button>
        {/if}
      </div>
    </form>
  </div>
</div>
<script>
  import axios from 'axios';
  import {onMount} from 'svelte';

  let form = {};
  let invalid = {};
  let message = {};
  let serverError = "";
  let loding = false;

  onMount(() => {
      form.term = 1;
      form.year = new Date().getFullYear() - 1;
      form.startDate = `${form.year}-04-01`;
      form.endDate = `${form.year + 1}-03-31`;
      invalid.term = false;
      invalid.year = false;
      invalid.startDate = false;
      invalid.endDate = false;
  })
  const isYearValid = () => {
    invalid.year = false;
    message.year = "";
    if ( form.year === null){
      invalid.year = true;
      message.year = "会計年度は必須入力です。"
      return false;
    }
    const minYear = new Date().getFullYear() - 5;
    if ( form.year < minYear ){
      invalid.year = true;
      message.year = "入力した会計年度が正しくありません。"
      return false;
    }
    const nowYear = new Date().getFullYear();
    if ( form.year > nowYear ){
      invalid.year = true;
      message.year = "入力した会計年度が正しくありません。"
      return false;
    }
    return true;
  }
  const isTermValid = () => {
    invalid.term = false;
    message.term = "";
    if (form.term === null ){
      invalid.term = true;
      message.term = "期は必須入力です。"
      return false;
    }
    if (form.term < 1 ){
      invalid.term = true;
      message.term = "入力した期が正しくありません。"
      return false;
    }
    return true;
  }
  const isStartDateValid = () => {
    invalid.startDate = false;
    message.startDate = "";
    if ( form.startDate.length === 0 ){
      invalid.startDate = true;
      message.startDate = "開始日付は必須入力です。"
      return false;
    }
    if ( isYearValid() && new Date(form.startDate).getFullYear() !== form.year ){
      invalid.startDate = true;
      message.startDate = "開始日付の年が会計年度と一致しません。"
      return false;
    }
    return true;
  }
  const isEndDateValid = () => {
    invalid.endDate = false;
    message.endDate = "";
    if ( form.endDate.length === 0 ){
      invalid.endDate = true;
      message.endDate = "終了日付は必須入力です。"
      return false;
    }
    if ( isStartDateValid() && new Date(form.startDate) > new Date(form.endDate)){
      invalid.endDate = true;
      message.endDate = "開始日付よりも過去の日付を指定しています。"
      return false;
    }
    return true;
  }
  const isFormDataValid = () =>{ 
    console.log(form);
    let count = 0;
    if ( !isYearValid() ){
      count++;
    }
    if ( !isTermValid() ){
      count++;
    }
    if ( !isStartDateValid() ){
      count++;
    }
    if ( !isEndDateValid() ){
      count++;
    }
    return count > 0 ? false : true;
  }
  const submit = async () =>{
    if ( !isFormDataValid() ){
      return ;
    }
    try{
      loding = true;
      let result = await axios.post(`/api/setup`, form);
      loding = false;
      if (result.data.code === -99){
        serverError = "登録中にエラーが発生したため処理をキャンセルしました。";
      }else{
        window.location.href = '/home';
      }
    }catch(e){
      loding = false;
      serverError = e.message;
      console.log(e);
    }
  }
</script>