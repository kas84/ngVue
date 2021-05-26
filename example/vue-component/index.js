import angular from 'angular'
import '../../src/index.js'
import HelloComponent from '../HelloComponent.vue'
angular
  .module('vue.components', ['ngVue'])
  .controller('MainController', function () {
    this.person = {
      title: 'this is the title'
    }
    this.hello2 = {
      title: 'this is hello 2 title'
    }
    this.updateFirstName = firstName => {
      console.log('somebody updated firstname', firstName)
      this.person.title = firstName
    }
    this.updateHello2 = title => {
      console.log('title', title)
      this.hello2.title = title
    }
  })
  .value('HelloComponent', HelloComponent)
