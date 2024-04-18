<template>
  <form action="#" @submit.prevent="codeVerify">
    <input
      type="text"
      placeholder="کد را وارد نمایید"
      v-model="verficationCode"
    />
    <button type="submit">ارسال اطلاعات</button>
  </form>
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const userId = route.query.user_id;
console.log(userId);
const verficationCode = ref("");
const codeVerify = () => {
  const data = {
    id: userId,
    code: verficationCode.value,
  };
  console.log(verficationCode);
  fetch("http://telegrammeli.amirmohammadgharibi.ir/users/validate-code/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
};
</script>
