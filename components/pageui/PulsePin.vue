<template>
  <div class="pin-pulse">
    <div class='pin'></div>
    <div class='pulse'></div>
  </div>
</template>

<script>
export default {
  name: 'PulsePin',
}
</script>

<style scoped lang="less">
@keyframes pulsate {
  0% {
    transform: scale(0.1, 0.1);
    opacity: 0;
  }
  50% {
    opacity: 1.0;
  }
  100% {
    transform: scale(1.2, 1.2);
    opacity: 0;
  }
}

@keyframes bounce {
  0% {
    opacity: 0;
    transform: translateY(-2000px) rotate(-45deg);
  }
  60% {
    opacity: 1;
    transform: translateY(30px) rotate(-45deg);
  }
  80% {
    transform: translateY(-10px) rotate(-45deg);
  }
  100% {
    transform: translateY(0) rotate(-45deg);
  }
}

.pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: #386E71;
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -20px 0 0 -20px;
  animation-name: fade-in; // 使用新的淡入动画
  animation-fill-mode: both;
  animation-duration: 1s; // 可以调整动画时长以控制淡入速度
  animation-delay: 10s; // 3秒后开始动画
  &:after {
    content: '';
    width: 12px;
    height: 12px;
    margin: 9px 0 0 9px;
    background: #203448;
    position: absolute;
    border-radius: 50%;
  }
}

.pulse {
  background: rgba(0,0,0,0.2);
  border-radius: 50%;
  height: 14px;
  width: 14px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: 11px 0px 0px -12px;
  transform: rotateX(55deg);
  z-index: -2;
  &:after {
    content: "";
    border-radius: 50%;
    height: 40px;
    width: 40px;
    position: absolute;
    margin: -13px 0 0 -13px;
    animation: pulsate 1s ease-out infinite;
    opacity: 0.0;
    box-shadow: 0 0 1px 2px rgba(89, 150, 152, 0.3);
    animation-delay: 1.1s;
  }
}

</style>
