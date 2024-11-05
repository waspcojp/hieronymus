<div class="login-page">
  <div class="login-box">
    <div class="login-logo">
      <img src="/public/logo.png" alt="Logo" class="pe-1">Hieronyms
    </div>
    <div class="card">
      <div class="card-body login-card-body">
        <p class="fs-4 text-center ">サインアップ</p>
        <p class="text-{msg_type} text-center">{message}</p>
        <div class="mb-3">
          <label for="user_input">ユーザー名</label>
          <input type="text" bind:value={user_name}
            class="form-control" placeholder="ユーザー名">
        </div>
        <div class="mb-3">
          <label for="password_input">パスワード</label>
          <input type="password" bind:value={password}
            class="form-control" placeholder="パスワード">
        </div>
        <div class="mb-3">
          <label for="password_input">パスワード(確認)</label>
          <input type="password" bind:value={confirmPassword}
              class="form-control" placeholder="パスワード(確認)">
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-lg-8 col-4 d-grid">
            <button type="submit" class="btn btn-primary mb-2"
              on:click={SignUp}>
              登録
            </button>
            <a on:click|preventDefault={change}
            href="#" class="text-center">ログインはこちら</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
import axios from 'axios';
import {onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';

export let current;

let user_name;
let password;
let confirmPassword;
let message;
let msg_type;

onMount(() => {
  user_name = '';
  password = '';
  message = '';
})

const change = (event) => {
  current = 'login';
  window.history.pushState(null, "", `/login`);
}

const SignUp = () => {
  if ( user_name.length === 0 || password.length === 0 ){
    msg_type = 'danger';
    message = `ユーザー名またはパスワードが入力されていません。`;
  }else{
    try {
      if  ( password == confirmPassword ) {
        axios.post('/api/user/signup',{
          user_name: user_name,
          password: password
        }).then((ret) => {
          //console.log(ret.data);
          if  ( ret.data.result == 'OK' ) {
            current = 'login';
            window.history.pushState(null, "", `/login`);
          } else {
            message = ret.data.message;
            msg_type = 'danger';
          }
        }).catch((msg) => {
          message = msg;
          msg_type = 'danger';
        });
      } else {
        message= 'パスワードが一致していません。';
        msg_type = 'danger';
      }
    } catch(e) {
      message = e;
      msg_type = 'danger';
      console.log('login fail', e);
    }
  }
}

</script>