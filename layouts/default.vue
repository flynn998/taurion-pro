<template>
  <div class="main">
    <template v-if="isFullPage">
      <nuxt/>
    </template>
    <template v-else>
      <AppHeader></AppHeader>
      <div class="page-container">
        <nuxt/>
      </div>
      <div class="footer">
      </div>
      <glob-dialog/>
      <ball-bg1/>
    </template>
  </div>
</template>
<script>
import AppHeader from "~/components/AppHeader/index.vue";
import GlobDialog from "~/components/dialog/GlobDialog.vue";

export default {
  components: {
    GlobDialog,
    AppHeader
  },
  data() {
    return {
      fullPage: ['privacy', 'terms']
    };
  },
  beforeCreate() {
    this.$store.commit('lang/setTranslate', this.$i18n.messages[this.$i18n.locale])
  },
  computed: {
    isFullPage() {
      return ['privacy', 'terms', 'mobile'].findIndex(item => this.$route.path.includes(item)) > -1
    },
    isMobile() {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      return isMobile
    }
  },
  mounted() {
    this.checkDeviceAndRedirect()
    //更新语言
    const token = this.$localStorage.getItem('token')
    if (token) {
      this.$store.dispatch('user/getUserInfo')
    }
  },
  methods: {
    checkDeviceAndRedirect() {
      const currentPath = this.$route.path;
      // 移动设备且当前路径不包含 '/mobile'
      if (this.isMobile && !currentPath.includes('/mobile')) {
        this.$router.push(this.localeRoute(`/mobile`));
      }

      // 非移动设备且当前路径包含 '/mobile'
      if (!this.isMobile && currentPath.includes('/mobile')) {
        this.$router.push(this.localeRoute(`/`));
      }
    }
  }
}
</script>

<style lang="less">
body {
  background: linear-gradient(180deg, rgba(5, 14, 32, 1) 0%, rgba(8, 35, 61, 1) 100%);
  font-family: Avenir;
}

html, body {
  overscroll-behavior-y: none;
}


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;

  .page-container {
    height: calc(100vh - 88px);
    position: relative;
    display: flex;
    justify-content: center;
  }
}

</style>
