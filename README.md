<h1 align="center">@stackup/codegen</h1>

<div align="center">

![Build](https://github.com/rzane/codegen/workflows/CI/badge.svg)
![Version](https://img.shields.io/npm/v/@stackup/codegen)
![License](https://img.shields.io/npm/l/@stackup/codegen)

</div>

## Install

```bash
$ yarn add @stackup/codegen --dev
```

## Usage

```
$ yarn codegen --help
Usage: codegen [options]

generate type definitions from GraphQL queries

Options:
  -V, --version          output the version number
  -i, --input <input>    glob of queries to generate types for
  -o, --output <output>  path to file that will be generated
  -s, --schema <schema>  URL or file path to a GraphQL schema
  --suffix               append suffix (e.g. Mutation, Query)
  --immutable            generate readonly types
  -h, --help             display help for command
```
