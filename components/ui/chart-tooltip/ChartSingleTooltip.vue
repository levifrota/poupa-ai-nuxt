<script setup lang="ts">
import type { BulletLegendItemInterface } from '@unovis/ts'
import { omit } from '@unovis/ts'
import { VisTooltip } from '@unovis/vue'
import { type Component, createApp } from 'vue'
import { ChartTooltip } from '.'

const props = defineProps<{
  selector: string
  index: string
  items?: BulletLegendItemInterface[]
  valueFormatter?: (tick: number, i?: number, ticks?: number[]) => string
  customTooltip?: Component
}>()

// Use weakmap to store reference to each datapoint for Tooltip
const wm = new WeakMap()
function template(d: object, i: number, elements: (HTMLElement | SVGElement)[]) {
  const valueFormatter = props.valueFormatter ?? ((tick: number) => `${tick}`)
  if (props.index in d) {
    if (wm.has(d)) {
      return wm.get(d)
    }
    else {
      console.log('data: ', d);
      console.log('props', d[props.index]);

      const componentDiv = document.createElement('div')
      // const omittedData = Object.entries(omit(d, [props.index])).map(([key, value]) => {
      //   const legendReference = props.items?.find(i => i.name === key)
      //   return { ...legendReference, value: valueFormatter(value) }
      // })
      // console.log('title: ', d[props.index] )

      // // Se não houver dados omitidos mas tivermos items, use-os diretamente
      // if (omittedData.length === 0 && props.items?.length) {
      //   const TooltipComponent = props.customTooltip ?? ChartTooltip
      //   return createApp(TooltipComponent, { title: d[props.index].toString(), data: function() {
      //     return props.items;
      //     } }).mount(componentDiv).innerHTML
      // }
      const TooltipComponent = props.customTooltip ?? ChartTooltip
      createApp(TooltipComponent, { title: (d as any).data?.type, data: function() {
        return d.data.value;
      } }).mount(componentDiv)
      wm.set(d, componentDiv.innerHTML)
      return componentDiv.innerHTML
    }
  }

  else {
    const data = d.data

    if (wm.has(data)) {
      return wm.get(data)
    }
    else {
      const style = getComputedStyle(elements[i])
      const omittedData = [{ name: data.name, value: valueFormatter(data[props.index]), color: style.fill }]
      const componentDiv = document.createElement('div')
      const TooltipComponent = props.customTooltip ?? ChartTooltip
      createApp(TooltipComponent, { title: d[props.index].toString(), data: omittedData }).mount(componentDiv)
      wm.set(d, componentDiv.innerHTML)
      return componentDiv.innerHTML
    }
  }
}
</script>

<template>
  <VisTooltip
    :horizontal-shift="20"
    :vertical-shift="20"
    :triggers="{
      [selector]: template,
    }"
  />
</template>
