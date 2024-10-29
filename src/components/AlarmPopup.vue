<template>
  <div class="popup-container">
    <div class="popup__header">
      <span class="popup__title">{{ title }}</span>
      {{ $el }}
      <button class="popup__headerbtn" @click="handlcClose">
        <i class="popup__close el-icon-close"></i>
      </button>
    </div>
    <div class="popup__body">
      {{ popupData }}
    </div>
  </div>
</template>

<script>
export default {
  name: "AlarmPopup",
  data() {
    return {
      title: '报警信息',
      popupData: {}
    }
  },
  methods: {
    setData(data) {
      this.popupData = data
    },

    handlcClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-container {
  position: absolute;

  background: transparent url("~@/assets/img/popup_bg.png");
  width: 279px;
  height: 313px;

  .popup__header {
    padding: 5px 12px;
    position: relative;

    .popup__title {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #FF5959;
    }

    .popup__headerbtn {
      position: absolute;
      top: 2px;
      right: -10px;
      background: url("~@/assets/img/close_icon.png");
      width: 26px;
      height: 26px;
      border: none;
      outline: none;
      cursor: pointer;

      .popup__close {
        color: transparent;
        display: none;
      }
    }
  }

  .popup__body {
    padding: 12px;

    //   ::v-deep .el-descriptions {
    //     .el-descriptions-item__cell {
    //       padding-bottom: 6px;
    //     }

    //     .el-descriptions__title {
    //       color: #FFFFFF;
    //     }

    //     .el-descriptions__body {
    //       font-family: Microsoft YaHei;
    //       font-weight: 400;
    //       font-size: 16px;
    //       background-color: transparent;
    //       color: #FFFFFF;

    //       .el-descriptions-item__label {
    //         color: #FFCEAE;
    //       }

    //       .el-descriptions-item__content {

    //       }
    //     }
    //   }

    .online {
      color: #0CA71F;
    }

    .offline {
      color: #A97300;
    }
  }

}
</style>