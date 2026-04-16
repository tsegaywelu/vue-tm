<template>
  <div
    class="bg-white rounded-[2rem] p-6 select-none shadow-2xl min-w-[320px] transition-all duration-300"
    @click.stop
  >
    <!-- Calendar Type Toggle (Optional) -->
    <div v-if="showCalenderType" class="flex justify-between items-center mb-6">
      <div class="flex bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          @click="$emit('calendar-type-change', 'ethiopian')"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :class="calendarType === 'ethiopian' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'"
        >
          Ethiopian
        </button>
        <button
          type="button"
          @click="$emit('calendar-type-change', 'english')"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :class="calendarType === 'english' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'"
        >
          Gregorian
        </button>
      </div>
    </div>

    <!-- Header: Month/Year navigation -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex text-base gap-2 items-center">
        <span
          class="font-semibold cursor-pointer hover:text-primary transition-colors"
          @click="toggleMonthPicker"
        >
          {{ currentMonthName }}
        </span>
        <span
          class="font-semibold cursor-pointer hover:text-primary transition-colors"
          @click="toggleYearPicker"
        >
          {{ viewDate.year }}
        </span>
      </div>
      <div class="flex items-center gap-4">
        <button
          type="button"
          @click="handlePrevMonth"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <div class="size-5" v-html="icons.leftAngle"></div>
        </button>
        <button
          type="button"
          @click="handleNextMonth"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <div class="size-5 rotate-180" v-html="icons.leftAngle"></div>
        </button>
      </div>
    </div>

    <!-- View Content -->
    <div class="relative overflow-hidden min-h-[280px]">
      <Transition name="fade" mode="out-in">
        <!-- Year Picker -->
        <div v-if="isYearPickerOpen" key="year-picker" class="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto p-2 scrollbar-hide">
          <div
            v-for="year in yearsList"
            :key="year"
            @click="selectYear(year)"
            class="p-2 text-center rounded-lg cursor-pointer transition-colors"
            :class="viewDate.year === year ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'"
          >
            {{ year }}
          </div>
        </div>

        <!-- Month Picker -->
        <div v-else-if="isMonthPickerOpen" key="month-picker" class="grid grid-cols-3 gap-2 p-2 focus:outline-none">
          <div
            v-for="(month, idx) in monthNames"
            :key="month"
            @click="selectMonth(idx + 1)"
            class="p-3 text-center rounded-xl cursor-pointer transition-colors text-sm font-medium"
            :class="viewDate.month === (idx + 1) ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'"
          >
            {{ month }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div v-else key="calendar-grid">
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in WEEK_DAYS"
              :key="day"
              class="uppercase text-center text-[10px] font-bold text-gray-400 aspect-square grid place-items-center"
            >
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7">
            <div
              v-for="(day, idx) in calendarDays"
              :key="idx"
              @click="handleDateClick(day)"
              class="aspect-square flex items-center justify-center text-sm transition-all relative"
              :class="getDayClasses(day)"
            >
              <span v-if="day">{{ day }}</span>
              <div
                v-if="day && isCurrentToday(day)"
                class="absolute bottom-1.5 w-1 h-1 rounded-full"
                :class="isDateSelected(day) ? 'bg-white' : 'bg-primary'"
              ></div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  toEthiopian,
  toGregorian,
  AMHARIC_MONTHS,
  ENGLISH_MONTHS,
  WEEK_DAYS,
  isEthiopianLeap,
  formatEthiopianDate,
  parseEthiopianDate
} from '@/utils/ethiopianCalendar'
import { icons } from '@/utils/icons'

interface Props {
  isRange?: boolean
  calendarType?: 'english' | 'ethiopian'
  value?: string | { start: string; end: string | null } | null
  showCalenderType?: boolean
  outputCalendarType?: 'english' | 'ethiopian'
}

const props = withDefaults(defineProps<Props>(), {
  isRange: false,
  calendarType: 'english',
  value: null,
  showCalenderType: false,
  outputCalendarType: 'english'
})

const emit = defineEmits(['select', 'calendar-type-change'])

