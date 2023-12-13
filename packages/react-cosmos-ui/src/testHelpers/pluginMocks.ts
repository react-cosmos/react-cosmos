import {
  getPluginContext,
  PluginEventHandlers,
  PluginMethodHandlers,
  PluginWithEvents,
  PluginWithMethods,
} from 'react-plugin';
import { CoreSpec } from '../plugins/Core/spec.js';
import { FixtureTreeSpec } from '../plugins/FixtureTree/spec.js';
import { MessageHandlerSpec } from '../plugins/MessageHandler/spec.js';
import { NotificationsSpec } from '../plugins/Notifications/spec.js';
import { RendererCoreSpec } from '../plugins/RendererCore/spec.js';
import { RendererPreviewSpec } from '../plugins/RendererPreview/spec.js';
import { RouterSpec } from '../plugins/Router/spec.js';
import { StorageSpec } from '../plugins/Storage/spec.js';
import { getMethodsOf, mockMethodsOf, on } from './pluginHelpers.js';

type MethodsOf<Spec extends PluginWithMethods> = Partial<
  PluginMethodHandlers<Spec>
>;
type EventsOf<Spec extends PluginWithEvents> = PluginEventHandlers<any, Spec>;

export function getRouterContext() {
  return getPluginContext<RouterSpec>('router');
}

export function getMessageHandlerContext() {
  return getPluginContext<MessageHandlerSpec>('messageHandler');
}

export function getRendererCoreContext() {
  return getPluginContext<RendererCoreSpec>('rendererCore');
}

export function getRouterMethods() {
  return getMethodsOf<RouterSpec>('router');
}

export function getMessageHandlerMethods() {
  return getMethodsOf<MessageHandlerSpec>('messageHandler');
}

export function getCoreMethods() {
  return getMethodsOf<CoreSpec>('core');
}

export function getRendererCoreMethods() {
  return getMethodsOf<RendererCoreSpec>('rendererCore');
}

export function getNotificationsMethods() {
  return getMethodsOf<NotificationsSpec>('notifications');
}

export function getRendererPreviewMethods() {
  return getMethodsOf<RendererPreviewSpec>('rendererPreview');
}

export function mockStorage(methods: MethodsOf<StorageSpec> = {}) {
  const allMethods = {
    loadCache: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
    ...methods,
  };
  mockMethodsOf<StorageSpec>('storage', allMethods);
  return allMethods;
}

export function mockRouter(methods: MethodsOf<RouterSpec> = {}) {
  const allMethods = {
    getSelectedFixtureId: jest.fn(),
    selectFixture: jest.fn(),
    unselectFixture: jest.fn(),
    ...methods,
  };
  mockMethodsOf<RouterSpec>('router', allMethods);
  return allMethods;
}

export function mockCore(methods: MethodsOf<CoreSpec> = {}) {
  const allMethods = {
    registerCommands: () => jest.fn(),
    runCommand: () => jest.fn(),
    getProjectId: jest.fn(),
    getFixtureFileVars: jest.fn(),
    isDevServerOn: jest.fn(),
    ...methods,
  };
  mockMethodsOf<CoreSpec>('core', allMethods);
  return allMethods;
}

export function mockMessageHandler(
  methods: MethodsOf<MessageHandlerSpec> = {}
) {
  const allMethods = {
    postRendererRequest: jest.fn(),
    ...methods,
  };
  mockMethodsOf<MessageHandlerSpec>('messageHandler', allMethods);
  return allMethods;
}

export function mockRendererCore(methods: MethodsOf<RendererCoreSpec> = {}) {
  const allMethods = {
    getRendererUrl: jest.fn(),
    getConnectedRendererIds: jest.fn(),
    getPrimaryRendererId: jest.fn(),
    getFixtures: jest.fn(),
    getFixtureState: jest.fn(),
    isRendererConnected: jest.fn(),
    reloadRenderer: jest.fn(),
    setFixtureState: jest.fn(),
    setGlobalFixtureState: jest.fn(),
    selectPrimaryRenderer: jest.fn(),
    receiveResponse: jest.fn(),
    ...methods,
  };
  mockMethodsOf<RendererCoreSpec>('rendererCore', allMethods);
  return allMethods;
}

export function mockRendererPreview(
  methods: MethodsOf<RendererPreviewSpec> = {}
) {
  const allMethods = {
    getUrlStatus: jest.fn(),
    getRuntimeStatus: jest.fn(),
    ...methods,
  };
  mockMethodsOf<RendererPreviewSpec>('rendererPreview', allMethods);
  return allMethods;
}

export function mockNotifications(methods: MethodsOf<NotificationsSpec> = {}) {
  const allMethods = {
    pushStickyNotification: jest.fn(),
    removeStickyNotification: jest.fn(),
    pushTimedNotification: jest.fn(),
    ...methods,
  };
  mockMethodsOf<NotificationsSpec>('notifications', allMethods);
  return allMethods;
}

export function mockFixtureTree(methods: MethodsOf<FixtureTreeSpec> = {}) {
  const allMethods = {
    revealFixture: jest.fn(),
    ...methods,
  };
  mockMethodsOf<FixtureTreeSpec>('fixtureTree', allMethods);
  return allMethods;
}

export function onRouter(events: EventsOf<RouterSpec> = {}) {
  const allEvents = {
    fixtureSelect: jest.fn(),
    fixtureReselect: jest.fn(),
    fixtureUnselect: jest.fn(),
    ...events,
  };
  on<RouterSpec>('router', allEvents);
  return allEvents;
}

export function onMessageHandler(events: EventsOf<MessageHandlerSpec> = {}) {
  const allEvents = {
    serverMessage: jest.fn(),
    rendererResponse: jest.fn(),
    ...events,
  };
  on<MessageHandlerSpec>('messageHandler', allEvents);
  return allEvents;
}

export function onRendererCore(events: EventsOf<RendererCoreSpec> = {}) {
  const allEvents = {
    request: jest.fn(),
    response: jest.fn(),
    ...events,
  };
  on<RendererCoreSpec>('rendererCore', allEvents);
  return allEvents;
}
