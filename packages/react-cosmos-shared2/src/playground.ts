const KEY_CODES = {
  P: 80,
  K: 75
};

export function registerShortcuts(runCommand: (command: string) => unknown) {
  window.addEventListener('keydown', handleWindowKeyDown);

  function handleWindowKeyDown(e: KeyboardEvent) {
    if (isEditing()) {
      return;
    }

    const metaKey = e.metaKey || e.ctrlKey;

    if (e.keyCode === KEY_CODES['P'] && metaKey) {
      e.preventDefault();
      runCommand('searchFixtures');
    } else if (e.keyCode === KEY_CODES['K'] && metaKey && e.shiftKey) {
      e.preventDefault();
      runCommand('toggleControlPanel');
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
