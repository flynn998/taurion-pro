<template>
  <div class="monitor-wrapper-bg">
    <div class="monitor-wrapper">
      <div class="monitor-header">
        <p class="text">{{ $t("addMonitoring_text_1") }}</p>
        <p class="text">{{  }}</p>
        <img class="header-close-btn" @click.stop="close()" src="@/assets/imgs/close.svg">
      </div>
      <div class="search-section">
        <input type="text" v-model="searchQuery" :placeholder="$t('addMonitoring_placeholder_1')" class="search-input" >
      </div>
      <main class="content">
<!--        loading-->
        <div class="center-box loading-box" v-if="loading">
          <img src="@/assets/imgs/ZKZg.gif" alt="">
        </div>
        <div class="monitor-search-title" v-if="!loading && searchQuery">{{ $t("addMonitoring_monitor-search-title_1") }}</div>
        <div class="center-box empty-box" v-if="!loading &&
        (
            (searchQuery && !monitorList.length) ||
            (!searchQuery && !unstartMonitors.length && !finishMonitors.length)
        )
">
            <img src="@/assets/imgs/empty.svg" alt="">
            <span>{{ $t("addMonitoring_span_1") }}</span>
        </div>
        <template v-if="!searchQuery && !loading">
          <!-- 监控卡片列表 -->
          <div class="monitor-title" v-if="unstartMonitors.length">{{ $t("addMonitoring_monitor-title_1") }}</div>
          <div class="monitoring-cards" v-if="unstartMonitors.length">
            <mid-monitor-card
                v-for="monitor in unstartMonitors"
                :key="monitor.id"
                :card="monitor"
                :disable="selectIdList.includes(monitor.id)"
                @select="select(monitor)"
            />
          </div>
          <div class="monitor-title" v-if="finishMonitors.length">{{ $t("addMonitoring_monitor-title_2") }}</div>
          <div class="monitoring-cards" v-if="finishMonitors.length">
            <mid-monitor-card
                v-for="monitor in finishMonitors"
                :key="monitor.id"
                :card="monitor"
                :disable="selectIdList.includes(monitor.id)"
                @select="select(monitor)"
            />
          </div>
        </template>
        <template v-if="searchQuery && !loading && monitorList.length">
          <div class="monitoring-cards">
            <infinite-scroll style="height: 280px;" :loadData="loadData" :initData="monitorList" :init-next="$store.state.monitor.searchMonitor?.has_next">
              <template #default="{ items }">
                <div style="width: 580px">
                  <mid-monitor-card
                      v-for="monitor in items"
                      :key="monitor.id"
                      :card="monitor"
                      :disable="selectIdList.includes(monitor.id)"
                      @select="select(monitor)"/>
                </div>
              </template>

            </infinite-scroll>
          </div>
        </template>
      </main>
      <div class="monitoring-footer">
        <div class="add-monitoring-cards" >
          <small-monitor-card
              v-for="monitor in selectMonitors"
              :key="monitor.id"
              :card="monitor"
              @remove="remove(monitor.id)"
          />
        </div>
        <taurion-btn  @click="addMonitor" :text="$t('Save')"  active-color="rgba(206, 184, 100, 1)"/>
      </div>
      <!-- 其余代码 -->
    </div>
  </div>
</template>

<script>

