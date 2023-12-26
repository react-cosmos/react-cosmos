import { ReactNode } from 'react';
import styles from './Features.module.css';
import BoxSvg from './svg/icons/box.svg';
import CodeSvg from './svg/icons/code.svg';
import MonitorSvg from './svg/icons/monitor.svg';
import SlidersSvg from './svg/icons/sliders.svg';
import UploadCloudSvg from './svg/icons/upload-cloud.svg';
import ZapSvg from './svg/icons/zap.svg';

export function Features() {
  return (
    <ul className={styles.features}>
      <Feature
        title="Fixtures."
        description="File-system based module convention for defining component inputs effortlessly."
        icon={<CodeSvg />}
      />
      <Feature
        title="User Interface."
        description="User-friendly interface for browsing fixtures with responsive viewports."
        icon={<MonitorSvg />}
      />
      <Feature
        title="Control Panel."
        description="Component data manipulation through UI controls for props and state."
        icon={<SlidersSvg />}
      />
      <Feature
        title="Static Export."
        description="Interactive component library deployable to any static hosting service."
        icon={<UploadCloudSvg />}
      />
      <Feature
        title="Plugins."
        description="Full-stack plugin system for extending every aspect of React Cosmos."
        icon={<BoxSvg />}
      />
      <Feature
        title="High Quality."
        description="TypeScript. Minimal deps. Meticulously designed and tested for best DX."
        icon={<ZapSvg />}
      />
      {/* <Feature
        title="Integration."
        description="Vite, Webpack, React Native, Next.js, and support for integrating custom setups."
        icon={<SlidersSvg />}
      /> */}
    </ul>
  );
}

type FeatureProps = {
  title: string;
  description: string;
  icon: ReactNode;
};
function Feature({ title, description, icon }: FeatureProps) {
  return (
    <li>
      <strong>
        {icon} {title}
      </strong>{' '}
      {description}
    </li>
  );
}
