<template>
  <div class="user-box"
       :style="info.style">
    <div class="userinfo">
      <img :src="info.pic" alt="">
      <span class="name">{{ info.name }}</span>
      <span class="phone">{{ info.title}}</span>
    </div>
    <p class="desc">
      <typing-text
          font-size="13px"
          font-family="Avenir"
          margin-bottom="1px"
          width="36ch"
          color="rgba(255,255,255,0.5)"
          :lines="info.lines"
      />
    </p>
    <div class="line">
      <pulse-pin class="local"/>
    </div>
  </div>
</template>

<script>
import PulsePin from "@/components/pageui/PulsePin.vue";

export default {
  name: 'userPop',
  components: {PulsePin},
  props: {
    info: {
      type: Object
    }
  }
}
</script>

<style scoped lang="less">
.userinfo, .desc {
  animation: bounceIn 1s forwards;
}
.user-box {
  position: absolute;
  width: 281px;
  height: 153px;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(2, 111, 114, 0.3);
  backdrop-filter: blur(200px);
  padding: 17px 20px;
  animation: scaleIn 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
  .userinfo {
    display: flex;
    align-items: end;
    img {
      width: 40px;
      height: 40px;
      border-radius: 40px;
    }

    .name {
      height: 27px;
      font-family: 'Avenir';
      font-style: normal;
      font-weight: 900;
      font-size: 20px;
      line-height: 27px;
      color: #E4E6FB;
      margin: 0 8px;
    }

    .phone {
      height: 20px;
      font-family: 'Avenir';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #E4E6FB;
      opacity: 0.5;
    }

  }

  .desc {
    width: 244px;
    height: 72px;
    font-family: 'Avenir';
    margin-top: 8px;
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    color: #E4E6FB;
    opacity: 0.5;
  }

  .line {
    position: absolute;
    bottom: -62px;
    left: 19px;
    width: 1px;
    height: 62px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    .local {
      position: absolute;
      bottom: -20px;
      left: 4px;
    }
  }

}
@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0%, 20%, 50%, 80%, 100% {
    transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

</style>
