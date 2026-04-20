export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

import { ROUTES } from "@shared/constants";

// Admin login path is local and password-based (no third-party OAuth portal).
export const getLoginUrl = () => ROUTES.ADMIN_LOGIN;
