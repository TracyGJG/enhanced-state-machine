import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import StateModel from './stateModel.js';
import Actions from './actions.js';

import StateMachine from './StateMachine.js';

describe('StateMachine', () => {
  const PAYLOAD = { count: 0 };
  const { triggerEvent, revertState, getHistory } = StateMachine(
    StateModel(),
    Actions,
    PAYLOAD
  );

  test('can provide the two methods and accessor to the History', () => {
    assert.equal(typeof triggerEvent, 'function');
    assert.equal(typeof revertState, 'function');
    assert.equal(typeof getHistory, 'function');

    const history = getHistory();
    assert.equal(history.length, 1);
    assert.deepStrictEqual(history[0], {
      payload: '{"count":0}',
      state: 'init',
    });
  });

  test('can provide the updated state', () => {
    triggerEvent('next', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 1);
    assert.equal(getHistory()[0].state, 'tic');

    triggerEvent('next', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 2);
    assert.equal(getHistory()[0].state, 'tac');

    triggerEvent('back', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 3);
    assert.equal(getHistory()[0].state, 'tic');

    triggerEvent('again', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 4);
    assert.equal(getHistory()[0].state, 'tic');

    triggerEvent('next', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 5);
    assert.equal(getHistory()[0].state, 'tac');

    triggerEvent('back', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 6);
    assert.equal(getHistory()[0].state, 'init');

    triggerEvent('next', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 7);
    assert.equal(getHistory()[0].state, 'tic');

    triggerEvent('next', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 8);
    assert.equal(getHistory()[0].state, 'tac');

    triggerEvent('next', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 9);
    assert.equal(getHistory()[0].state, 'toe');
  });

  test('can provide the updated state (reverted)', () => {
    console.log('Revert');
    revertState(PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 8);
    assert.equal(getHistory()[0].state, 'tac');
  });

  test('can provide the updated state (bad trigger)', () => {
    const badTrigger = triggerEvent('again', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 8);
    assert.equal(getHistory()[0].state, 'tac');
    assert.equal(
      badTrigger,
      "Error: The trigger 'again' could not be found for the current state of 'tac'."
    );
  });

  test('can provide the updated state (missing transition)', () => {
    const badGuard = triggerEvent('badGuard', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 8);
    assert.equal(getHistory()[0].state, 'tac');
    assert.equal(
      badGuard,
      "Error: The trigger 'badGuard' did not match a transistion for the current state of 'tac'."
    );
  });
});

//      validationModel(StateModel, Actions)