const now = new Date()
const ethNow = toEthiopian(now)

const viewDate = ref(() => {
  if (props.calendarType === 'ethiopian') {
    return { year: ethNow.year, month: ethNow.month }
  }
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
})()

const isYearPickerOpen = ref(false)
const isMonthPickerOpen = ref(false)

const selectedDate = ref<Date | null>(null)
const rangeStart = ref<Date | null>(null)
const rangeEnd = ref<Date | null>(null)

// --- Lifecycle & Watchers ---

const initializeFromValue = () => {
  let dateToView = new Date()

  const parseStr = (str: string) => {
    if (props.outputCalendarType === 'ethiopian') {
      const parsed = parseEthiopianDate(str)
      if (parsed) return toGregorian(parsed.year, parsed.month, parsed.day)
    }
    const d = new Date(str)
    return isNaN(d.getTime()) ? null : d
  }

  if (props.value) {
    if (typeof props.value === 'string') {
      const d = parseStr(props.value)
      if (d) {
        selectedDate.value = d
        dateToView = d
      }
    } else if (typeof props.value === 'object' && 'start' in props.value) {
      const start = props.value.start ? parseStr(props.value.start) : null
      const end = props.value.end ? parseStr(props.value.end) : null
      rangeStart.value = start
      rangeEnd.value = end
      if (start) dateToView = start
    }
  }

  if (props.calendarType === 'ethiopian') {
    const eth = toEthiopian(dateToView)
    viewDate.value = { year: eth.year, month: eth.month }
  } else {
    viewDate.value = { year: dateToView.getFullYear(), month: dateToView.getMonth() + 1 }
  }
}

watch(() => props.value, initializeFromValue, { immediate: true })
watch(() => props.calendarType, initializeFromValue)

// --- Computed Properties ---

const monthNames = computed(() => (props.calendarType === 'ethiopian' ? AMHARIC_MONTHS : ENGLISH_MONTHS))
const currentMonthName = computed(() => monthNames.value[viewDate.value.month - 1])

const yearsList = computed(() => {
  const currentYear = viewDate.value.year
  const list = []
  for (let i = currentYear - 50; i <= currentYear + 50; i++) {
    list.push(i)
  }
  return list
})

const daysInMonth = computed(() => {
  if (props.calendarType === 'ethiopian') {
    if (viewDate.value.month === 13) {
      return isEthiopianLeap(viewDate.value.year) ? 6 : 5
    }
    return 30
  }
  return new Date(Date.UTC(viewDate.value.year, viewDate.value.month, 0)).getUTCDate()
})

const startDayOfWeek = computed(() => {
  let firstDay: Date
  if (props.calendarType === 'ethiopian') {
    firstDay = toGregorian(viewDate.value.year, viewDate.value.month, 1)
  } else {
    firstDay = new Date(Date.UTC(viewDate.value.year, viewDate.value.month - 1, 1))
  }
  return firstDay.getUTCDay()
})

const calendarDays = computed(() => {
  const days = []
  for (let i = 0; i < startDayOfWeek.value; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth.value; i++) {
    days.push(i)
  }
  return days
})

// --- Methods ---

const formatOutput = (date: Date) => {
  if (props.outputCalendarType === 'ethiopian') {
    const eth = toEthiopian(date)
    return formatEthiopianDate(eth.year, eth.month, eth.day)
  }
  // Standard internal ISO for storage/filtering
  return date.toISOString().split('T')[0]
}

const handlePrevMonth = () => {
  let newMonth = viewDate.value.month - 1
  let newYear = viewDate.value.year
  const maxMonths = props.calendarType === 'ethiopian' ? 13 : 12
  if (newMonth < 1) {
    newMonth = maxMonths
    newYear -= 1
  }
  viewDate.value = { year: newYear, month: newMonth }
}

const handleNextMonth = () => {
  let newMonth = viewDate.value.month + 1
  let newYear = viewDate.value.year
  const maxMonths = props.calendarType === 'ethiopian' ? 13 : 12
  if (newMonth > maxMonths) {
    newMonth = 1
    newYear += 1
  }
  viewDate.value = { year: newYear, month: newMonth }
}

