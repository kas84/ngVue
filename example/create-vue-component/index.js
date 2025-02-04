import angular from 'angular'
import { createApp, h } from 'vue'
import '../../src/index.js'
const Vue = createApp()
const _h = h
const VueComponent = Vue.component('hello-component', {
  props: {
    firstName: String,
    lastName: String,
    description: String
  },
  render () {
    return _h(
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">
            Hi, {this.firstName} {this.lastName}
          </span>
          <p>{this.description}</p>
        </div>
        <div class="card-action">
          <a href="https://vuejs.org/guide/overview.html">Vue.js</a>
        </div>
      </div>
    )
  }
})

angular
  .module('vue.components', ['ngVue'])
  .controller('MainController', function () {
    this.person = {
      title: 'this is the title',
      firstName: 'The',
      lastName: 'World',
      description:
        'ngVue helps you use Vue components in your angular application ' +
        'so that you are able to create a faster and reactive web interfaces.'
    }
  })
  .directive('helloComponent', function (createVueComponent) {
    return createVueComponent(VueComponent)
  })
