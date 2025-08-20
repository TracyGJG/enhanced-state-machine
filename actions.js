const ACTIONS = {
  init: {
    enter: (payload) => {
      payload.count += 1;
      console.log(`init::entered: "${JSON.stringify(payload)}"`);
    },
  },
  tic: {
    enter: (payload) => {
      payload.count += 1;
      console.log(`tic::entered: "${JSON.stringify(payload)}"`);
    },
    exit: (payload) => `tic::exited: "${JSON.stringify(payload)}"`,
  },
  tac: {
    enter: (payload) => {
      payload.count += 1;
      console.log(`tac::entered: "${JSON.stringify(payload)}"`);
    },
    exit: (payload) => `tac::exited: "${JSON.stringify(payload)}"`,
    guards: {
      tac_back_even: (payload) => !(payload.count % 2),
      tac_back_odd: (payload) => !!(payload.count % 2),
      tac_bad_guard: (_payload) => false,
    },
  },
  toe: {
    enter: (payload) => {
      payload.count += 1;
      console.log(`toe::entered: "${JSON.stringify(payload)}"`);
    },
  },
};

export default ACTIONS;