const handleDateClick = (day: number | null) => {
  if (!day) return
  let clickedDate: Date
  if (props.calendarType === 'ethiopian') {
    clickedDate = toGregorian(viewDate.value.year, viewDate.value.month, day)
  } else {
    clickedDate = new Date(Date.UTC(viewDate.value.year, viewDate.value.month - 1, day))
  }

  if (props.isRange) {
    if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
      rangeStart.value = clickedDate
      rangeEnd.value = null
      emit('select', { start: formatOutput(clickedDate), end: null })
    } else {
      if (clickedDate < rangeStart.value) {
        rangeEnd.value = rangeStart.value
        rangeStart.value = clickedDate
        emit('select', { start: formatOutput(clickedDate), end: formatOutput(rangeEnd.value!) })
      } else {
        rangeEnd.value = clickedDate
        emit('select', { start: formatOutput(rangeStart.value), end: formatOutput(clickedDate) })
      }
    }
  } else {
    selectedDate.value = clickedDate
    emit('select', formatOutput(clickedDate))
  }
}

const isCurrentToday = (day: number) => {
  let d: Date
  if (props.calendarType === 'ethiopian') {
    d = toGregorian(viewDate.value.year, viewDate.value.month, day)
  } else {
    d = new Date(Date.UTC(viewDate.value.year, viewDate.value.month - 1, day))
  }
  const today = new Date()
  return (
    d.getUTCDate() === today.getUTCDate() &&
    d.getUTCMonth() === today.getUTCMonth() &&
    d.getUTCFullYear() === today.getUTCFullYear()
  )
}

const isDateSelected = (day: number) => {
  if (!day) return false
  let d: Date
  if (props.calendarType === 'ethiopian') {
    d = toGregorian(viewDate.value.year, viewDate.value.month, day)
  } else {
    d = new Date(Date.UTC(viewDate.value.year, viewDate.value.month - 1, day))
  }
  const time = d.getTime()
  if (props.isRange) {
    return time === rangeStart.value?.getTime() || time === rangeEnd.value?.getTime()
  }
  return time === selectedDate.value?.getTime()
}

const getDayClasses = (day: number | null) => {
  if (!day) return 'pointer-events-none opacity-0'
  let d: Date
  if (props.calendarType === 'ethiopian') {
    d = toGregorian(viewDate.value.year, viewDate.value.month, day)
  } else {
    d = new Date(Date.UTC(viewDate.value.year, viewDate.value.month - 1, day))
  }

  const time = d.getTime()
  const isSelected = isDateSelected(day)

  const classes = ['cursor-pointer']

  if (isSelected) {
    classes.push('bg-primary text-white shadow-lg z-10')
  }

  if (props.isRange) {
    const start = rangeStart.value?.getTime()
    const end = rangeEnd.value?.getTime()
    const isStart = time === start
    const isEnd = time === end
    const inRange = start && end && time > start && time < end

    if (isStart) classes.push('rounded-l-2xl')
    if (isEnd) classes.push('rounded-r-2xl')
    if (inRange) classes.push('bg-primary/10 text-primary font-medium')
    if (!isStart && !isEnd && isSelected) classes.push('rounded-2xl')
    if (!props.isRange && isSelected) classes.push('rounded-2xl')
  } else {
    if (isSelected) classes.push('rounded-2xl')
  }

  if (!isSelected && day) classes.push('hover:bg-gray-100 rounded-2xl text-gray-700')

  return classes.join(' ')
}

const toggleMonthPicker = () => {
  isMonthPickerOpen.value = !isMonthPickerOpen.value
  isYearPickerOpen.value = false
}

const toggleYearPicker = () => {
  isYearPickerOpen.value = !isYearPickerOpen.value
  isMonthPickerOpen.value = false
}

const selectYear = (year: number) => {
  viewDate.value.year = year
  isYearPickerOpen.value = false
}

const selectMonth = (month: number) => {
  viewDate.value.month = month
  isMonthPickerOpen.value = false
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