import MidMonitorCard from "~/components/monitor/MidMonitorCard.vue";
import SmallMonitorCard from "~/components/monitor/smallMonitorCard.vue";
let inputlock =  false;
export default {
  components: {
    SmallMonitorCard,
    MidMonitorCard
  },
  data() {
    return {
      searchQuery: '',
      selectMonitors:[],
      loading: false,
    };
  },
  computed: {
    monitorList() {
      return this.$store.state.monitor.searchMonitor?.records || []
    },
    hasNext() {
      return this.$store.state.monitor.searchMonitor?.has_next
    },
    unstartMonitors() {
      return this.$store.state.monitor.unstartMonitors
    },
    finishMonitors() {
      return this.$store.state.monitor.finishMonitors
    },
    selectIdList() {
      return this.selectMonitors.map(item => item.id)
    }
  },
  watch: {
    searchQuery() {
      if(!this.searchQuery) return;
      if(inputlock) return
      inputlock = true
      setTimeout(() => {
        inputlock = false
        this.searchMonitors()
      },400)
    }
  },
  methods: {
    searchMonitors() {
      this.loading = true
      this.$store.dispatch('monitor/fetchMonitorList', {
        searchName: this.searchQuery
      }).finally(()=> {
        this.loading = false
      });
    },
    async loadData() {
      console.log('loadData')
      const {has_next, records} = await this.$store.dispatch('monitor/fetchMonitorList', {
        status: this.mapTabToStatus(this.activeTab),
        searchName: this.searchQuery,
        page: (this.$store.state.monitor.searchMonitor.page || 0) + 1
      })
      return {
        hasNext: has_next,
        data: records
      }
    },
    getInitMonitors() {
      this.loading =true
      this.$store.dispatch('monitor/fetchFinishMonitorList', {});
      this.$store.dispatch('monitor/fetchUnstartMonitorList', {}).finally(()=> {
        this.loading = false
      });
    },
    select(item){
      if(this.selectMonitors.length > 4) {
        this.$toast.error(this.$t('addCoin_tips-1'))
      } else {
        const isDuplicate = this.selectMonitors.some((i) => i.id === item.id);
        if (isDuplicate) return
        this.selectMonitors = [...this.selectMonitors, item]
      }
    },
    remove(id) {
      this.selectMonitors = this.selectMonitors.filter(i => i.id !== id)
    },
    addMonitor() {
      this.$store.dispatch('monitor/addUserMonitor', this.selectMonitors.map(i => i.id));
    },
    close() {
      this.$store.commit("monitor/setAddMonitorShow", false)
    }
  },
  mounted() {
    this.getInitMonitors()
  }
}
</script>


<style scoped lang="less">
.monitor-wrapper-bg {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  z-index: 100;
}
.monitor-wrapper {
  font-family: 'Arial', sans-serif;
  width: 657px;
  min-height: 568px;
  background: rgba(38, 64, 64, 0.3);
  backdrop-filter: blur(100px);
  border-radius: 32px;
  padding: 32px 36px 0 36px;
}

.content {
  margin: 0 auto;
  height: 326px;
  padding-bottom: 20px;
  overflow-y: scroll;
  width: 600px;
  .monitor-search-title {
    color: rgba(140, 180, 189, 0.60);
    font-family: Avenir;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-transform: capitalize;
  }
  .loading-box {
    img {
      width: 32.757px;
      height: 32.972px;
    }
  }
  .empty-box {
    flex-direction: column;
    color: rgba(140, 180, 189, 0.60);
    font-family: Avenir;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-transform: capitalize;
    img {
      width: 64.757px;
      height: 76.972px;
    }
  }
}

.search-section {
  display: flex;
  justify-content: space-between;
  color: #ffffff;
}

.search-input {
  flex-grow: 1;
  box-sizing: border-box;
  background: transparent;
  border: 0.4px solid rgba(140, 180, 189, 0.3);
  border-radius: 8px;
  height: 48px;
  line-height: 48px;
  margin-top: 24px;
  margin-bottom: 12px;
  padding: 15px 20px;
  color: #fff;
}

.search-btn, .add-monitor-btn {
  padding: 10px 20px;
  background-color: #5b9bd5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-monitoring-cards {
  width: 460px;
  display: flex;
  flex-wrap: wrap;
}
.search-btn:hover, .add-monitor-btn:hover {
  background-color: #457fca;
}
.monitor-title {
  /* 🔥 历史精华 X Space */

  font-family: aifontf;
  font-style: normal;
  font-weight: 800;
  font-size: 14px;
  line-height: 120%;
  text-transform: capitalize;
  color: #CEB864;
  margin-bottom: 12px;
  margin-top: 20px;
}
.monitoring-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: scroll;
  .active {
    background: rgba(51, 140, 140, 0.5);
  }
}
.monitor-header {
  display: flex;
  justify-content: space-between;

  .text {
    font-family: aifont;
    font-style: normal;
    font-weight: 800;
    font-size: 20px;
    line-height: 27px;
    text-transform: uppercase;
    color: #CEB864;
  }



  .header-close-btn {
    cursor: pointer;
    font-family: 'Arial', sans-serif;
  }
}
.monitoring-footer {
  display: flex;
  padding-top: 20px;
  padding-right: 20px;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(140, 180, 189, 0.30);
}

/* Add additional styles below */
</style>
