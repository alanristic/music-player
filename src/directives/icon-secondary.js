export default {
  beforeMount(el, binding) {
    // Binding.value allows us to pass a value to the directive via template
    let iconClass = `fa fa-${binding.value.icon} text-green-400 text-2xl`

    // Modfiers are either True or False (we cant't pass values)
    if (binding.value.right) {
      iconClass += ' float-right'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
