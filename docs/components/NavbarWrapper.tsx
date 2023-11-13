import { Navbar } from 'nextra-theme-docs';
import { useFSRoute } from 'nextra/hooks';
import { Item, MenuItem, PageItem } from 'nextra/normalize-pages';

type NavBarProps = {
  flatDirectories: Item[];
  items: (PageItem | MenuItem)[];
};
export function NavbarWrapper(props: NavBarProps) {
  // NOTE: This is a placeholder wrapper in case I need to customize the navbar
  const route = useFSRoute();
  return <Navbar {...props} />;
}
