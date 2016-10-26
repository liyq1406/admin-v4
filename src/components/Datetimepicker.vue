<template>
  <div class="x-date-time-selector" v-if="open">
    <div class="wrap year" v-if="yearShow">
      <ul>
        <li class="btn" @click.stop="yearPre"><i class="fa fa-angle-up"></i></li>
        <li v-for="item in years" :class="{ active : (year === item) }" @click.stop="chooseYear(item)">{{ item }}</li>
        <li class="btn" @click.stop="yearNext"><i class="fa fa-angle-down"></i></li>
      </ul>
    </div>
    <div class="wrap month" v-if="monthShow">
      <ul>
        <li class="btn" @click.stop="toggleToYear">{{ year }}年</li>
        <li v-for="item in months" :class="{ active: (month === $index + 1) }" @click.stop="chooseMonth($index + 1)">{{ item }}</li>
      </ul>
    </div>
    <div class="wrap date" v-if="dateShow">
      <ul>
        <li class="btn" @click.stop="toggleToMonth">{{ year }}年 {{ months[month - 1] }}</li>
        <li class="day">日</li>
        <li class="day">一</li>
        <li class="day">二</li>
        <li class="day">三</li>
        <li class="day">四</li>
        <li class="day">五</li>
        <li class="day">六</li>

        <li v-for="item in dates" :class="{ other: !item.thismonth, active: (date === item.date) && item.thismonth }" @click.stop="chooseDate(item.date, item.thismonth)">{{ item.date }}</li>
      </ul>
    </div>
    <div class="wrap time" v-if="timeShow">
      <ul>
        <li class="btn" @click.stop="toggleToDate">{{ year + '年 ' + month + '月' + date + '日' }}</li>
      </ul>
      <input @click.stop="" type="tel" placeholder="00" v-model="hour" maxlength="2"> : <input @click.stop="" type="tel" placeholder="00" v-model="min" maxlength="2">
      <div class="button" :class="{ able: isAble }" @click.stop="checkNow">确定</div>
    </div>
    <div style="clear:both;margin-bottom:10px"></div>
  </div>
</template>

<script>
import EventListener from 'utils/event-listener'

export default {
  name: 'timePicker',
  props: {
    microtime: {
      type: Number,
      default: 0
    },
    open: {
      type: Boolean,
      twoWay: true,
      default: false
    },
    value: {
      type: Date,
      default () {
        return new Date()
      }
    },
    showTime: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      yearShow: true,
      monthShow: false,
      dateShow: false,
      timeShow: false,
      year: 2016,
      month: 4,
      date: 3,
      hour: 0,
      min: 0,
      years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dates: [],
      rect: {}
    }
  },
  methods: {
    checkNow () {
      if (!this.isAble) return
      this.toggle()
      this.timeShow = false
      this.monthShow = false
      this.dateShow = false
      this.yearShow = true
      this.value = this.timestamp()
      this.microtime = this.value.getTime()
      this.$emit('timechange', this.microtime)
    },
    timestamp () {
      return new Date(this.year, this.month - 1, this.date, this.hour, this.min, 0)
    },
    format (val) {
      return (val.toString().length === 1) ? '0' + val : val
    },
    toggle () {
      this.open = !this.open
    },
    toggleToDate () {
      this.dateShow = true
      this.timeShow = false
    },
    toggleToMonth () {
      this.monthShow = true
      this.dateShow = false
    },
    toggleToYear () {
      this.yearShow = true
      this.monthShow = false
    },
    chooseYear (year) {
      this.year = year
      this.yearShow = false
      this.monthShow = true
    },
    chooseMonth (month) {
      this.month = month
      this.monthShow = false
      this.dateShow = true
    },
    chooseDate (date, thismonth) {
      if (!thismonth) return
      this.date = date
      this.dateShow = false
      if (this.showTime) {
        this.timeShow = true
      } else {
        this.checkNow()
      }
    },
    updateDate () {
      let thisyear = this.year
      let thismonth = this.month
      let countThisMonthDays = new Date(thisyear, thismonth, 0).getDate()
      let thisMonthFirstDay = new Date(thisyear, thismonth - 1, 0).getDay() + 1
      thisMonthFirstDay = (thisMonthFirstDay === 7) ? 0 : thisMonthFirstDay
      this.dates = []
      for (let i = 1; i <= countThisMonthDays; i++) {
        let thisDate = {
          date: i,
          thismonth: true
        }
        this.dates.push(thisDate)
      }
      this.dates.reverse()
      for (let i = 0; i < thisMonthFirstDay; i++) {
        let thisDate = {
          date: new Date(thisyear, thismonth - 1, 0).getDate() - i,
          thismonth: false
        }
        this.dates.push(thisDate)
      }
      this.dates.reverse()
    },
    yearPre () {
      this.years = this.years.map((val, index) => {
        return this.years[0] - 3 + index
      })
    },
    yearNext () {
      this.years = this.years.map((val, index) => {
        return this.years[0] + 3 + index
      })
    },
    resize () {
      var el = document.querySelector('.x-date-time-selector')
      this.rect.x = el.getBoundingClientRect().left + document.documentElement.scrollLeft
      if (this.rect.x + 300 > document.body.clientWidth) {
        el.style.left = 'auto'
        el.style.right = '0'
      }
    }
  },
  ready () {
    let date = this.value
    this.year = date.getFullYear()
    this.month = date.getMonth() + 1
    this.date = date.getDate()
    this.hour = date.getHours()
    this.min = date.getMinutes()
    let thisyear = this.year
    this.years = this.years.map((val, index) => {
      return thisyear - 4 + index
    })
    this.updateDate()
    this._closeEvent = EventListener.listen(window, 'click', (e) => {
      if (this.open && !this.$el.contains(e.target)) {
        this.checkNow()
        this.open = false
      }
      e.stopPropagation()
    })
  },
  beforeDestroy () {
    if (this._closeEvent) {
      this._closeEvent.remove()
    }
  },
  watch: {
    'value': function () {
      let date = this.value
      if (date instanceof Date) {
        this.year = date.getFullYear()
        this.month = date.getMonth() + 1
        this.date = date.getDate()
        this.hour = date.getHours()
        this.min = date.getMinutes()
        let thisyear = this.year
        this.years = this.years.map((val, index) => {
          return thisyear - 4 + index
        })
      }
    },
    'year': function () {
      this.updateDate()
    },
    'month': function () {
      this.updateDate()
    },
    'open': function () {
      if (this.open) {
        this.resize()
      }
    }
  },
  computed: {
    isAble () {
      return (this.year && this.month && this.date && !isNaN(this.hour) && this.hour < 24 && this.hour >= 0 && this.min < 60 && this.min >= 0 && !isNaN(this.min))
    }
  }
}
</script>

