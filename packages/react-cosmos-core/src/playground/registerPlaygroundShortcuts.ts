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
    if (isEditing(e) && !e.metaKey) {
      return;
    }

    const keyChar = String.fromCharCode(e.keyCode);
    const metaKey = e.metaKey || e.ctrlKey;

    if (metaKey) {
      if (keyChar === 'K') {
        run(e, 'searchFixtures');
      }
    } else {
      if (keyChar === 'L') {
        run(e, 'toggleNavPanel');
      } else if (keyChar === 'P') {
        run(e, 'toggleControlPanel');
      } else if (keyChar === 'F') {
        run(e, 'goFullScreen');
      } else if (keyChar === 'S') {
        // FIXME: This core code is coupled with the open-fixture-source plugin
        // We can decouple it by adding support for registering shortcuts from
        // within plugins. This would require a way to serialize shortcuts, which
        // isn't trivial but is on the roadmap.
        run(e, 'openFixture');
      } else if (keyChar === 'R') {
        run(e, 'reloadRenderer');
      }
    }
  }

  return () => {
    window.removeEventListener('keydown', handleWindowKeyDown);
  };
}

function isEditing(e: KeyboardEvent) {
  if (e.target instanceof HTMLElement && e.target.isContentEditable) {
    return true;
  }

  const activeElement = document.activeElement;
  return activeElement && isInputTag(activeElement.tagName);
}

function isInputTag(tagName: string) {
  const inputTags = ['input', 'textarea', 'select'];
  return inputTags.includes(tagName.toLowerCase());
}
