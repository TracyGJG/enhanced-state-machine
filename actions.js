export default function () {
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
      },
    },
    toe: {
      enter: (payload) => {
        payload.count += 1;
        console.log(`toe::entered: "${JSON.stringify(payload)}"`);
      },
      exit: (payload) => `toe::exited: "${JSON.stringify(payload)}"`,
    },
  };

  function isValidateActions() {
    //   const invalidAction = Object.values(ACTIONS).find(({enter, exit, guards}) => {
    //     if (enter && (typeof entry != "function")
    //   });

    //   if (invalidAction) {
    //     console.error(`${invalidAction[0]} has an invalid function.`);
    //   }

    return true;
  }

  return isValidateActions() ? ACTIONS : {};
}
