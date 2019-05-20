import {
  PluginSpec,
  MethodHandlers,
  EventHandlers,
  getPluginContext
} from 'react-plugin';
import { StorageSpec } from '../plugins/Storage/public';
import { RouterSpec } from '../plugins/Router/public';
import { CoreSpec } from '../plugins/Core/public';
import { MessageHandlerSpec } from '../plugins/MessageHandler/public';
import { RendererCoreSpec } from '../plugins/RendererCore/public';
import { NotificationsSpec } from '../plugins/Notifications/public';
import { getMethodsOf, mockMethodsOf, on } from './plugin';

type MethodsOf<Spec extends PluginSpec> = Partial<MethodHandlers<Spec>>;
type EventsOf<Spec extends PluginSpec> = EventHandlers<any, Spec>;

export function getMessageHandlerContext() {
  return getPluginContext<MessageHandlerSpec>('messageHandler');
}

export function getRendererCoreContext() {
  return getPluginContext<RendererCoreSpec>('rendererCore');
}

export function getMessageHandlerMethods() {
  return getMethodsOf<MessageHandlerSpec>('messageHandler');
}

export function mockStorage(methods: MethodsOf<StorageSpec>) {
  mockMethodsOf<StorageSpec>('storage', methods);
}

export function mockRouter(methods: MethodsOf<RouterSpec>) {
  mockMethodsOf<RouterSpec>('router', methods);
}

export function mockCore(methods: MethodsOf<CoreSpec>) {
  mockMethodsOf<CoreSpec>('core', methods);
}

export function mockMessageHandler(methods: MethodsOf<MessageHandlerSpec>) {
  mockMethodsOf<MessageHandlerSpec>('messageHandler', methods);
}

export function mockRendererCore(methods: MethodsOf<RendererCoreSpec>) {
  mockMethodsOf<RendererCoreSpec>('rendererCore', methods);
}

export function mockNotifications(methods: MethodsOf<NotificationsSpec>) {
  mockMethodsOf<NotificationsSpec>('notifications', methods);
}

export function onMessageHandler(events: EventsOf<MessageHandlerSpec>) {
  on<MessageHandlerSpec>('messageHandler', events);
}
