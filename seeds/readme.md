# Seeds & Local Testing (`act`)

This folder contains the **event files** needed to test GitHub Actions on your own computer using a tool called **[act](https://github.com/nektos/act)**.

## Important: Development Workflow

To keep the project clean and safe, we use a **template system**:

1. **The Template**: `event.template.json` is the master copy. **Do not** use this for your personal tests.
2. **Your Local Copy**: Create a copy of the template named `event.json`.
```bash
cp seeds/event.template.json seeds/event.json

```

3. **Testing**: Make all your changes (IDs, titles, hashes) inside `event.json`. This file is hidden from Git, so your private data stays safe.
4. **Updates**: If you change the structure of the data, remember to update `event.template.json` before saving your work.


## How to Run Tests

### 1. Requirements

* **Docker**: Must be installed and running.
* **Act**: The tool that runs the actions.
* **API**: Your local server (Hono/Wrangler) must be running (`bun run dev`).

### 2. The Test Command

Run this command in your terminal to start the sync:

```bash
act pull_request -e seeds/event.json \
  --network host \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  -s API_URL=http://localhost:8787/api/webhooks/github/sync

```

## Setup Tips

* **Project ID**: Check that the `repository.id` in your `event.json` exists in your local database.
* **PR Title**: Change the `pull_request.title` to test the **Parser** (e.g., `feat(api): add sync`).
* **Errors**: If you get a **Zod Error**, check that all URLs and Emails in your JSON are valid and not empty.
