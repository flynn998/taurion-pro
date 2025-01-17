<template>
  <div class="chat-box">
    <div class="chat-top">
      <div class="chat-top-left">
        <div class="chat-top-image">
          <div class="mic" :class="{'sendLoading':sendLoading || showWelcome}">
            <img class="mic-icon" :src="robot.avatar" alt="" v-if="robot.avatar">
            <div class="mic-shadow"></div>
          </div>
        </div>
        <div class="chat-top-title">{{ robot.text }}</div>
      </div>
      <div class="chat-top-icon" v-if="false">
        <img class="img1" src="@/static/images/chat/s1.svg" alt="" @click="clean">
        <img class="img2" src="@/static/images/chat/s3.svg" alt="">
      </div>
    </div>

    <div class="chat-content" ref="messagesContainer" @scroll="handleScroll">
      <div class="loading-container" v-if="isLoading && !showWelcome">
        <dot-carousel/>
      </div>
      <div class="chat-padding">
        <template v-for="(item) in messageList">
          <!-- 消息时间-->
          <div class="message-time" v-if="item.displayTime">{{ item.displayTime }}</div>
          <!--AI焦点-->
          <div class="text-message-box1"
               :class="`text-message-${item.seqNo}`"
               v-if="item.context && item.context.hook && item.context.hook.type === 'FOCUS'">
            <div class="focus-box">
              <div class="focus-tip">
                <btn cursor="default">
                  <img src="@/static/images/chat/s2.svg" alt="">
                  <div>{{ $t("AI_FOCUS") }}</div>
                </btn>
              </div>
              <div class="focus-text">{{ item.text }}</div>
            </div>
          </div>
          <!--信号源-->
          <div class="text-message-box1"
               :class="`text-message-${item.seqNo}`"
               v-if="item.context && item.context.hook && item.context.hook.type === 'SIGNAL_SOURCE'">
            <div class="focus-box">
              <div class="focus-tip">
                <btn cursor="default">
                  <div style="padding-left: 5px">H SPACE</div>
                </btn>
              </div>
              <div class="focus-text">{{ item.text }}</div>
            </div>
          </div>
          <!--欢迎的任务-->
          <welcomeTask v-if="showWelcome && item.source === 'T-brain' && item.type"
                       @goBottom="scrollToBottom"
                       :message="item"/>
          <!--文本内容-->
          <template v-if="item.text && !(item.context && item.context.hook) || item.loading">
            <!--用户的文字内容-->
            <div class="text-message-box1"
                 :class="`text-message-${item.seqNo}`"
                 v-if="item.source === 'USER'">
              <div class="text-message">
                {{ item.text }}
              </div>
            </div>
            <!--系统文案-->
            <div class="text-message-box2"
                 v-else>
              <!--欢迎页专用文本渲染-->
              <div class="text-message-v2 text-message-v3"
                   v-if="item.source === 'T-brain'">
                <Typewriter @writerOver="writerOver"
                            :typingSpeed="typingSpeed"
                            :highlightList="item.highlightList" :text="item.text"/>
              </div>
              <!--loading 内容-->
              <div class="text-message-v2" v-else-if="item.loading">
                <div class="chat-bubble">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </div>
              <!--机器人文本渲染-->
              <div class="text-message-v2"
                   v-else-if="!item.error || (item.error && lastMessage.seqNo === item.seqNo)">
                <!--                {{ item.text }}-->
                <renderedMarkdown :content="item.text"/>
              </div>
              <!--异常提示-->
              <img class="error-image"
                   v-if="messageStatus === 'error' && item.source !== 'T-brain' && lastMessage.seqNo === item.seqNo"
                   @click="messageErrorClick(item)"
                   src="@/assets/imgs/error.svg" alt="">
            </div>
          </template>
          <!--定制卡片内容-->
          <chat-card :layers="item.layers" :seq-no="item.seqNo" v-if="item.layers && item.layers.length > 0"/>
        </template>
      </div>
    </div>

    <div class="input-box"
         v-show="!disableInput"
         :class="{'input-disable':disableSend}">
      <input type="text" id="chatInput" v-model="message"
             :placeholder="$t('Robot_message_ask')"
             :disabled="disableInput">
      <div class="send-btn" @click="sendMessage">
        <send-btn :sendLoading="sendLoading"/>
      </div>
    </div>

  </div>
