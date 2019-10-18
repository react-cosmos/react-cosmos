const KEY_CODES = {
  E: 69,
  F: 70,
  K: 75,
  L: 76,
  P: 80
};

export function registerShortcuts(runCommand: (command: string) => unknown) {
  window.addEventListener('keydown', handleWindowKeyDown);

  function run(e: KeyboardEvent, command: string) {
    e.preventDefault();
    runCommand(command);
  }

  function handleWindowKeyDown(e: KeyboardEvent) {
    if (isEditing()) {
      return;
    }

    const metaKey = e.metaKey || e.ctrlKey;

    if (e.keyCode === KEY_CODES['P'] && metaKey) {
      run(e, 'searchFixtures');
    } else if (e.keyCode === KEY_CODES['L'] && metaKey && e.shiftKey) {
      run(e, 'toggleFixtureList');
    } else if (e.keyCode === KEY_CODES['K'] && metaKey && e.shiftKey) {
      run(e, 'toggleControlPanel');
    } else if (e.keyCode === KEY_CODES['F'] && metaKey && e.shiftKey) {
      run(e, 'goFullScreen');
    } else if (e.keyCode === KEY_CODES['E'] && metaKey && e.shiftKey) {
      run(e, 'editFixture');
    }
  }

  return () => {
    window.removeEventListener('keydown', handleWindowKeyDown);
  };
}

function isEditing() {
  const tags = ['input', 'textarea', 'select'];
  const activeElement = document.activeElement;
  return activeElement && tags.includes(activeElement.tagName.toLowerCase());
}
