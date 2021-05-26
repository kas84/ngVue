import { reactive } from 'vue'

export const state = {
  props: reactive({})
}
export function getState (id) {
  if (!state[id]) {
    state[id] = { props: reactive({}) }
  }
  return state[id]
}
