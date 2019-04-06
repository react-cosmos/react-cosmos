interface IExtendedNavigator extends Navigator {
  permissions: {
    query(descriptor: {
      name: 'clipboard-write';
    }): Promise<{
      state: 'granted' | 'denied' | 'prompt';
    }>;
  };
}

export async function copyToClipboard(text: string): Promise<void> {
  const { permissions, clipboard } = navigator as IExtendedNavigator;

  const { state } = await permissions.query({ name: 'clipboard-write' });
  if (state !== 'granted' && state !== 'prompt') {
    throw new Error('Permission denied to write to clipboard');
  }

  try {
    await clipboard.writeText(text);
  } catch (err) {
    throw new Error('Failed to write to clipboard');
  }
}
