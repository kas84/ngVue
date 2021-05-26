import { reactive } from 'vue'

export const state = {}
export function getState (id) {
  if (!state[id]) {
    state[id] = { props: reactive({}) }
  }
  return state[id]
}
