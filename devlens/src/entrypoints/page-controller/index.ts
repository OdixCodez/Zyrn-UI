import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script';
import { installPageController } from '../../content/controller';

export default defineUnlistedScript(() => {
  installPageController();
});
