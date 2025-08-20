import StateModel from './stateModel.json' with { type:  'json'};

export default function() {
  return structuredClone(StateModel);
}