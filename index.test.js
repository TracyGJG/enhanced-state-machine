import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import stateModel from './stateModel.json' with { type:  'json'};
import actions from './actions.js';

import StateMachine from './index.js';

describe('StateMachine', () => {
  const { triggerEvent, revertState, getHistory } = StateMachine(stateModel, actions);

  test('can provide the two methods and accessor to the History', () => {
    assert.equal(typeof triggerEvent, 'function');
    assert.equal(typeof revertState, 'function');
    assert.equal(typeof getHistory, 'function');
    assert.deepStrictEqual(getHistory(), []);
  });

  // test('can provide the updated state', () => {
  //   assert.equal(currentState(), 'initial');
  //   const result = triggerEvent('next', 'next from initial to tic');
  //   assert.equal(result, 'tic: "next from initial to tic"');
  //   assert.equal(currentState(), 'tic');

  //   triggerEvent('again', 'again from tic to tic');
  //   assert.equal(currentState(), 'tic');

  //   triggerEvent('next', 'next from tic to tac');
  //   assert.equal(currentState(), 'tac');

  //   triggerEvent('back', 'back from tac to tic');
  //   assert.equal(currentState(), 'tic');

  //   triggerEvent('next', 'next from tic to tac');
  //   assert.equal(currentState(), 'tac');

  //   triggerEvent('next', 'next from tac to toe');
  //   assert.equal(currentState(), 'toe');
  // });
});
