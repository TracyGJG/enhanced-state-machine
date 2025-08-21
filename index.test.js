import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import StateModel from './stateModel.js';
import actions from './actions.js';

import StateMachine, { validateModel } from './StateMachine.js';

describe('StateMachine', () => {
  const PAYLOAD = { count: 0 };
  const { triggerEvent, revertState, getHistory } = StateMachine(
    StateModel(),
    actions,
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
      "Warning: The trigger 'again' could not be found for the current state of 'tac'."
    );
  });

  test('can provide the updated state (missing transition)', () => {
    const badGuard = triggerEvent('badGuard', PAYLOAD);
    assert.strictEqual(PAYLOAD.count, 8);
    assert.equal(getHistory()[0].state, 'tac');
    assert.equal(
      badGuard,
      "Warning: The trigger 'badGuard' did not match a transistion for the current state of 'tac'."
    );
  });
});

describe('validateModel', () => {
  let stateModel = null;

  beforeEach(() => {
    stateModel = StateModel();
  });

  test('returns an empty string when valid', () => {
    assert.equal(validateModel(stateModel, actions), '');
  });

  describe('initial state indicator', () => {
    test('returns an error when not defined', () => {
      delete stateModel['*'];
      assert.equal(
        validateModel(stateModel, actions),
        'Error: No initial state indicator (*) found.'
      );
    });

    test('returns an error when is invalid', () => {
      stateModel['*'] = '*';
      assert.equal(
        validateModel(stateModel, actions),
        'Error: An invalid initial state has been stipulated.'
      );
    });

    test('returns an error when not found', () => {
      stateModel['*'] = 'badState';
      assert.equal(
        validateModel(stateModel, actions),
        `Error: The initial state 'badState' cannot be found in the model.`
      );
    });
  });

  describe('target states', () => {
    test('returns an error when a trigger has an unknown state', () => {
      stateModel.init.next[0].state = 'invalid';
      assert.equal(
        validateModel(stateModel, actions),
        `Error: The 'next' trigger of the 'init' state has an invalid target state of 'invalid'.`
      );
    });

    test('returns an error when a trigger has an unknown action', () => {
      stateModel.init.next[0].guard = 'invalid';
      assert.equal(
        validateModel(stateModel, actions),
        `Error: The 'next' trigger of the 'init' state has an invalid target guard of 'invalid'.`
      );
    });
  });

  describe('Actions', () => {
    test('An error is reported for enter properties that are not functions', () => {
      const initEntry = actions.init.enter;
      actions.init.enter = 'invalid';
      assert.equal(
        validateModel(stateModel, actions),
        `Error: The enter property for 'init' is not a function.`
      );
      actions.init.enter = initEntry;
    });
    test('An error is reported for exit properties that are not functions', () => {
      const initExit = actions.init.exit;
      actions.init.exit = 'invalid';
      assert.equal(
        validateModel(stateModel, actions),
        `Error: The exit property for 'init' is not a function.`
      );
      actions.init.exit = initExit;
    });
    test('An error is reported for any guard properties that are not functions', () => {
      actions.init.guards = { invalid: 'invalid' };
      assert.equal(
        validateModel(stateModel, actions),
        `Error: The guard 'invalid' for 'init' is not a function.`
      );
      delete actions.init.guards;
    });
  });
});
