import { Preset } from 'unocss'

export const myPreset: Preset = {
  name: 'my-preset',
  rules: [
    [/^gc-(\d+)-([\.\d]+)$/, ([_, num, num2]) => ({ "grid-template-columns": `repeat(${num}, minmax(0, 1fr)) ${num2}px` })],
  ],
  variants: [

  ],
  shortcuts: [
    [/^grid-c-(\d+)-(\d+)-(\d+)$/, match => `grid gc-${match[1]}-${match[2]} grid-gap-${match[3]}px grid-items-center`],
    [/^grid-c-(\d+)-(\d+)$/, match => `grid grid-cols-${match[1]} grid-gap-${match[2]}px grid-items-center`],
  ]
}

