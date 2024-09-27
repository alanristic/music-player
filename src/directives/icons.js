export default {
  beforeMount(el, binding) {
    // Binding.value allows us to pass a value to the directive via template
    let iconClass = `fa fa-${binding.value} text-2xl`

    if (binding.arg === 'full') {
      iconClass = binding.value
    }

    // Modfiers are either True or False (we cant't pass values)
    if (binding.modifiers.right) {
      iconClass += ' float-right'
    }

    if (binding.modifiers.yellow) {
      iconClass += ' text-yellow-400'
    } else {
      iconClass += ' text-green-400'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
