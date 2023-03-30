import { App } from "vue";

/**
 * 按钮波浪指令
 * @directive 默认方式：v-waves，如 `<div v-waves></div>`
 * @directive 参数方式：v-waves=" |light|red|orange|purple|green|teal"，如 `<div v-waves="'light'"></div>`
 */
export function wavesDirective(app : App) {
	app.directive('waves', {
		mounted(el, binding) {
			el.classList.add('waves-effect');
			binding.value && el.classList.add(`waves-${binding.value}`);

			
			el.addEventListener('mousedown', onCurrentClick.bind({el:el}), false);
		},
		unmounted(el) {
			el.removeEventListener('mousedown',onCurrentClick);
		},
	});
}
function onCurrentClick(this: any, e:any) {
  let elDiv = document.createElement('div');
  elDiv.classList.add('waves-ripple');
  this.el.appendChild(elDiv);
  let styles = {
    left: `${e.layerX}px`,
    top: `${e.layerY}px`,
    opacity: 1,
    transform: `scale(${(this.el.clientWidth / 100) * 10})`,
    'transition-duration': `750ms`,
    'transition-timing-function': `cubic-bezier(0.250, 0.460, 0.450, 0.940)`,
  };
  elDiv.setAttribute('style', setConvertStyle(styles));
  setTimeout(() => {
    elDiv.setAttribute(
      'style',
      setConvertStyle({
        opacity: 0,
        transform: styles.transform,
        left: styles.left,
        top: styles.top,
      })
    );
    setTimeout(() => {
      elDiv && this.el.removeChild(elDiv);
    }, 750);
  }, 450);
}

function setConvertStyle(obj:any) {
  let style = '';
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) style += `${i}:${obj[i]};`;
  }
  return style;
}