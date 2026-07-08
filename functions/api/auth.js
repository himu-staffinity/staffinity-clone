export async function onRequest(context) {
  const { request, env, } = context;
  const client_id = env.GITHUB_CLIENT_ID;

  try {
    const url = new URL(request.url);
    const state = btoa(JSON.stringify({
      csrf: crypto.randomUUID(),
      repo: env.GITHUB_REPO,
    }));

    const redirectUrl = new URL('https://github.com/login/oauth/authorize');

    redirectUrl.searchParams.set('client_id', client_id);
    redirectUrl.searchParams.set('redirect_uri', url.origin + '/api/callback');
    redirectUrl.searchParams.set('scope', 'repo user');
    redirectUrl.searchParams.set('state', state);

    const cookieAttrs = `${url.protocol === "https:" ? "Secure; " : ""}SameSite=Lax; Path=/; Max-Age=600`;
    const escapedState = state.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    return new Response(
      `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body><script>
document.cookie = 'oauth_state=${escapedState}; ${cookieAttrs}';
window.location.href = '${redirectUrl.href.replace(/'/g, "\\'")}';
</script></body></html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(error.message, {
      status: 500,
    });
  }
}
