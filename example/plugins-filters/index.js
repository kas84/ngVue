import angular from 'angular'
import { createApp, h } from 'vue'
import '../../src'
import '../../src/plugins'
import Tags from './tags.vue'
import HelloComponent from '../HelloComponent.vue'
const Vue = createApp()
console.log('HelloComponent', HelloComponent)
angular
  .module('vue.components', ['ngVue', 'ngVue.plugins'])
  .config(function ($ngVueProvider) {
    $ngVueProvider.filters.register(['uppercase'])
  })
  .filter('uppercase', function () {
    return string => string.toUpperCase()
  })
  .controller('MainController', function () {
    this.person = {
      firstName: 'The',
      lastName: 'World',
      description:
        'ngVue helps you use Vue components in your angular application ' +
        'so that you are able to create a faster and reactive web interfaces.'
    }
  })
  .value('TagsComponent', Tags)
  .value('HelloComponent', HelloComponent)
