import {
  getPluginContext,
  PluginEventHandlers,
  PluginMethodHandlers,
  PluginWithEvents,
  PluginWithMethods,
} from 'react-plugin';
import { vi } from 'vitest';
import { CoreSpec } from '../plugins/Core/spec.js';
import { FixtureTreeSpec } from '../plugins/FixtureTree/spec.js';
import { MessageHandlerSpec } from '../plugins/MessageHandler/spec.js';
import { NotificationsSpec } from '../plugins/Notifications/spec.js';
import { RendererCoreSpec } from '../plugins/RendererCore/spec.js';
import { RendererPreviewSpec } from '../plugins/RendererPreview/spec.js';
import { RootSpec } from '../plugins/Root/spec.js';
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
    loadCache: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
    ...methods,
  };
  mockMethodsOf<StorageSpec>('storage', allMethods);
  return allMethods;
}

export function mockRouter(methods: MethodsOf<RouterSpec> = {}) {
  const allMethods = {
    getSelectedFixtureId: vi.fn(),
    selectFixture: vi.fn(),
    unselectFixture: vi.fn(),
    ...methods,
  };
  mockMethodsOf<RouterSpec>('router', allMethods);
  return allMethods;
}

export function mockCore(methods: MethodsOf<CoreSpec> = {}) {
  const allMethods = {
    registerCommands: () => vi.fn(),
    runCommand: () => vi.fn(),
    getProjectId: vi.fn(),
    getFixtureFileVars: vi.fn(),
    isDevServerOn: vi.fn(),
    ...methods,
  };
  mockMethodsOf<CoreSpec>('core', allMethods);
  return allMethods;
}

export function mockRoot(methods: MethodsOf<RootSpec> = {}) {
  const allMethods = {
    arePanelsLocked: vi.fn(),
    closeFixtureList: vi.fn(),
    ...methods,
  };
  mockMethodsOf<RootSpec>('root', allMethods);
  return allMethods;
}

export function mockMessageHandler(
  methods: MethodsOf<MessageHandlerSpec> = {}
) {
  const allMethods = {
    postRendererRequest: vi.fn(),
    ...methods,
  };
  mockMethodsOf<MessageHandlerSpec>('messageHandler', allMethods);
  return allMethods;
}

export function mockRendererCore(methods: MethodsOf<RendererCoreSpec> = {}) {
  const allMethods = {
    getRendererUrl: vi.fn(),
    getConnectedRendererIds: vi.fn(),
    getPrimaryRendererId: vi.fn(),
    getFixtures: vi.fn(),
    isRendererConnected: vi.fn(),
    reloadRenderer: vi.fn(),
    selectPrimaryRenderer: vi.fn(),
    receiveResponse: vi.fn(),
    getAllFixtureState: vi.fn(),
    getFixtureState: vi.fn(),
    setFixtureState: vi.fn(),
    setGlobalFixtureState: vi.fn(),
    ...methods,
  };
  mockMethodsOf<RendererCoreSpec>('rendererCore', allMethods);
  return allMethods;
}

export function mockRendererPreview(
  methods: MethodsOf<RendererPreviewSpec> = {}
) {
  const allMethods = {
    getUrlStatus: vi.fn(),
    getRuntimeStatus: vi.fn(),
    ...methods,
  };
  mockMethodsOf<RendererPreviewSpec>('rendererPreview', allMethods);
  return allMethods;
}

export function mockNotifications(methods: MethodsOf<NotificationsSpec> = {}) {
  const allMethods = {
    pushStickyNotification: vi.fn(),
    removeStickyNotification: vi.fn(),
    pushTimedNotification: vi.fn(),
    ...methods,
  };
  mockMethodsOf<NotificationsSpec>('notifications', allMethods);
  return allMethods;
}

export function mockFixtureTree(methods: MethodsOf<FixtureTreeSpec> = {}) {
  const allMethods = {
    revealFixture: vi.fn(),
    ...methods,
  };
  mockMethodsOf<FixtureTreeSpec>('fixtureTree', allMethods);
  return allMethods;
}

export function onRouter(events: EventsOf<RouterSpec> = {}) {
  const allEvents = {
    fixtureSelect: vi.fn(),
    fixtureReselect: vi.fn(),
    fixtureUnselect: vi.fn(),
    ...events,
  };
  on<RouterSpec>('router', allEvents);
  return allEvents;
}

export function onMessageHandler(events: EventsOf<MessageHandlerSpec> = {}) {
  const allEvents = {
    serverMessage: vi.fn(),
    rendererResponse: vi.fn(),
    ...events,
  };
  on<MessageHandlerSpec>('messageHandler', allEvents);
  return allEvents;
}

export function onRendererCore(events: EventsOf<RendererCoreSpec> = {}) {
  const allEvents = {
    request: vi.fn(),
    response: vi.fn(),
    ...events,
  };
  on<RendererCoreSpec>('rendererCore', allEvents);
  return allEvents;
}
