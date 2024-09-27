// import _ from 'lodash' // we want to perform naminng in 'pascaleCase' so we'll use lodash
// import { camelCase } from 'lodash/camelCase'
// import { upperFirst } from 'lodash/upperFirst'
import { camelCase, upperFirst } from 'lodash'

export default {
  install(app) {
    // Search for all components in the base folder by pattern
    const baseComponents = import.meta.glob('../components/base/*.vue', {
      eager: true // This will load all components at immedietly (instead of lazy loading)
    })

    Object.entries(baseComponents).forEach(([path, component]) => {
      // Get the name of the component right
      const componentName = upperFirst(camelCase(path.split('/').pop().replace('.vue', '')))

      // console.log(path, componentName)

      // Register the component globally (they are accessible via GLOBAL namestace...ie 'export default')
      // We'll use 'Base' prefix to avoid naming conflicts
      app.component(`Base${componentName}`, component.default)
    })
  }
}
