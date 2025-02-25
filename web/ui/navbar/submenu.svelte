<script lang="ts">
  import { tick } from 'svelte'

  import { generateMenuListeners, jumpInto } from '../../lib/hotkeys.js'

  let start = false
  let element: HTMLDivElement

  export async function focus(): Promise<void> {
    await tick()
    let children = element.querySelectorAll('a, button')
    for (let child of children) {
      child.setAttribute('tabindex', '0')
    }
    if (children[0]) {
      jumpInto(element)
      if (children.length > 1) {
        start = true
      }
    }
  }

  function onExit(): void {
    for (let child of element.querySelectorAll('a, button')) {
      child.setAttribute('tabindex', '-1')
    }
  }

  let [onKeyDown, onKeyUp] = generateMenuListeners({
    getItems() {
      return element.querySelectorAll('a, button')
    },
    select() {
      jumpInto(document.querySelector('main'))
    }
  })

  function onBlur(): void {
    start = false
    if (!element.contains(document.activeElement)) {
      onExit()
    }
  }
</script>

<div
  bind:this={element}
  class="navbar-submenu"
  class:is-start={start}
  role="menu"
  tabindex="-1"
  on:keyup={onKeyUp}
  on:keydown={onKeyDown}
  on:focusout={onBlur}
>
  <slot />
</div>

<style>
  .navbar-submenu {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .navbar-submenu.is-start::after {
    position: absolute;
    inset-inline-end: var(--padding-m);
    top: calc(var(--control-height) + 2px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: var(--control-height);
    font: var(--hotkey-font);
    color: var(--hotkey-color);
    content: '↓';
  }

  :global(.is-hotkey-disabled) .navbar-submenu.is-start::after {
    display: none;
  }
</style>
