# TLA+ By Example

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

An interactive website for learning TLA+ through guided examples with an in-browser model checker.

**Live at:** [tlabyexample.com](https://tlabyexample.com)

## What is this

A Next.js static site that teaches TLA+ specifications through two sections:

1. **Intro to TLA+** — step-by-step lessons on syntax, data structures, and TLC configuration
2. **BlockingQueue Tutorial** — an adaptation of [Markus Kuppe's BlockingQueue](https://github.com/lemmy/BlockingQueue) tutorial, walking through a concurrent bounded buffer spec commit by commit

Each lesson has a split layout: explanation on the left, interactive playground on the right. The playground runs the TLC model checker directly in the browser via [CheerpJ](https://cheerpj.com/) (TLA+ tools compiled to a JAR, executed in-browser).

## Development

```bash
npm install
npm run dev       # start dev server at http://localhost:3000
npm test          # run jest tests
npm run build     # static export to out/
```

Requires Node.js 20+.

See [the lesson authoring guide](dev/lessons.md) for the Markdown format, lesson registration, expected outcomes, and BlockingQueue source alignment.

## Full TLA+ tooling in the browser (GitHub Codespaces)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/tlaplus/tla-by-example?quickstart=1)

The **Open in VS Code** button on lesson and spec pages opens this repository in a codespace (`.devcontainer/devcontainer.json`). It provides:

- VS Code in the browser with the [TLA+ extension](https://marketplace.visualstudio.com/items?itemName=tlaplus.vscode-ide) and Java for TLC
- every lesson exported to `lessons/<section>/<lesson>/<Module>.tla` and `.cfg`
- the [tlaplus/Examples](https://github.com/tlaplus/Examples) specifications in `Examples/`

Open a `.tla` file and run **TLA+: Check model with TLC**. Codespaces usage is billed to the GitHub account that creates the codespace; personal accounts include a monthly free quota.

To export the lessons locally (requires Node.js 22.18+ for TypeScript type stripping):

```bash
npm run export-lessons
```
