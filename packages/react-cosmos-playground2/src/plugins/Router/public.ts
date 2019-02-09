export type UrlParams = {
  fixturePath?: string;
  fullScreen?: boolean;
};

export type RouterSpec = {
  name: 'router';
  state: {
    urlParams: UrlParams;
  };
  methods: {
    getUrlParams(): UrlParams;
    setUrlParams(urlParams: UrlParams): void;
  };
  events: {
    fixtureChange(fixturePath: null | string): void;
  };
};
