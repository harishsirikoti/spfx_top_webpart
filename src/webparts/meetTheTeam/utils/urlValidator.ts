/**
 * Checks a navigation URL typed by an editor.
 * Allowed: https links, SharePoint-relative paths ("/sites/..."), and mailto links.
 * Everything else (http, javascript:, data:, "//host", malformed text) is rejected.
 */

const EMAIL_PATTERN: RegExp = /^[^\s@<>"',;:\\/]+@[^\s@<>"',;:\\/]+\.[^\s@<>"',;:\\/]+$/;
// Control characters and backslashes can be used to trick browsers, so we reject them.
// eslint-disable-next-line no-control-regex
const UNSAFE_CHARACTERS: RegExp = /[\u0000-\u001F\u007F\\]/;

/**
 * Returns the cleaned URL when it is safe, otherwise undefined.
 */
export function getSafeUrl(value: string | undefined): string | undefined {
  const url: string = (value ?? '').trim();
  if (!url || UNSAFE_CHARACTERS.test(url)) {
    return undefined;
  }

  // SharePoint-relative path: must start with ONE slash ("//" would point to another host).
  if (url.charAt(0) === '/') {
    return url.charAt(1) === '/' ? undefined : url;
  }

  // Email link: mailto:name@contoso.com or mailto:a@x.com?subject=Hello
  if (/^mailto:/i.test(url)) {
    try {
      const address: string = decodeURIComponent(url.substring(7).split('?')[0]);
      return EMAIL_PATTERN.test(address) ? url : undefined;
    } catch {
      return undefined; // bad percent-encoding
    }
  }

  // Absolute link: only https, no embedded user name or password.
  if (/^https:\/\//i.test(url)) {
    try {
      const parsed: URL = new URL(url);
      if (parsed.protocol === 'https:' && !parsed.username && !parsed.password && parsed.hostname) {
        return url;
      }
    } catch {
      return undefined;
    }
  }

  return undefined;
}

/** Property pane helper: returns an error message, or an empty string when the value is fine. */
export function validateUrlForPropertyPane(value: string, errorMessage: string): string {
  if (!value || !value.trim()) {
    return ''; // empty is allowed: the Team DL button is simply hidden
  }
  return getSafeUrl(value) ? '' : errorMessage;
}