<style lang="stylus" scoped>
.x-date-time-selector {
  position: absolute;
  left: 50%;
  margin: 1px 0 0 -150px;
  width: 300px;
  background: #FFF;
  border: 1px solid #ddd;
  box-shadow: 0 3px 3px rgba(0, 0, 0, .1);
  border-radius: 3px;
  z-index: 999;

  .wrap {
    width: 100%;
    height: 100%;
    padding: 0 14px;
    box-sizing: border-box;

    ul {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      li {
        float: left;
        width: 90px;
        margin-top: 2px;
        list-style: none;
        text-align: center;
        cursor: pointer;
        display: block;
        border-radius: 2px;

        &:hover {
          background: rgba(0, 0, 0, .05)
        }

        &:active {
          background: rgba(0, 0, 0, .1)
        }
      }

      .btn {
        width: 100%;
        color: #727272;
        font-size: 15px;
        padding: 0
      }

      .day {
        cursor: default;

        &:hover {
          background: none
        }

        &:active {
          background: none
        }
      }


      .active {
        color: #FFF;
        background: #F45757;

        &:hover {
          background: #F45757;
        }

        &:active {
          background: #d44343;
        }
      }
    }
  }

  .date {
    padding: 0 9px;

    ul {
      li {
        width: 40px;
      }

      .other {
        color: #bbb;
        cursor: default;

        &:hover {
            background: none;
        }

        &:active {
            background: none;
        }
      }
    }
  }

  .time {
    color: #F45757;
    font-size: 16px;
    text-align: center;

    input {
      width: 60px;
      height: 40px;
      font-size: 24px;
      color: #F45757;
      text-align: center;
      border-left: 1px solid #fff;
      border-right: 1px solid #fff;
      border-top: 1px solid #fff;
      border-bottom: 2px solid #ddd;

      &:focus {
        border-bottom: 2px solid #F45757;
      }

      &::-webkit-input-placeholder {
        color: #ddd;
      }
    }

    .button {
      width: 100px;
      height: 32px;
      margin: 0 auto;
      margin-top: 10px;
      color: #aaa;
      font-size: 14px;
      line-height: 32px;
      background: #F6F6F6;
      border-radius: 3px;
      transition: all 200ms ease;
      text-align: center;
    }

    .able {
      color: #FFF;
      background: #F45757;
      cursor: pointer;

      &:active {
        background: #d44343;
      }
    }
  }

  /*&:before {
    position: relative;
    top: -6px;
    left: 50%;
    margin-left: -5px;
    content: "";
    width: 10px;
    height: 10px;
    border: 1px solid #ddd;
    border-right: none;
    border-bottom: none;
    background: #FFF;
    display: block;
    transform: rotate(45deg);
  }*/
}
</style>
