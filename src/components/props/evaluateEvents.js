import angular from 'angular'

/**
 * @param dataExprsMap Object
 * @param dataExprsMap.events Object|null
 * @param scope Object
 * @returns {Object|null}
 */
export default function evaluateEvents (dataExprsMap, scope) {
  const events = dataExprsMap.events

  if (!events || !angular.isObject(events)) {
    return null
  }

  const evaluatedEvents = {}
  Object.keys(events).forEach(eventName => {
    const vueEventName = 'on' + eventName[0].toUpperCase() + eventName.slice(1)
    evaluatedEvents[vueEventName] = scope.$eval(events[eventName])
    const fn = evaluatedEvents[vueEventName]
    if (!angular.isFunction(fn)) {
      return
    }
    evaluatedEvents[vueEventName] = function () {
      return scope.$evalAsync(() => fn.apply(null, arguments))
    }
  })

  return evaluatedEvents
}
