# priv-key-precommit

A simple precommit hook that checks for the presence of a private key in your codebase.

## Usage

1. Install the package

```bash
yarn add -D priv-key-precommit
```

2. Create a script in your `package.json`

```json
"scripts": {
  "priv-key-check": "priv-key-precommit"
}
```

3. Install husky (or a similar pre-commit hook manager)

```bash
npx husky-init && yarn
```

4. Edit the contents of `.husky/pre-commit`

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run priv-key-check
```

5. Try commiting your code. It won't let you commit your code if it finds a private key in your codebase.

```bash
❯ git commit -m 'test'

> priv:check
> priv-key-precommit

🚨 Found 1 instance(s) of private keys. Aborting commit.
=> .env.example
husky - pre-commit hook exited with code 1 (error)
```
