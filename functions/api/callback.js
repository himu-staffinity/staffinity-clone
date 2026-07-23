const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_API_URL = "https://api.github.com";

const GITHUB_API_HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  "User-Agent": "decap-cms-cloudfare",
});

function extractCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}

async function checkRepoAccess(token, repo) {
  const repoRes = await fetch(`${GITHUB_API_URL}/repos/${repo}`, {
    headers: GITHUB_API_HEADERS(token),
  });
  if (!repoRes.ok) {
    const body = await repoRes.text();
    return { allowed: false, reason: `GitHub /repos/${repo} failed (${repoRes.status}): ${body.slice(0, 200)}` };
  }
  const repoData = await repoRes.json();
  const perms = repoData.permissions;
  const hasPush = perms?.push === true;
  return {
    allowed: hasPush,
    reason: hasPush ? `user has push access` : `permissions: ${JSON.stringify(perms)}`,
  };
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = extractCookie(request.headers.get("Cookie"), "oauth_state");

  if (!state || state !== cookieState) {
    return new Response("Invalid state parameter — possible CSRF attack", { status: 403 });
  }

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  let targetRepo;
  try {
    const stateData = JSON.parse(atob(state));
    targetRepo = stateData.repo;
  } catch {
    return new Response("Invalid state format", { status: 400 });
  }

  if (!targetRepo) {
    return new Response("GITHUB_REPO not configured in OAuth state", { status: 500 });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response("OAuth credentials not configured", { status: 500 });
  }

  const baseUrl = env.BASE_URL;
  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (tokenData.error) {
    return new Response(`OAuth error: ${tokenData.error_description || tokenData.error}`, { status: 400 });
  }

  const accessToken = tokenData.access_token;

  const { allowed, reason } = await checkRepoAccess(accessToken, targetRepo);
  if (!allowed) {
    return new Response(
      `Access denied: You are not authorized for this repository.\n\nReason: ${reason}\nRepo: ${targetRepo}`,
      { status: 403, headers: { "Content-Type": "text/plain" } },
    );
  }

  const escapedToken = accessToken.replace(/"/g, '\\"');

  return new Response(
    `<!DOCTYPE html>
<html><head><title>Authenticating...</title><meta charset="utf-8" /></head>
<body><script>
(function() {
  var token = "${escapedToken}";
  var baseUrl = "${baseUrl}";

  function sendSuccess() {
    window.opener.postMessage(
      'authorization:github:success:' + JSON.stringify({ token: token }),
      "*"
    );
    window.close();
    setTimeout(function() {
      document.body.innerHTML = "<p style='text-align:center;font-family:sans-serif;padding-top:2rem'>Authentication complete. You can close this window.</p>";
    }, 1000);
  }

  if (window.opener && window.opener !== window) {
    window.opener.postMessage('authorizing:github', "*");

    var handshakeTimeout = setTimeout(function() {
      sendSuccess();
    }, 3000);

    window.addEventListener('message', function handler(e) {
      if (e.data === 'authorizing:github') {
        window.removeEventListener('message', handler);
        clearTimeout(handshakeTimeout);
        sendSuccess();
      }
    });
  } else {
    window.location.href = baseUrl + "/admin/";
  }
})();
</script></body></html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Set-Cookie": `decap_cms_token=${accessToken}; ${url.protocol === "https:" ? "Secure; " : ""}SameSite=Lax; Path=/; Max-Age=86400`,
      },
    },
  );
}