</template>

<script>
import Typewriter from "@/components/Typewriter.vue";
import btn from "./components/btn.vue";
import chatCard from "./components/card.vue";
import welcomeTask from "./components/welcomeTask.vue";
import SendBtn from "@/components/chat/components/sendBtn.vue";
import renderedMarkdown from "@/components/renderedMarkdown.vue";
import {chatClean} from "@/common/home";


let socket
let retry = 0
export default {
  components: {
    Typewriter,
    btn,
    chatCard,
    welcomeTask,
    SendBtn,
    renderedMarkdown
  },
  props: {
    showWelcome: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      message: '',
      socketSessionId: '',
      pingId: '',
      welcomeInputDisable: false,
      isViewingHistory: false,
      mode: 'production',
      isLoading: false,
    }
  },
  computed: {
    typingSpeed() {
      return this.$i18n.locale === 'zh' ? 80 : 30
    },
    conversationId() {
      return this.$store.state.chat.conversationId
    },
    messageList() {
      return this.$store.state.chat.messageList
    },
    disableInput() {
      if (this.showWelcome) {
        return this.$store.state.chat.welcomeIndex < 7
      } else {
        return false
      }
    },
    disableSend() {
      return !this.message
    },
    isFinished() {
      return this.$store.state.chat.isFinished
    },
    robot() {
      return this.$store.state.chat.robot
    },
    lastMessage() {
      return this.messageList[this.messageList.length - 1];
    },
    messageStatus() {
      return this.$store.state.chat.messageStatus
    },
    sendLoading() {
      return this.$store.state.chat.messageStatus === 'loading' || this.$store.state.chat.messageStatus === 'concat'
    },
  },
  mounted() {
    // 初始化socket
    retry = 0
    this.initSocket()
    // 初始化语言
    this.initLang()
    if (this.showWelcome) {
      // 获取热门推荐的币种 和信号源
      setTimeout(() => {
        this.$store.dispatch('coin/fetchCoinList', {size: 5})
        this.$store.dispatch('monitor/fetchMonitorList', {size: 5, status: 3})
      }, 3000)
      // 获取消息ID
      this.loadEarlierMessages()
      // 没有历史消息，则去拉取历史消息
    } else if (this.messageList.length === 0) {
      this.loadEarlierMessages()
    }

    this.mode = this.$route.query.mode || 'production'
    // 输入框键盘事件
    this.$nextTick(() => {
      this.inputKeyDown()
    })

    this.$bus.$on('GO_CHAT_BOTTOM', () => {
      this.scrollToBottom()
    })
  },
  methods: {
    initSocket() {
      retry++
      this.$connectSocket()
      socket = this.$socket()
      console.log('socket', socket)
      socket.on('chat', this.onWebsocketReceiveMessage);
      socket.on('connect', this.onWebsocketConnect);
      socket.on('disconnect', () => {
        console.log('Disconnected from socket server', retry);
        if (retry < 3) {
          this.initSocket()
        }
      });
    },
    clean() {
      this.$axios.get(chatClean)
    },
    messageErrorClick(item) {
      this.$toast.error(item.error || this.$t("networkError"))
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    },
    initLang() {
      this.$store.dispatch('chat/updateLang', this.showWelcome)
    },
    handleScroll(e) {
      if (this.showWelcome) return
      const {scrollTop} = e.target
      if (!this.isLoading && !this.isFinished && scrollTop <= 0) {
        this.isLoading = true
        this.loadEarlierMessages()
      }
    },
    inputKeyDown() {
      let isComposing = false;
      let that = this

      const chatInput = document.getElementById('chatInput');

      chatInput.addEventListener('compositionstart', function () {
        isComposing = true; // 开始输入法组合输入
      });

      chatInput.addEventListener('compositionend', function () {
        isComposing = false; // 输入法组合输入结束
      });

      chatInput.addEventListener('keydown', function (e) {
        // 如果是回车键，并且不在输入法组合输入状态，且没有按下Shift键
        if (e.key === 'Enter' && !isComposing && !e.shiftKey) {
          e.preventDefault(); // 阻止默认行为，如换行
          that.sendMessage()
        }
      });
    },
    async loadEarlierMessages() {
      // 加载历史聊天对话
      // NOTE: 对话 id 为空意味着还没获取过聊天历史，下面的 api 会在返回历史消息的同时附上对话 id。
      //   对话 id 需要附加到每次的对话消息中，后端凭借该 id 来区别不同的对话上下文。
      //   这种方式是针对当前用户只有一个会话的情况而简化了交互逻辑。
      //   更一般的做法应该是先获取对话列表，然后用户点击哪个对话，再根据点击对话的 id 来拉取历史消息。

      // 获取历史消息之前的滚动条高度
      this.isLoading = true
      const previousHeight = this.$refs.messagesContainer?.scrollHeight;
      await this.$store.dispatch('chat/fetchEarlierMessages', this.showWelcome)
      this.isLoading = false
      if (this.$refs.messagesContainer) {
        // 插入后，调整滚动位置
        this.$nextTick(() => {
          const currentHeight = this.$refs.messagesContainer?.scrollHeight;
          this.$refs.messagesContainer.scrollTop += currentHeight - previousHeight;
        });
      }

    },
    onWebsocketReceiveMessage(data) {
      let msg = data
      if (this.mode !== 'dev' && data.layers) {
        msg.layers = data.layers.filter(layer => layer.type !== 'LOG')
      }
      // 修复空数组
      msg.layers = msg.layers?.filter(l => !!l) || []
      if (data.conversationId !== this.conversationId) {
        console.log(`ignore message from other conversation:`, data)
        return
      }
      if (msg.text === '' && msg.layers.length === 0 && !!msg.more) {
        console.log('ignore empty message:', data)
        return
      }
      this.$store.dispatch('chat/pushAIMessage', msg)
      this.$nextTick(() => {
        let box = document.querySelectorAll(`.text-message-${msg.seqNo}`)
        const top = box[box.length - 1]?.offsetTop
        // console.log('top', top)
        this.scrollToBottom(top)
      })

      // this.scrollToBottom()
    },
    onWebsocketConnect(data) {
      console.log('Connected to socket server', data);
      if (data) {
        this.socketSessionId = data
      }
    },
    sendMessage() {
      if (!this.message || !this.conversationId) return
      // 上一条消息未处理完，不发送
      if (this.messageStatus === 'loading' || this.messageStatus === 'concat') {
        return false
      }

      this.$store.dispatch('chat/sendUserMessage', {text: this.message})
      this.message = ''
      this.scrollToBottom()
    },
    writerOver() {
      const lastMsg = this.messageList[this.messageList.length - 1]
      if (lastMsg.source === 'T-brain') {
        // 自动下一句
        if (lastMsg.autoNext) {
          if (lastMsg.sleep) {
            setTimeout(() => {
              this.$store.dispatch('chat/welcomeToNext')
              this.scrollToBottom()
            }, lastMsg.sleep)
          } else {
            this.$store.dispatch('chat/welcomeToNext')
            this.scrollToBottom()
          }
        }
        // 需要推荐热门币种 或者 热门信号源
        if (lastMsg.needPushHotCoin || lastMsg.needPushHotMonitor) {
          const para = {
            seqNo: null,
            source: "ASSISTANT",
            context: null,
            text: '',
            layers: [
              {
                type: lastMsg.needPushHotCoin ? "HOT_COINS" : "MONITORING_SIGNAL",
                title: lastMsg.needPushHotCoin ? this.$t("TOPCRYPTOCURRENCIES") : this.$t("TOPSIGNALSOURCE"),
                data: {
                  coins: this.$store.state.coin.coinList,
                  sources: this.$store.state.monitor.searchMonitor?.records
                }
              },
              {
                type: "YOU_CAN_ASK",
                title: this.$t("YOUCANASK"),
                data: {
                  questions: lastMsg.needPushHotCoin ? [this.$t('youCanAsk1'), this.$t('youCanAsk2'), this.$t('youCanAsk3')] : [this.$t('youCanAsk4'), this.$t('youCanAsk5'), this.$t('youCanAsk6')]
                }
              }
            ],
            more: false,
          }
          this.$store.dispatch('chat/pushWelcomeMessage', para)
          this.$nextTick(() => {
            let box = document.querySelectorAll('.task-box')
            const top = box[box.length - 1].offsetTop
            this.scrollToBottom(top)
          })
        }
        if (lastMsg.over) {
          setTimeout(() => {
            this.$emit('welcomeOver')
          }, 1000)
        }
      }
    },
    scrollToBottom(topVale) {
      console.log('scrollToBottom', topVale)
      this.$nextTick(() => {
        // console.log('scrollToBottom', topVale)
        const messagesContainer = this.$refs.messagesContainer;
        messagesContainer.scrollTo({
          top: topVale || messagesContainer.scrollHeight,
        })
      });
    },
  },
  beforeDestroy() {
    socket.off('chat', this.onWebsocketReceiveMessage);
    socket.off('connect', this.onWebsocketConnect);
    this.$bus.$off('GO_CHAT_BOTTOM')
  }
}
</script>

