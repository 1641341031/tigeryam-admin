<script setup>
import { ref } from "vue";
import { login } from "@/api/login.js";
import { setToken } from "@/utils/auth.js";
import { useRouter } from "vue-router";
import {verifyCode} from '@/api/verifyCode.js'

const router = useRouter();
const username = ref("");
const password = ref("");
const code = ref("");
const verify_img = ref('')

function getVerifyCode() {
    verifyCode().then((reps) => {
        let blob = new Blob([reps.data], {type: "image/png"})
        let url = window.URL.createObjectURL(blob)
        verify_img.value = url
    }) 
}
getVerifyCode()

async function submit() {
    const userName = username.value.trim()
    const passWord = password.value.trim()
    const code_ = code.value.trim()
    if(check(userName) || check(passWord)){
        ElMessage.error('请正确输入用户名或密码！')
        return;
    }
    if(check(code_)){
        ElMessage.error('请正确验证码！')
        return;
    }
  try {
    const result = await login(userName, passWord, code_);
    let { data } = result.data;
    if (result.data.code === 200) {
      const tokenStr = data.tokenHead + data.token;
      setToken(tokenStr);
      router.push({ path: "/" });
    } else {
      ElMessage.error(result.data.message);
    }
  } catch (e) {
    console.log(e);
  }
}

const check = (r)=>{
    if(r==undefined || r==null || r.length == ''){
        return true
    }
}

</script>

<template>
  <div class="login-wrap">
    <h3>Admin System</h3>
    <div class="lg-form-wrap">
      <div class="form-wrap">
        <div class="un-wrap">
          <input
            class="field"
            type="text"
            v-model="username"
            id="username"
            required
          />
          <label for="username">用户名</label>
        </div>
        <div class="pw-wrap">
          <input
            class="field"
            type="password"
            v-model="password"
            id="password"
            required
          />
          <label for="password">密码</label>
        </div>
        <div class="verify-code-wrap">
          <input
            class="field"
            type="text"
            v-model="code"
            @keyup.enter="submit"
            id="code"
            required
          />
          <label for="code">验证码</label>
          <img :src="verify_img" alt="验证码" @click="getVerifyCode">
        </div>
        <div class="bt-wrap">
          <button class="field" type="submit" @click="submit">登录</button>
        </div>
      </div>
    </div>
    <div class="rg-fg-wrap">
      <router-link to="#">忘记密码</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-wrap {
  overflow: hidden;
  border-radius: 8px;
  background-color: #eee;
  width: 38vw;
  min-width: 300px;
  max-width: 1200px;
  margin: 4em auto;
  box-shadow: 3px 3px 3px rgb(165, 164, 164);

  h3 {
    font-family: Arial, Helvetica, sans-serif;
    border-radius: 5px, 5px;
    height: 3em;
    background: linear-gradient(90deg, #85d5f0, #6a77dde8);
    color: #fff;
    line-height: 3em;
    text-align: center;
    font-size: 2em;
  }

  .lg-form-wrap {
    // height: 240px;
    .form-wrap {
      margin-top: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .field {
        min-width: 280px;
        width: 35vw;
        height: 40px;
        border-radius: 1.5em;
        border: none;
        outline: none;
      }

      label {
        color: rgb(104, 102, 102);
        position: absolute;
        left: 10px;
        top: 10px;
        transition: 0.8s;
      }

      div {
        position: relative;
      }

      & div + div {
        margin-top: 24px;
      }

      input {
        padding-left: 8px;

        &:focus {
          border: 1px solid #6a77dde8;
        }

        &:focus + label,
        &:valid + label {
          color: #6a77dde8;
          transform: translateY(-20px);
        }
      }

      .verify-code-wrap {
        position: relative;

        // overflow: hidden;
        img {
          position: absolute;
          right: 0;
          height: 40px;
          width: 36%;
          border-radius: 0 1.5em 1.5em 0;
        }
      }

      button {
        background: linear-gradient(90deg, #85d5f0, #6a77dde8);
        font-size: 1em;
        color: #fff;

        // transition: 0.6s;
        &:hover {
          opacity: 0.8;
          color: #000;
          cursor: pointer;
        }

        &:active {
          border: 1px solid #192dc3e8;
          box-shadow: 0.1em 0.1em 0.5em #124;
        }
      }
    }
  }

  .rg-fg-wrap {
    margin: 16px 0 8px 0;
    text-align: end;

    a {
      margin: 0 8px;
      text-decoration: none;
      color: #000;
      display: inline-block;
      transition: 0.8s;

      &:hover {
        color: #6a77dde8;
        text-shadow: 3px 3px 3px rgb(114, 113, 113);
      }
    }
  }
}
</style>