import styles from './HomepageLogos.module.css';
import Formidable from './svg/logos/formidable.svg';
import GlobalCtoForum from './svg/logos/globalctoforum.svg';
import Hootsuite from './svg/logos/hootsuite.svg';
import StadiumGoods from './svg/logos/stadiumgoods.svg';

export function HomepageLogos() {
  return (
    <div className={styles.root}>
      <img src="/logos/radity.png" style={{ transform: 'scale(0.8)' }} />
      <Hootsuite />
      <Formidable style={{ transform: 'scale(0.95)' }} />
      <StadiumGoods />
      <GlobalCtoForum style={{ transform: 'scale(0.8)' }} />
    </div>
  );
}
