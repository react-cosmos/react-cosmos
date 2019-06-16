import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    --quick: 0.32s;
    --font-family: -apple-system, BlinkMacSystemFont, Ubuntu, 'Helvetica Neue', Helvetica, sans-serif;
    --hue-primary: 230;
    --hue-accent: 328;
    --hue-success: 120;
    --hue-warning: 48;
    --hue-error: 358;
    --darkest: hsl(var(--hue-primary), 23%, 11%);
    --primary1: hsl(var(--hue-primary), 52%, 22%);
    --primary2: hsl(var(--hue-primary), 54%, 32%);
    --primary3: hsl(var(--hue-primary), 51%, 43%);
    --primary4: hsl(var(--hue-primary), 65%, 63%);
    --primary5: hsl(var(--hue-primary), 69%, 76%);
    --primary6: hsl(var(--hue-primary), 72%, 90%);
    --primary7: hsl(var(--hue-primary), 88%, 97%);
    --grey1: hsl(var(--hue-primary), 21%, 16%);
    --grey2: hsl(var(--hue-primary), 17%, 30%);
    --grey3: hsl(var(--hue-primary), 12%, 49%);
    --grey4: hsl(var(--hue-primary), 25%, 74%);
    --grey5: hsl(var(--hue-primary), 32%, 85%);
    --grey6: hsl(var(--hue-primary), 25%, 91%);
    --grey7: hsl(var(--hue-primary), 17%, 98%);
    --accent1: hsl(var(--hue-accent), 52%, 22%);
    --accent2: hsl(var(--hue-accent), 54%, 32%);
    --accent3: hsl(var(--hue-accent), 51%, 43%);
    --accent4: hsl(var(--hue-accent), 65%, 63%);
    --accent5: hsl(var(--hue-accent), 69%, 76%);
    --accent6: hsl(var(--hue-accent), 72%, 90%);
    --accent7: hsl(var(--hue-accent), 88%, 97%);
    --success1: hsl(var(--hue-success), 52%, 22%);
    --success2: hsl(var(--hue-success), 54%, 32%);
    --success3: hsl(var(--hue-success), 51%, 43%);
    --success4: hsl(var(--hue-success), 60%, 55%);
    --success5: hsl(var(--hue-success), 69%, 70%);
    --success6: hsl(var(--hue-success), 72%, 90%);
    --success7: hsl(var(--hue-success), 88%, 97%);
    --warning1: hsl(var(--hue-warning), 52%, 22%);
    --warning2: hsl(var(--hue-warning), 58%, 32%);
    --warning3: hsl(var(--hue-warning), 76%, 43%);
    --warning4: hsl(var(--hue-warning), 82%, 63%);
    --warning5: hsl(var(--hue-warning), 80%, 76%);
    --warning6: hsl(var(--hue-warning), 85%, 90%);
    --warning7: hsl(var(--hue-warning), 88%, 97%);
    --error1: hsl(var(--hue-error), 52%, 22%);
    --error2: hsl(var(--hue-error), 54%, 32%);
    --error3: hsl(var(--hue-error), 54%, 45%);
    --error4: hsl(var(--hue-error), 72%, 63%);
    --error5: hsl(var(--hue-error), 74%, 78%);
    --error6: hsl(var(--hue-error), 85%, 90%);
    --error7: hsl(var(--hue-error), 88%, 97%);
    font-family: var(--font-family);
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  body, p, ul, ol, li, h1, h2, h3, button, input, textarea, select {
    margin: 0;
    padding: 0;
  }

  input, textarea {
    font-family: var(--font-family);
  }

  input, textarea, button {
    font-size: 14px;
  }

  a {}
`;
