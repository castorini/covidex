/* Routes */
export const HOME_ROUTE = "/";

/* Breakpoints */
export const SMALL_MOBILE_BREAKPOINT = 425;
export const LARGE_MOBILE_BREAKPOINT = 600;
export const TABLET_BREAKPOINT = 800;

/* Styles */
export const CONTENT_WIDTH = 1200;

/* API */
export const API_BASE = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ?
    'http://597d65df.ngrok.io/' : '/';
export const SEARCH_ENDPOINT = 'search';
