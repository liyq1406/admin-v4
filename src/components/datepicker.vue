<template>
  <div class="datepicker">
    <div class="input-text-wrap">
      <input type="text" v-model="value" @click="inputClick" lazy class="input-text"/>
    </div>
    <div v-show="displayDayView" class="datepicker-popup">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <div class="datepicker-ctrl"><span @click="preNextMonthClick(0)" class="month-btn datepicker-prev-btn"><</span><span @click="preNextMonthClick(1)" class="month-btn datepicker-next-btn">></span>
            <p @click="switchMonthView">{{ stringifyDayHeader(currDate) }}</p>
          </div>
          <div class="datepicker-week-range"><span v-for="w in weekRange">{{ w }}</span></div>
          <div class="datepicker-date-range"><span v-for="d in dateRange" v-bind:class="d.sclass" @click="daySelect(d.date, this)">{{ d.text }}</span></div>
        </div>
      </div>
    </div>
    <div v-show="displayMonthView" class="datepicker-popup">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <div class="datepicker-ctrl"><span @click="preNextYearClick(0)" class="month-btn datepicker-prev-btn"><</span><span @click="preNextYearClick(1)" class="month-btn datepicker-next-btn">></span>
            <p @click="switchDecadeView">{{ stringifyYearHeader(currDate) }}</p>
          </div>
          <div class="datepicker-month-range">
            <template v-for="m in monthNames"><span v-bind:class="{'datepicker-date-range-item-active': this.monthNames[this.parse(this.value).getMonth()] === m && (this.currDate.getFullYear() === this.parse(this.value).getFullYear())}" @click="monthSelect($index)">{{ m.substr(0,3) }}</span></template>
          </div>
        </div>
      </div>
    </div>
    <div v-show="displayYearView" class="datepicker-popup">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <div class="datepicker-ctrl"><span @click="preNextDecadeClick(0)" class="month-btn datepicker-prev-btn"><</span><span @click="preNextDecadeClick(1)" class="month-btn datepicker-next-btn">></span>
            <p>{{ stringifyDecadeHeader(currDate) }}</p>
          </div>
          <div class="datepicker-month-range decade-range">
            <template v-for="decade in decadeRange"><span v-bind:class="{'datepicker-date-range-item-active': this.parse(this.value).getFullYear() === decade.text}" @click.stop="yearSelect(decade.text)">{{ decade.text }}</span></template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EventListener from './utils/EventListener'

  export default {
    props: {
      value: {
        type: String,
        twoWay: true
      },
      format: {
        default: 'yyyy-MM-dd'
      }
    },

    data () {
      return {
        weekRange: ['日', '一', '二', '三', '四', '五', '六'],
        dateRange: [],
        decadeRange: [],
        currDate: new Date(),
        displayDayView: false,
        displayMonthView: false,
        displayYearView: false,
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      }
    },

    watch: {
      currDate () {
        this.getDateRange()
      }
    },

    methods: {
      close () {
        this.displayDayView = this.displayMonthView = this.displayYearView = false
      },

      inputClick () {
        if (this.displayMonthView || this.displayYearView) {
          this.displayDayView = false
        } else {
          this.displayDayView = !this.displayDayView
        }
      },

      preNextDecadeClick(flag) {
        var year = this.currDate.getFullYear()
        var months = this.currDate.getMonth()
        var date = this.currDate.getDate()

        if (flag === 0) {
          this.currDate = new Date(year - 10, months, date)
        } else {
          this.currDate = new Date(year + 10, months, date)
        }
      },

      preNextMonthClick(flag) {
        var year = this.currDate.getFullYear()
        var month = this.currDate.getMonth()
        var date = this.currDate.getDate()

        if (flag === 0) {
          var preMonth = this.getYearMonth(year, month - 1)
          this.currDate = new Date(preMonth.year, preMonth.month, date)
        } else {
          var nextMonth = this.getYearMonth(year, month + 1)
          this.currDate = new Date(nextMonth.year, nextMonth.month, date)
        }
      },

      preNextYearClick(flag) {
        var year = this.currDate.getFullYear()
        var months = this.currDate.getMonth()
        var date = this.currDate.getDate()

        if (flag === 0) {
          this.currDate = new Date(year - 1, months, date)
        } else {
          this.currDate = new Date(year + 1, months, date)
        }
      },

      yearSelect(year) {
        this.displayYearView = false
        this.displayMonthView = true
        this.currDate = new Date(year, this.currDate.getMonth(), this.currDate.getDate())
      },

      monthSelect(index) {
        this.displayMonthView = false
        this.displayDayView = true
        this.currDate = new Date(this.currDate.getFullYear(), index, this.currDate.getDate())
      },

      daySelect(date, el) {
        this.currDate = date
        this.value = this.stringify(this.currDate)
        this.displayDayView = false
        this.$dispatch('select-day')
      },

      getYearMonth(year, month) {
        if (month > 11) {
          year++
          month = 0
        } else if (month < 0) {
          year--
          month = 11
        }
        return {year: year, month: month}
      },

      switchMonthView () {
        this.displayDayView = false
        this.displayMonthView = true
      },

      switchDecadeView () {
        this.displayMonthView = false
        this.displayYearView = true
      },

      // 格式化当前日期头部
      stringifyDayHeader (date) {
        return date.getFullYear() + '年 ' + this.monthNames[date.getMonth()]
      },

      stringifyYearHeader(date) {
        return date.getFullYear() + '年 '
      },

      stringifyDecadeHeader(date) {
        var yearStr = date.getFullYear().toString()
        var firstYearOfDecade = yearStr.substring(0, yearStr.length - 1) + 0
        var lastYearOfDecade = parseInt(firstYearOfDecade, 10) + 10
        return firstYearOfDecade + '-' + lastYearOfDecade
      },

      parseMonth(date) {
        return this.monthNames[date.getMonth()]
      },

      stringify(date) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var monthName = this.parseMonth(date)
        var format = this.format

        return format
          .replace(/yyyy/g, year)
          .replace(/MMMM/g, monthName)
          .replace(/MM/g, ('0' + month).slice(-2))
          .replace(/dd/g, ('0' + day).slice(-2))
          .replace(/yy/g, year)
          .replace(/M(?!a)/g, month)
          .replace(/d/g, day)
      },

      parse(str) {
        // var date = new Date(str)
        // return isNaN(date.getFullYear()) ? null : date
        return new Date(str)
      },

      getDayCount(year, month) {
        var dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (month === 1) {
          if ( (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0) ) {
            return 29
          }
          return 28
        }
        return dict[month]
      },

      getDateRange () {
        this.dateRange = []
        this.decadeRange = []

        var time = {
          year: this.currDate.getFullYear(),
          month: this.currDate.getMonth(),
          day: this.currDate.getDate()
        }
        var i

        var yearStr = time.year.toString()
        var firstYearOfDecade = (yearStr.substring(0, yearStr.length - 1) + 0) - 1
        for (i = 0; i < 12; i++) {
          this.decadeRange.push({
            text: firstYearOfDecade + i
          })
        }

        var currMonthFirstDay = new Date(time.year, time.month, 1)
        var firstDayWeek = currMonthFirstDay.getDay() + 1
        if (firstDayWeek === 0) {
          firstDayWeek = 7
        }
        var dayCount = this.getDayCount(time.year, time.month)
        if (firstDayWeek > 1) {
          var preMonth = this.getYearMonth(time.year, time.month - 1)
          var prevMonthDayCount = this.getDayCount(preMonth.year, preMonth.month)
          for (i = 1; i < firstDayWeek; i++) {
            var dayText = prevMonthDayCount - firstDayWeek + i + 1
            this.dateRange.push({
              text: dayText,
              date: new Date(preMonth.year, preMonth.month, dayText),
              sclass: 'datepicker-item-gray'
            })
          }
        }
        for (i = 1; i <= dayCount; i++) {
          var date = new Date(time.year, time.month, i)
          var week = date.getDay()
          var sclass = ''
          if (i === time.day) {
            if (this.value) {
              var valueDate = this.parse(this.value)
              if (valueDate) {
                if (valueDate.getFullYear() === time.year && valueDate.getMonth() === time.month) {
                  sclass = 'datepicker-date-range-item-active'
                }
              }
            }
          }
          this.dateRange.push({
            text: i,
            date: date,
            sclass: sclass
          })
        }
        if (this.dateRange.length < 42) {
          var nextMonthNeed = 42 - this.dateRange.length
          var nextMonth = this.getYearMonth(time.year, time.month + 1)
          for (i = 1; i <= nextMonthNeed; i++) {
            this.dateRange.push({
              text: i,
              date: new Date(nextMonth.year, nextMonth.month, i),
              sclass: 'datepicker-item-gray'
            })
          }
        }
      }
    },

    ready () {
      this.$dispatch('datepicker-created', this)
      this.currDate = this.parse(this.value) || this.parse(new Date())
      this._closeEvent = EventListener.listen(window, 'click', (e) => {
        if (!this.$el.contains(e.target)) {
          this.close()
        }
      })
    },

    beforeDestroy () {
      if (this._closeEvent){
        this._closeEvent.remove()
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .datepicker
    position relative

  .datepicker-popup
    position absolute
    border 1px solid #CCC
    background #FFF
    margin-top 2px
    z-index 1000
    box-shadow 0 6px 12px rgba(0, 0, 0, .2)

  .datepicker-inner
    width 218px

  .datepicker-body
    padding 10px

  .datepicker-ctrl p,
  .datepicker-ctrl span,
  .datepicker-body span
    display inline-block
    width 28px
    line-height 28px
    height 28px

  .datepicker-ctrl
    p
      width 65%
      margin 0

    span
      position absolute

  .datepicker-body span
    text-align center
    font-size 12px

  .datepicker-month-range span
    width 48px
    height 50px
    line-height 45px

  .decade-range span:first-child,
  .decade-range span:last-child,
  .datepicker-item-gray
    color #999

  .datepicker-date-range-item-active:hover,
  .datepicker-date-range-item-active
    background red !important
    color white !important

  .datepicker-month-range
    margin-top 10px

  .datepicker-month-range span,
  .datepicker-ctrl span,
  .datepicker-ctrl p,
  .datepicker-date-range span
    cursor pointer

  .datepicker-month-range span:hover,
  .datepicker-ctrl p:hover,
  .datepicker-ctrl span:hover,
  .datepicker-date-range span:hover,
  .datepicker-date-range-item-hover
    background-color #eee

  .datepicker-week-range span
    font-weight bold

  .datepicker-label
    background-color #f8f8f8
    font-weight 700
    padding 7px 0
    text-align center

  .datepicker-ctrl
    position relative
    height 30px
    line-height 30px
    font-weight bold
    text-align center

  .month-btn
    font-weight bold
    user-select none

  .datepicker-prev-btn
    left 2px

  .datepicker-next-btn
    right 2px

</style>
