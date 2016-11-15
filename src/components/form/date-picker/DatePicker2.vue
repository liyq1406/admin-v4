<template>
  <div class="x-datepicker" :style="pickerStyle">
    <div class="x-datepicker-value">
      <div class="x-datepicker-showbox" @click="onShowboxClick">2016-12-28 12:38:47</div>
      <!-- <i class="fa fa-times-circle x-datepicker-clear"></i> -->
      <i class="fa fa-calendar x-datepicker-icon"></i>
    </div>
    <div class="x-datepicker-panel" v-show="open">
      <div class="x-datepicker-input-wrap">
        <input v-model="dateStr" type="text" class="x-datepicker-input" placeholder="请输入时间">
      </div>
      <div class="x-datepicker-date-panel">
        <div class="x-datepicker-header">
          <a href="#" class="fa fa-angle-double-left x-datepicker-prev-year-btn" @click.prevent="onPrevYearClick"></a>
          <a href="#" class="fa fa-angle-left x-datepicker-prev-month-btn" @click.prevent="onPrevMonthClick"></a>
          <span class="x-datepicker-my-select">
            <a href="#" class="x-datepicker-month-select">{{ locale.months[month] }}</a>
            <a href="#" class="x-datepicker-year-select">{{ year }}</a>
          </span>
          <a href="#" class="fa fa-angle-right x-datepicker-next-month-btn" @click.prevent="onNextMonthClick"></a>
          <a href="#" class="fa fa-angle-double-right x-datepicker-next-year-btn" @click.prevent="onNextYearClick"></a>
        </div>
        <div class="x-datepicker-body">
          <div class="x-datepicker-weekdays">
            <div class="x-datepicker-weekday-item" v-for="weekday in locale.shorterWeekdays">{{ weekday }}</div>
          </div>
          <div class="x-datepicker-days-list">
            <div v-for="date in dateList" class="day-item" :class="{
              'day-item--in-month': date.inMonth,
              'day-item--today': isToday(date),
              'day-item--selected': isSelected(date)
              }">
              <span class="day" @click="onDateClick(date)">{{ date.day }}</span>
            </div>
          </div>
        </div>
        <div class="x-datepicker-footer">
          <a href="#" class="x-datepicker-now-btn" @click.prevent="onNowBtnClick">{{ locale.now }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventListener from 'utils/event-listener'
import formaDate from 'filters/format-date'

export default {
  name: 'DatePicker2',

  props: {
    // 设置的日期值
    value: {
      type: Date
    },

    // 日期格式
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },

    // 是否显示时间选择
    showTime: {
      type: Boolean,
      default: false
    },

    // 日期选择的状态
    open: {
      type: Boolean,
      default: true
    },

    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },

    // 输入框的尺寸
    size: {
      type: String,
      default: '28px'
    },

    // 多语言配置
    locale: {
      type: Object,
      default () {
        return {
          now: '此刻',
          months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          weekdays: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
          shortWeekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          shorterWeekdays: ['日', '一', '二', '三', '四', '五', '六']
        }
      }
    }
  },

  data () {
    let now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      weekday: now.getDay(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
      selecting: false,
      selectedDate: null,
      dateStr: ''
    }
  },

  computed: {
    // 样式
    pickerStyle () {
      return {
        height: this.size
      }
    },

    // 当前是否闰年
    isLeapYear () {
      return this.year % 4 === 0 && ((this.year % 100 !== 0) || (this.year % 400 === 0))
    },

    // 上一月份
    prevMonth () {
      let month = this.month - 1
      if (month < 0) {
        month = 11
      }
      return month
    },

    // 下一月份
    nextMonth () {
      let month = this.month + 1
      if (month > 11) {
        month = 0
      }
      return month
    },

    // 当前月份天数
    currMonthLength () {
      return this._getMonthLength(this.month)
    },

    // 上一月份天数
    prevMonthLength () {
      return this._getMonthLength(this.prevMonth)
    },

    // 当前月份第一天星期几(0-6,0代表星期日)
    startWeekday () {
      let start = new Date(this.year, this.month, 1)
      return start.getDay()
    },

    // 日期列表
    dateList () {
      let prevYear = this.year
      let nextYear = this.year

      if (this.prevMonth === 11) {
        prevYear -= 1
      }

      if (this.nextMonth === 0) {
        nextYear += 1
      }

      const currDateList = this._generateDaysList(this.year, this.month, true)
      const prevDateList = this._generateDaysList(prevYear, this.prevMonth)
      const nextDateList = this._generateDaysList(nextYear, this.nextMonth)

      for (let i = this.prevMonthLength - 1; i > this.prevMonthLength - this.startWeekday - 1; i--) {
        currDateList.unshift(prevDateList[i])
      }

      for (let i = 0, len = 42 - currDateList.length; i < len; i++) {
        currDateList.push(nextDateList[i])
      }

      return currDateList
    }
  },

  ready () {
    this.$emit('created', this)
    this._closeEvent = EventListener.listen(window, 'click', (e) => {
      // 下拉选择器收起的条件：当前的点击不是选择日期并且点击的DOM不在组件里面
      if (!this.selecting && !this.$el.contains(e.target)) {
        this.open = false
      }
    })
  },

  beforeDestroy () {
    if (this._closeEvent) {
      this._closeEvent.remove()
    }
  },

  methods: {
    /**
     * 生成日期列表
     */
    _generateDaysList (year, month, inCurrentMonth = false) {
      let result = []
      const n = this._getMonthLength(month)

      for (let i = 1; i <= n; i++) {
        result.push({
          year: year,
          month: month,
          day: i,
          selected: false,
          selectable: true,
          inMonth: inCurrentMonth
        })
      }

      return result
    },

    /**
     * 获取某月份天数
     * @param  {Number} month 月份
     * @return {Number}
     */
    _getMonthLength (month) {
      let result = 28
      switch (month) {
        case 1:
          if (this.isLeapYear) {
            result = 29
          }
          break
        case 3:
        case 5:
        case 8:
        case 10:
          result = 30
          break
        default:
          result = 31
      }
      return result
    },

    /**
     * 判断是否当天
     * @param {Object} date 日期
     */
    isToday (date) {
      let now = new Date()
      return date.year === now.getFullYear() && date.month === now.getMonth() && date.day === now.getDate()
    },

    /**
     * 判断是否选中
     * @param {Object} date 日期
     */
    isSelected (date) {
      return this.selectedDate && date.year === this.selectedDate.year && date.month === this.selectedDate.month && date.day === this.selectedDate.day
    },

    /**
     * 处理上一年按钮点击
     */
    onPrevYearClick () {
      this.year -= 1
    },

    /**
     * 处理下一年按钮点击
     */
    onNextYearClick () {
      this.year += 1
    },

    /**
     * 处理上一月按钮点击
     */
    onPrevMonthClick () {
      let month = this.month - 1
      if (month < 0) {
        month = 11
        this.year -= 1
      }
      this.month = month
    },

    /**
     * 处理下一月按钮点击
     */
    onNextMonthClick () {
      let month = this.month + 1
      if (month > 11) {
        month = 0
        this.year += 1
      }
      this.month = month
    },

    /**
     * 处理日期点击
     * @param {Object} date 日期
     */
    onDateClick (date) {
      if (!date.selectable) return

      this.selecting = true
      this.year = date.year
      this.month = date.month
      this.day = date.day
      let dateObj = new Date(date.year, date.month, date.day)
      this.dateStr = formaDate(dateObj, 'yyyy-MM-dd', true)
      date.selected = true
      this.selectedDate = date
      this.$emit('date-select', date)
      setTimeout(() => {
        this.selecting = false
      }, 0)
    },

    /**
     * 处理今日按钮点击
     */
    onNowBtnClick () {
      let now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth()
      this.day = now.getDate()
      this.hour = now.getHours()()
      this.minute = now.getMinutes()()
      this.second = now.getSeconds()()
      setTimeout(() => {
        let date = _.find(this.dateList, this.isToday)
        this.onDateClick(date)
      }, 0)
    },

    onShowboxClick () {
      this.$emit('showbox-click')
      this.open = true
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

.x-datepicker {
  position: relative;
  display: inline-block;
  min-width: 120px;
  font-size: 12px;
  clearfix()

  .x-datepicker-value {
    position: relative;
    size: 196px 28px;
    line-height: 1.5;
    border: 1px solid default-border-color;
    box-sizing: border-box;
    padding: 4px 26px 4px 7px;

    .fa {
      absolute: right 7px top 7px;
      size: 12px;
      color: gray-light;
    }

    // 清除图标
    .x-datepicker-clear {

    }
  }

  .x-datepicker-showbox {
    font-size: 12px;
    height: 100%;
  }
}

.x-datepicker-panel {
  absolute: left top -4px;
  width: 218px;
  border: 1px solid default-border-color;
  font-size: 12px;
  background-color: #FFF;
  z-index: 1000;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .15);

  .x-datepicker-input-wrap {
    padding: 4px 7px;
    border-bottom: 1px solid light-border-color;
  }

  .x-datepicker-input {
    border: 0;
    display: block;
    padding: 0;
    size: 100% 26px;
    box-sizing: border-box;
  }

  .x-datepicker-header {
    position: relative;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid light-border-color;
    text-align: center;
    -webkit-user-select: none;
    user-select: none;

    .x-datepicker-prev-year-btn,
    .x-datepicker-prev-month-btn,
    .x-datepicker-next-month-btn,
    .x-datepicker-next-year-btn {
      absolute: top;
      padding: 0 5px;
      font-size: 14px;
      display: inline-block;
      line-height: 32px;
    }

    .x-datepicker-prev-year-btn {
      left: 7px;
    }

    .x-datepicker-next-year-btn {
      right: 7px;
    }

    .x-datepicker-prev-month-btn {
      left: 29px;
    }

    .x-datepicker-next-month-btn {
      right: 29px;
    }

    .x-datepicker-my-select {
      font-weight: bold;
    }
  }

  .x-datepicker-footer {
    height: 36px;
    line-height: 36px;
    border-top: 1px solid light-border-color;
  }

  .x-datepicker-body {
    height: 218px;
  }
}

.x-datepicker-weekdays {
  padding: 8px 0 0 8px;
  clearfix()

  .x-datepicker-weekday-item {
    float: left;
    size: 22px;
    line-height: 22px;
    padding-right: 8px;
    text-align: center;

    &:last-child {
      padding-right: 0;
    }
  }
}

.x-datepicker-days-list {
  padding: 0 0 8px 8px;
  clearfix()

  .day {
    display: inline-block;
    size: 100%;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
      background: lighten(red, 95%)
      color: red;
    }
  }

  .day-item {
    float: left;
    size: 22px;
    line-height: 22px;
    padding-right: 8px;
    margin-top: 8px;
    color: #CCC;

    &:nth-child(7n),
    &:last-child {
      padding-right: 0;
    }

    &.day-item--in-month {
      color: gray-darker;
    }

    &.day-item--today {
      .day {
        border: 1px solid red;
        color: red;
      }
    }

    &.day-item--selected {
      .day {
        background: red;
        color: #FFF;
      }
    }
  }
}
</style>
