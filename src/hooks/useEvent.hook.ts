
export const useEvent = () => {
  let events = {}
  function on(evtName, callback) {
    const eventHandler = events[evtName];
    if (eventHandler) {
      events[evtName].push(callback);
    } else {
      events[evtName] = [callback];
    }
  }
  function off(evtName, callback) {
    const eventHandler = events[evtName];
    const index = eventHandler.indexOf(callback) 
    if (index != -1) {
      eventHandler.splice(index, 1)
    } else {
      new Error('无该绑定事件')
    }     
  } 
  function emit(evtName, ...args) {
    if (events[evtName]) {
      events[evtName].forEach((eventListener) => {
        eventListener(...args);
      });
    }
  }
  return {
    all: events,
    on,
    off,
    emit
  }
}


export interface UseEventType {
  all: {};
  on: (evtName: any, callback: any) => void;
  off: (evtName: any, callback: any) => void;
  emit: (evtName: any, ...args: any[]) => void
}