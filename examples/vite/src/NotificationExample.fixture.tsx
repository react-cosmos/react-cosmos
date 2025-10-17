import React from 'react';
import { useCosmosNotification } from 'react-cosmos/client';

export default function NotificationExample() {
  const notification = useCosmosNotification();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSuccess = () => {
    notification.pushTimedNotification({
      type: 'success',
      title: 'Success!',
      info: 'This is a success notification from a fixture',
    });
  };

  const handleError = () => {
    notification.pushTimedNotification({
      type: 'error',
      title: 'Error occurred',
      info: 'This is an error notification from a fixture',
    });
  };

  const handleInfo = () => {
    notification.pushTimedNotification({
      type: 'info',
      title: 'Information',
      info: 'This is an info notification from a fixture',
    });
  };

  const handleAsyncOperation = async () => {
    setIsLoading(true);
    notification.pushStickyNotification({
      id: 'async-operation',
      type: 'loading',
      title: 'Processing...',
      info: 'Simulating an async operation',
    });

    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 3000));

      notification.removeStickyNotification('async-operation');
      notification.pushTimedNotification({
        type: 'success',
        title: 'Operation completed!',
        info: 'The async operation finished successfully',
      });
    } catch (error) {
      notification.pushStickyNotification({
        id: 'async-operation',
        type: 'error',
        title: 'Operation failed',
        info: 'Something went wrong during the operation',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cosmos Notification Hook Example</h2>
      <p>Click the buttons to trigger different notification types:</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={handleSuccess}>Success Notification</button>
        <button onClick={handleError}>Error Notification</button>
        <button onClick={handleInfo}>Info Notification</button>
        <button onClick={handleAsyncOperation} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Async Operation'}
        </button>
      </div>
    </div>
  );
}