<style lang="less" scoped>


.loading-container {
  text-align: center;
  transition: height 0.3s;

  img {
    width: 30px;
  }
}

.message-time {
  color: #5D7B86;
  font-family: Avenir;
  font-size: 10px;
  font-style: normal;
  font-weight: 350;
  line-height: normal;
  width: 100%;
  text-align: center;
  margin-top: 14px;
}

.mic {
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    z-index: 2;
    box-shadow: 0 0 2px 2px #083E4F;
  }

  &::before {
    width: 60px;
    height: 60px;
    background-color: rgba(20, 37, 47, 1);
  }

  &::after {
    width: 45px;
    height: 45px;
    //background: linear-gradient(160deg, #00FEB5 20.04%, #00FEB5 20.04%, #90FF00 78.21%);
    //animation: circle-size 0.8s linear infinite alternate;
  }

  &-icon {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 40px;
    height: 40px;
    z-index: 3;

    &::before,
    &::after {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
    }

    &::before {
      width: 0.2px;
      height: 0.5px;
      top: calc(100% + 1px);
      left: 50%;
      transform: translate(-50%, 0);
      background-color: #fff;
    }

    &::after {
      border: 2px solid;
      width: 0.8px;
      height: 1.8px;
      left: 50%;
      top: -1px;
      border-radius: 4px;
      transform: translate(-50%, 0);
    }
  }

  &-shadow {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    z-index: 1;
    //animation: shadow-rotate 1.5s linear infinite;
    transform-origin: center;
  }
}

