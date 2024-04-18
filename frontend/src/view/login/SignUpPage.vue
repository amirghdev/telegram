<template>
  <div
    class="bg-[#212121] overflow-hidden flex justify-center items-center w-[100vw] h-[100vh]"
  >
    <div class="text-center w-[350px] my-auto mx-auto h-[538px]">
      <div class="justify-center w-44 mt-4 m-auto flex">
        <img
          class="w-full h-full object-contain"
          src="../../assets/images/login/Telegram_logo3.png"
          alt=""
        />
      </div>
      <div class="text-center text-[32px] text-white">
        <h4 class="mt-6 mb-5 font-iransensBold">ثبت نام در تلگرام ملی</h4>
      </div>
      <div class="grid col-auto text-[#929292] mb-5">
        <span class="font-iransensUltralight"
          >لطفاً ایمیل خود را وارد کنید</span
        >
      </div>
      <form
        @submit="checkForm"
        class="flex flex-col justify-center mx-auto w-full"
      >
        <div class="relative w-full">
          <input
            dir="ltr"
            type="email"
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            id="email-input"
            name="email"
            class="pl-3 w-full h-12 pb-1 text-[#929292] bg-transparent rounded-lg border border-gray-700 hover:border-green-300 focus:outline-none focus:border-green-500 active:border-green-500 pr-4 placeholder:text-sm placeholder:font-iransensRegular placeholder:relative placeholder:-top-6 placeholder:z-10"
            @input="emailValue ? (isEmailFocus = true) : (isEmailFocus = false)"
            v-model="emailValue"
            required
          />
          <div
            id="lable-email"
            class="text-xs duration-300 transition-all absolute bg-[#212121] w-10"
            :class="isEmailFocus ? '-top-3 right-4' : 'top-3.5 right-5'"
          >
            <label
              id="lable-email2"
              class="font-iransensRegular text-[#929292] cursor-text"
              :class="isEmailFocus ? 'text-xs' : 'text-sm'"
              for="email-input"
              >ایمیل</label
            >
          </div>
        </div>
        <div
          class="mt-1 w-full flex items-start-center h-14 hover:rounded-xl hover:bg-[#2c2b2b] p-2"
          dir="rtl"
        >
          <!-- <div
          dir="rtl"
          id="activecheckbox"
          class="flex items-start-center w-full h-14 hover:rounded-xl hover:bg-[#2c2b2b] p-2"
        > -->
          <input
            id="checkboxinput"
            class="cursor-pointer appearance-none rounded-sm w-4 h-4 ml-3 bg-neutral-200 my-auto checked:bg-tickimage2 checked:bg-cover"
            type="checkbox"
            v-model="rememberMeFlag"
          />
          <label
            for="checkboxinput"
            class="flex items-center w-full h-full my-auto text-sm text-[#929292] cursor-pointer font-iransensRegular select-none"
            >مرا بخاطر بسپار</label
          >
          <!-- </div> -->
        </div>
        <div class="mt-2 w-full">
          <button
            type="submit"
            class="w-full h-12 rounded-lg bg-green-600 text-white font-iransensMedium hover:bg-green-700 active:bg-green-600"
          >
            ثبت نام
          </button>
        </div>
      </form>
      <div class="mt-5 w-full">
        <a
          href="#"
          class="w-full h-14 bg-transparent text-green-500 underline hover:rounded-xl hover:bg-[#2c2b2b]"
          >SIGN IN BY QR CODE</a
        >
        l
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const isEmailFocus = ref(false);
const emailValue = ref("");
const rememberMeFlag = ref(false);
const checkForm = async e => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (regex.test(emailValue.value)) {
    const data = reactive({
      email: emailValue.value,
    });
    e.preventDefault();
    await fetch(
      "http://telegrammeli.amirmohammadgharibi.ir/users/sendRegisterCode/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        router.push({ name: "email-verify", query: { user_id: data.id } });
      })
      .catch(err => console.log(err));
    // return true;
  } else {
    e.preventDefault();
    console.log("لطفا یک ایمیل معتبر وارد نمایید.");
    return false;
  }
};
</script>
