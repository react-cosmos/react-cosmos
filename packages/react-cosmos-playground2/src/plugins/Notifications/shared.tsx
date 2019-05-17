import { PluginContext } from 'react-plugin';
import { NotificationsSpec } from './public';

export type Context = PluginContext<NotificationsSpec>;

export function getNotifications(context: Context) {
  const state = context.getState();
  return state !== null ? state.notifications : [];
}
