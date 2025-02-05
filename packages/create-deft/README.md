# create-deft <a href="https://npmjs.com/package/create-vite"><img src="https://img.shields.io/npm/v/create-vite" alt="npm package"></a>

## Scaffolding Your First Deft Project


With NPM:

```bash
$ npm create deft@latest
```

With Yarn:

```bash
$ yarn create deft
```

With PNPM:

```bash
$ pnpm create deft
```

With Bun:

```bash
$ bun create deft
```

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a Vite + Vue project, run:

```bash
# npm 7+, extra double-dash is needed:
npm create deft@latest my-deft-app -- --template react-ts

# yarn
yarn create deft my-deft-app --template react-ts

# pnpm
pnpm create deft my-deft-app --template react-ts

# Bun
bun create deft my-deft-app --template react-ts
```

Currently supported template presets include:

- `vanilla`
- `vanilla-ts`
- `react`
- `react-ts`

You can use `.` for the project name to scaffold in the current directory.

# LICENSE

MIT