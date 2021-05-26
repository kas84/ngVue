import { isString, isArray, isObject } from 'angular'
import { createApp, h, reactive } from 'vue'
import { getState } from '../../state'
const Vue = createApp
function watch (expressions, reactiveData, type, id) {
  return watchFunc => {
    // for `v-props` / `v-data`
    console.log('watching')
    if (isString(expressions)) {
      const state = getState(id)
      state.props.value = reactiveData._v.props
      watchFunc(expressions, state.props.value)
    }

    // for `v-props-something`
    // Object.keys(expressions).forEach(name => {
    //   watchFunc(expressions[name], Vue.set.bind(Vue, reactiveData._v[type], name))
    // })
  }
}

/**
 * @param setter Function a reactive setter from VueJS
 * @param inQuirkMode boolean a quirk mode will fix the change detection issue
 *                            caused by the limitation of the reactivity system
 * @returns Function a watch callback when the expression value is changed
 */
function notify (setter, inQuirkMode, id) {
  return function (newVal) {
    let value = newVal
    console.log('notifying')
    if (inQuirkMode) {
      // `Vue.set` uses a shallow comparision to detect the change in the setters, and so
      // for an object and an array, we have to create a new one to force the reactivity
      // system to walk through all the properties to detect the change and to convert the
      // new values into a reactive data.
      value = isArray(newVal) ? [...newVal] : isObject(newVal) ? { ...newVal } : newVal
    }
    const state = getState(id)
    state.props.value = {
      ...newVal
    }
  }
}

/**
 *
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param reactiveData Object
 * @param reactiveData._v Object
 * @param options Object
 * @param options.depth 'reference'|'value'|'collection'
 * @param options.quirk 'reference'|'value'|'collection'
 * @param scope Object
 * @param type String 'props'|'attrs'
 */
export default function watchExpressions (dataExprsMap, reactiveData, options, scope, type) {
  let expressions
  if (type === 'props') {
    expressions = dataExprsMap.props ? dataExprsMap.props : dataExprsMap.data
  } else if (type === 'attrs') {
    expressions = dataExprsMap.htmlAttributes
  }

  if (!expressions) {
    return
  }

  const { depth, quirk } = options
  const id = dataExprsMap && dataExprsMap.htmlAttributes && dataExprsMap.htmlAttributes.id
  const watcher = watch(expressions, reactiveData, type, id)

  switch (depth) {
    case 'value':
      watcher((expression, setter) => {
        console.log('watcher....')
        scope.$watch(expression, notify(setter, quirk, id), true)
      })
      break
    case 'collection':
      watcher((expression, setter) => {
        scope.$watchCollection(expression, notify(setter, quirk, id))
      })
      break
    case 'reference':
    default:
      watcher((expression, setter) => {
        scope.$watch(expression, notify(setter, quirk, id))
      })
  }
}
