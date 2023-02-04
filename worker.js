/**
 * @param evt {MessageEvent<{task: string, input: string}>}
 */
onmessage = async (evt) => {
  /**
   * @type {{default: import("./solution.ts").default}} */
  try {
    const module = await import(`./dist/${evt.data.task}.js`);
    const sol = module.default;
    sol.filename = evt.data.task;
    sol.reader = () => evt.data.input;
    sol.reporter = (name, result, _expect, time) => {
      postMessage({
        success: true,
        name,
        result,
        time,
      });
    };
    sol.execute();
  } catch (error) {
    postMessage({
      success: false,
      error,
    });
  }
};
