export default function StateMachine(stateModel, actions, payload = {}) {
  let _currentState = stateModel['*'];
  const _history = [];
  addToHistory(_currentState, payload);

  return {
    triggerEvent(_trigger, _payload) {
      const transitions = stateModel[_currentState][_trigger];
      if (!transitions) return _payload;

      const nextState = transitions.find(
        ({ guard }) => !guard || actions[_currentState].guards[guard](_payload)
      )?.state;
      if (!nextState) return _payload;

      actions[_currentState].exit?.(_payload);
      _currentState = nextState;

      actions[_currentState].enter?.(_payload);
      addToHistory(_currentState, _payload);
    },
    revertState: (payload) => {
      _history.shift();
      _currentState = _history[0].state;
      payload.count = JSON.parse(_history[0].payload).count;
      return JSON.stringify(_history[0]);
    },
    getHistory: () => structuredClone(_history),
  };

  function addToHistory(state, payload) {
    _history.unshift({
      state,
      payload: JSON.stringify(payload),
    });
  }
}
