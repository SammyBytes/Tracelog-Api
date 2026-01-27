export const retrievePlaygroundHtml = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Tracelog | Auth Test</title>
        <style>
            body { font-family: system-ui; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #fafafa; margin: 0; }
            .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; width: 350px; }
            button { background: #24292e; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%; transition: opacity 0.2s; margin-top: 10px; }
            button:disabled { opacity: 0.5; cursor: not-allowed; }
            pre { background: #eee; padding: 10px; border-radius: 4px; overflow-x: auto; text-align: left; font-size: 0.8rem; max-height: 200px; }
            .status { font-size: 0.8rem; margin-bottom: 1rem; color: #666; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Tracelog API</h1>
            <p id="status" class="status">Checking session...</p>
            
            <div id="auth-section" style="display: none;">
                <button id="login-btn">Log in with GitHub</button>
            </div>

            <button id="generate-key-btn">Generate API Key</button>
            <p id="api-key" style="display: none;"></p>
            <p id="api-key-error" style="display: none; color: red;"></p>
            <br>
            <br>

            
            <div id="user-section" style="display: none;">
                <p>Welcome, <b id="user-name"></b></p>
                <pre id="user-data"></pre>
                <button id="logout-btn" style="background: #d32f2f;">Log out</button>
            </div>
        </div>

        <script type="module">
            // Importamos el cliente directamente usando ESM
            import { createAuthClient } from "https://esm.sh/better-auth/client";

            const authClient = createAuthClient({
                baseURL: window.location.origin + "/api/auth"
            });

            const statusText = document.getElementById('status');
            const loginBtn = document.getElementById('login-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const authSection = document.getElementById('auth-section');
            const userSection = document.getElementById('user-section');
            const generateKeyBtn = document.getElementById('generate-key-btn');
            const apiKey = document.getElementById('api-key');
            const apiKeyError = document.getElementById('api-key-error');

           generateKeyBtn.addEventListener('click', async () => {
    generateKeyBtn.disabled = true;
    generateKeyBtn.textContent = "Generating...";
    
    try {
        const response = await fetch('/api/accounts/generate-api-key', {
            method: 'POST',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            apiKey.innerHTML = '<strong>Your Key:</strong> <code style="background: #ffffcc; padding: 2px 5px;">' + result.apiKey + '</code>';
            apiKey.style.display = 'block';
            apiKeyError.style.display = 'none';
        } else {
            throw new Error(result.error || 'Failed to generate key');
        }
    } catch (err) {
        apiKeyError.textContent = err.message;
        apiKeyError.style.display = 'block';
        apiKey.style.display = 'none';
    } finally {
        generateKeyBtn.disabled = false;
        generateKeyBtn.textContent = "Generate API Key";
    }
});

            async function checkSession() {
                try {
                    const { data } = await authClient.getSession();
                    if (data && data.session) {
                        statusText.textContent = "Authenticated ✅";
                        authSection.style.display = 'none';
                        userSection.style.display = 'block';
                        document.getElementById('user-name').textContent = data.user.name;
                        document.getElementById('user-data').textContent = JSON.stringify(data.user, null, 2);
                    } else {
                        statusText.textContent = "Not logged in ❌";
                        authSection.style.display = 'block';
                        userSection.style.display = 'none';
                    }
                } catch (e) {
                    statusText.textContent = "Error connecting to auth server";
                    console.error(e);
                }
            }

            loginBtn.addEventListener('click', async () => {
                loginBtn.disabled = true;
                loginBtn.textContent = 'Redirecting...';
                await authClient.signIn.social({
                    provider: "github",
                    callbackURL: window.location.href
                });
            });

            logoutBtn.addEventListener('click', async () => {
                await authClient.signOut();
                window.location.reload();
            });

            checkSession();
        </script>
    </body>
    </html>
  `;
  return htmlContent;
};
