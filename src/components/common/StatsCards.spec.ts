import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsCards from './StatsCards.vue'

describe('StatsCards.vue', () => {
  it('renders loading state when loading prop is true', () => {
    const wrapper = mount(StatsCards, {
      props: {
        stats: [],
        loading: true
      }
    })
    expect(wrapper.find('.mdi-loading').exists()).toBe(true)
  })

  it('renders stats items correctly', () => {
    const stats = [
      { label: 'Total Shipments', value: 120 },
      { label: 'Active Orders', value: '45' }
    ]
    const wrapper = mount(StatsCards, {
      props: {
        stats,
        loading: false
      }
    })
    
    const cards = wrapper.findAll('.stat-card')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('Total Shipments')
    expect(cards[0].text()).toContain('120')
    expect(cards[1].text()).toContain('Active Orders')
    expect(cards[1].text()).toContain('45')
  })

  it('emits click event when a stat card is clicked', async () => {
    const stats = [{ label: 'Total Shipments', value: 120 }]
    const wrapper = mount(StatsCards, {
      props: {
        stats,
        loading: false
      }
    })
    
    await wrapper.find('.stat-card').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0][0]).toEqual(stats[0])
  })
})
