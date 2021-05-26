import angular from 'angular'
import { createApp, render } from 'vue'
import { h } from 'vue'
import { getState } from '../state'
import getVueComponent from '../components/getVueComponent'
import getPropExprs from '../components/props/getExpressions'
import watchPropExprs from '../components/props/watchExpressions'
import evalValues from '../components/props/evaluateValues'
import evalPropEvents from '../components/props/evaluateEvents'
import evaluateDirectives from '../directives/evaluateDirectives'
import extractSpecialAttributes from '../components/props/extractSpecialAttributes'
import watchSpecialAttributes from '../components/props/watchSpecialAttributes'
import sha256 from 'crypto-js/sha256'
const Vue = createApp
const _h = h

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  if (!jqElement.parent().length) throw new Error('ngVue components must have a parent tag or they will not render')
  const e = jqElement[0]
  if (!e.id) {
    const hashDigest = sha256('' + e.offsetTop + e.offsetLeft + e.offsetHeight + e.offsetWidth)
    // console.log('hashDigest', hashDigest.toString())
    e.id = hashDigest.toString()
  }
  const $ngVue = $injector.has('$ngVue') ? $injector.get('$ngVue') : null

  const dataExprsMap = getPropExprs(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const directives = evaluateDirectives(elAttributes, scope) || []
  const reactiveData = {
    _v: {
      props: evalValues(dataExprsMap.props || dataExprsMap.data, scope) || {},
      attrs: evalValues(dataExprsMap.htmlAttributes, scope) || {},
      special: extractSpecialAttributes(elAttributes)
    }
  }
  const on = evalPropEvents(dataExprsMap, scope) || {}
  const inQuirkMode = $ngVue ? $ngVue.inQuirkMode() : false
  const rootProps = $ngVue ? $ngVue.getRootProps() : {}

  const mounted = rootProps.mounted
  const props = Object.assign({}, rootProps)
  props.mounted = function () {
    const element = jqElement[0]
    if (element.innerHTML.trim()) {
      let html
      if (element.children.length === 0) {
        const span = document.createElement('span')
        span.innerHTML = element.innerHTML.trim()
        html = span
      } else {
        html = element.children[0]
      }
      const slot = this.$refs.__slot__
      slot.parentNode.replaceChild(html, slot)
    }
    if (angular.isFunction(mounted)) {
      mounted.apply(this, arguments)
    }
  }

  const watchOptions = {
    depth: elAttributes.watchDepth,
    quirk: inQuirkMode
  }
  watchPropExprs(dataExprsMap, reactiveData, watchOptions, scope, 'props')
  watchPropExprs(dataExprsMap, reactiveData, watchOptions, scope, 'attrs')
  watchSpecialAttributes(reactiveData, jqElement, scope)
  const state = getState(e.id)
  state.props.value = reactiveData._v.props
  const rProps = state.props
  const newOn = {}
  for (let key in on) {
    newOn[key] = function ({ k, v }) {
      // rProps[k] = v
      on[key](v)
    }
  }
  // console.log('render props', rProps.value)
  let vueInstance = createApp({
    render () {
      return _h(Component, { ...rProps.value, ...on })
    }
  })

  vueInstance.mount(jqElement[0])

  scope.$on('$destroy', () => {
    vueInstance.$destroy()
    angular.element(vueInstance.$el).remove()
    vueInstance = null
  })
}
