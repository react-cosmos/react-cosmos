export function registerPlaygroundShortcuts(
  runCommand: (command: string) => unknown
) {
  window.addEventListener('keydown', handleWindowKeyDown);

  function run(e: KeyboardEvent, command: string) {
    e.preventDefault();
    runCommand(command);
  }

  function handleWindowKeyDown(e: KeyboardEvent) {
    // Allow meta key shortcuts to work when focused on input fields
    if (isEditing() && !e.metaKey) {
      return;
    }

    const keyChar = String.fromCharCode(e.keyCode);
    const metaKey = e.metaKey || e.ctrlKey;

    if (keyChar === 'K' && metaKey) {
      run(e, 'searchFixtures');
    } else if (keyChar === 'L') {
      run(e, 'toggleFixtureList');
    } else if (keyChar === 'P') {
      run(e, 'toggleControlPanel');
    } else if (keyChar === 'F') {
      run(e, 'goFullScreen');
    } else if (keyChar === 'S') {
      run(e, 'openFixture');
    } else if (keyChar === 'R') {
      run(e, 'reloadRenderer');
    }
  }

  return () => {
    window.removeEventListener('keydown', handleWindowKeyDown);
  };
}

function isEditing() {
  const activeElement = document.activeElement;
  return activeElement && isInputTag(activeElement.tagName);
}

function isInputTag(tagName: string) {
  const inputTags = ['input', 'textarea', 'select'];
  return inputTags.includes(tagName.toLowerCase());
}
