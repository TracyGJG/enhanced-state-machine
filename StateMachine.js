export default function StateMachine(stateModel, actions, payload = {}) {
  let _currentState = stateModel['*'];
  const _history = [];
  addToHistory(_currentState, payload);

  return {
    triggerEvent(_trigger, _payload) {
      const transitions = stateModel[_currentState][_trigger];
      if (!transitions)
        return `Warning: The trigger '${_trigger}' could not be found for the current state of '${_currentState}'.`;

      const nextState = transitions.find(
        ({ guard }) => !guard || actions[_currentState].guards[guard](_payload)
      )?.state;
      if (!nextState)
        return `Warning: The trigger '${_trigger}' did not match a transistion for the current state of '${_currentState}'.`;

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

export function validateModel(stateModel, actions) {
  if (!stateModel['*']) return `Error: No initial state indicator (*) found.`;

  const initialState = stateModel['*'];
  if (initialState === '*')
    return `Error: An invalid initial state has been stipulated.`;
  if (!stateModel[initialState])
    return `Error: The initial state '${initialState}' cannot be found in the model.`;

  const states = Object.keys(stateModel).filter((state) => state !== '*');
  let triggerError = null;
  let actionError = null;
  states.forEach((state) => {
    for (const triggers in stateModel[state]) {
      stateModel[state][triggers].forEach((trigger) => {
        if (!triggerError && !stateModel[trigger.state])
          triggerError = `Error: The '${triggers}' trigger of the '${state}' state has an invalid target state of '${trigger.state}'.`;
        if (
          !actionError &&
          trigger.guard &&
          !actions[state]?.guards?.[trigger.guard]
        ) {
          actionError = `Error: The '${triggers}' trigger of the '${state}' state has an invalid target guard of '${trigger.guard}'.`;
        }
      });
    }
  });
  if (triggerError) return triggerError;
  if (actionError) return actionError;

  for (const state in actions) {
    if (actions[state]?.enter && typeof actions[state].enter !== 'function')
      return `Error: The enter property for '${state}' is not a function.`;
    if (actions[state]?.exit && typeof actions[state].exit !== 'function')
      return `Error: The exit property for '${state}' is not a function.`;
    if (actions[state]?.guards) {
      for (const guard in actions[state].guards) {
        if (typeof actions[state].guards[guard] !== 'function')
          return `Error: The guard '${guard}' for '${state}' is not a function.`;
      }
    }
  }
  return '';
}