.sendLoading {
  &::after {
    animation: circle-size 0.8s linear infinite alternate;
  }

  .mic-shadow {
    box-shadow: 2px -5px 6px 3px rgba(30, 83, 95, 0.3), 5px -2px 10px 2px rgba(30, 83, 95, 0.3), -2px -3px 20px 2px rgba(26, 41, 49, 0.3), 5px 1px 3px 2px rgba(30, 83, 95, 0.3), .6px .4px 15px 2px rgba(26, 41, 49, 0.3);
    animation: shadow-rotate 1.5s linear infinite;
  }
}

@keyframes circle-size {
  from {
    width: 45px;
    height: 45px;
  }
  to {
    width: 35px;
    height: 35px;
  }
}


@keyframes shadow-rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}


/* 聊天气泡的基本样式 */
.chat-bubble {
  display: flex;
  gap: 5px; /* 点之间的间隔 */
  padding: 6px;
}

/* 点的基本样式 */
.dot {
  width: 5px;
  height: 5px;
  background-color: rgba(217, 217, 217, 0.2);
  border-radius: 50%;
  animation: blink 1.5s infinite; /* 应用动画 */
}

/* 定义动画 */
@keyframes blink {
  0%, 100% {
    background-color: rgba(217, 217, 217, 0.2);
  }
  50% {
    background-color: #D9D9D9;
  }
}

