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

    const keyChar = String.fromCharCode(e.keyCode);
    const metaKey = e.metaKey || e.ctrlKey;

    if (keyChar === 'P' && metaKey) {
      run(e, 'searchFixtures');
    } else if (keyChar === 'L' && metaKey && e.shiftKey) {
      run(e, 'toggleFixtureList');
    } else if (keyChar === 'K' && metaKey && e.shiftKey) {
      run(e, 'toggleControlPanel');
    } else if (keyChar === 'F' && metaKey && e.shiftKey) {
      run(e, 'goFullScreen');
    } else if (keyChar === 'E' && metaKey && e.shiftKey) {
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