/* 为每个点设置不同的动画延迟，实现轮流变色的效果 */
.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.4s;
}

.dot:nth-child(3) {
  animation-delay: 0.8s;
}


.chat-box {
  width: 515px;
  background-color: rgba(38, 64, 64, 0.3);
  box-sizing: border-box;
  padding: 0 0 20px;
  border-radius: 0 31px 0 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  .chat-padding {
    padding: 0 24px;
  }


  .input-box {
    width: 461px;
    height: 56px;
    border-radius: 8px;
    //border: 0.4px solid rgba(140, 180, 189, 0.3);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px;
    margin-top: 10px;
    margin-left: 24px;
    border: 1px solid #8CB4BD;

    //.send-btn {
    //  width: 48px;
    //  height: 48px;
    //}

    input {
      display: block;
      flex: 1;
      height: 100%;
      outline: none;
      border: none;
      background-color: transparent;
      color: rgba(255, 255, 255, 1);
      font-family: Avenir;
      font-weight: 500;
      font-size: 13px;

    }
  }

  .input-disable {
    opacity: 0.4;
  }

  .chat-content {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    margin: 0 auto;
    position: relative;
    scroll-behavior: smooth;


    .text-message-box2 {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .error-image {
        width: 24px;
        height: 24px;
        margin-left: 12px;
        margin-top: 14px;
        cursor: pointer;
      }
    }

    .text-message-box1 {
      display: flex;
      justify-content: flex-end;
    }

    .text-message {
      max-width: 90%;
      box-sizing: border-box;
      padding: 16px 20px;
      border-radius: 16px;
      background: rgba(140, 180, 189, 0.1);
      color: rgba(255, 255, 255, 1);
      font-family: Avenir;
      font-weight: 500;
      font-size: 13px;
      //text-transform: capitalize;
      margin-top: 14px;
      display: table;
    }

    .text-message-v2 {
      max-width: 440px;
      overflow: hidden;
      box-sizing: border-box;
      min-height: 55px;
      padding: 16px 20px;
      border-radius: 16px;
      color: rgba(255, 255, 255, 1);
      border: 2px solid rgba(255, 255, 255, 0.1);
      font-family: Avenir;
      font-weight: 500;
      font-size: 13px;
      margin-top: 14px;
      //white-space: pre-line;

    }

    .text-message-v3 {
      white-space: inherit;
    }


    .focus-box {
      max-width: 400px;
      border-radius: 16px;
      background: rgba(140, 180, 189, 0.1);
      position: relative;
      margin-top: 34px;

      .focus-text {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 15px 16px 11px 20px;
        color: rgba(255, 255, 255, 1);
        font-family: Avenir;
        font-weight: 500;
        font-size: 13px;
        //text-transform: capitalize;
      }
    }
  }

  .focus-tip {
    height: 25px;
    position: absolute;
    top: -12px;
  }

  .chat-top {
    height: 88px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .chat-top-left {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .chat-top-image {
      width: 88px;
      height: 88px;
      position: relative;
      margin-left: 15px;
    }

    .chat-top-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      .img1 {
        width: 28px;
        margin-right: 25px;
      }

      .img2 {
        width: 24px;
      }
    }

    .chat-top-title {
      height: 38px;
      padding: 0 20px;
      border-radius: 19px 19px 19px 0;
      background: rgba(138, 173, 188, 0.1);
      backdrop-filter: blur(217.899994px);
      color: rgba(255, 255, 255, 0.36);
      font-family: Avenir;
      font-weight: 500;
      font-size: 12px;
      //text-transform: capitalize;
      text-align: center;
      line-height: 38px;
      margin-left: 5px;
    }
  }
}

</style>
