# auto-changelog-plus

[中文](./README.md) | English

A command line tool for automatically generating changelog from git commit history.

> Based on [auto-changelog](https://github.com/CookPete/auto-changelog) and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

[![npm version](https://img.shields.io/npm/v/auto-changelog-plus.svg)](https://www.npmjs.com/package/auto-changelog-plus)

## 📦 Installation

```bash
npm install -g auto-changelog-plus
```

## 🚀 Usage

Run `auto-changelog-plus` or `acp` in the root directory of your git repository. The tool will run `git log` in the background to parse commit history.

```bash
Usage: auto-changelog-plus [options]

Options:
  -o, --output [file]                 # output file, default: CHANGELOG.md
  -c, --config [file]                 # config file location, default: .auto-changelog
  -t, --template [template]           # specify template to use [compact, keepachangelog, json], default: compact
  -r, --remote [remote]               # specify git remote to use for links, default: origin
  -p, --package                       # use version from package.json as latest release
  -v, --latest-version [version]      # use specified version as latest release
  -u, --unreleased                    # include section for unreleased changes
  -l, --commit-limit [count]          # number of commits to display per release, default: 3
  -b, --backfill-limit [count]        # number of commits to backfill empty releases with, default: 3
      --commit-url [url]              # override url for commits, use {id} for commit id
      --issue-url [url]               # override url for issues, use {id} for issue id
      --merge-url [url]               # override url for merges, use {id} for merge id
      --compare-url [url]             # override url for compares, use {from} and {to} for tags
      --issue-pattern [regex]         # override regex pattern for issues in commit messages
      --breaking-pattern [regex]      # regex pattern for breaking change commits
      --merge-pattern [regex]         # add custom regex pattern for merge commits
      --commit-pattern [regex]        # pattern to include when parsing commits
      --ignore-commit-pattern [regex] # pattern to ignore when parsing commits
      --tag-pattern [regex]           # override regex pattern for version tags
      --tag-prefix [prefix]           # prefix used in version tags, default: v
      --starting-version [tag]        # specify earliest version to include in changelog
      --starting-date [yyyy-mm-dd]    # specify earliest date to include in changelog
      --ending-version [tag]          # specify latest version to include in changelog
      --sort-commits [property]       # sort commits by property [relevance, date, date-desc, subject, subject-desc], default: relevance
      --release-summary               # display tagged commit message body as release summary
      --unreleased-only               # only output unreleased changes
      --hide-empty-releases           # hide empty releases
      --hide-credit                   # hide auto-changelog credit
      --handlebars-setup [file]       # handlebars setup file
      --append-git-log [string]       # string to append to git log command
      --append-git-tag [string]       # string to append to git tag command
      --prepend                       # prepend changelog to output file
      --stdout                        # output changelog to stdout
  -V, --version                       # output the version number
  -h, --help                          # output usage information
```

Here are some common usage examples:

```bash
# Write changelog to CHANGELOG.md in current directory
auto-changelog-plus

# Write changelog to HISTORY.md using keepachangelog template
auto-changelog-plus --output HISTORY.md --template keepachangelog

# Disable commit limit, render all commits for each release
auto-changelog-plus --commit-limit false
```

> Run `auto-changelog-plus -h` for help or refer to [auto-changelog](https://github.com/cookpete/auto-changelog) documentation.

## 📝 Conventional Commits

Based on [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, supports the following commit types:

- `feat:` New features
- `fix:` Bug fixes
- `perf:` Performance optimizations
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `test:` Test related
- `style:` Code formatting adjustments
- `chore:` Build process or auxiliary tool changes
- `build:` Build system changes
- `ci:` Continuous integration configuration changes
- `revert:` Code rollback
- Supports scope: `feat(api):`, `fix(ui):` etc.
- Supports emoji: `:sparkles: feat:`, `✨ feat:` etc.
- Supports Breaking Changes: `feat!:`, `feat(scope)!:`, `BREAKING CHANGE:` etc.
- Auto ignores WIP commits: `wip:`, `Wip:` etc. temporary commits will not be included in changelog

## ⚙️ Automated Usage

Install `auto-changelog-plus` as a dev dependency:

```bash
npm install auto-changelog-plus --save-dev
# or
yarn add auto-changelog-plus --dev
# or
pnpm add -D auto-changelog-plus
```

Add `auto-changelog-plus -p && git add CHANGELOG.md` to your `version` script in `package.json`:

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "devDependencies": {
    "auto-changelog-plus": "*"
  },
  "scripts": {
    "version": "auto-changelog-plus -p && git add CHANGELOG.md"
  }
}
```

Using `-p` or `--package` will use the `version` from `package.json` as the latest release, so all commits between previous releases and now become part of that release. Basically anything that would normally be parsed as `Unreleased` will now appear under the `version` from `package.json`.

Now every time you run [npm version](https://docs.npmjs.com/cli/version), the changelog will be automatically updated and become part of the version commit.

## 🔄 Differences from auto-changelog

`auto-changelog-plus` is a wrapper around `auto-changelog`, fully compatible with all existing usage and configurations of `auto-changelog`.

Key improvements:

- **Optimized default template**: Better adapted to conventional commit specifications
- **Adjusted default configuration**: Provides more reasonable out-of-the-box experience
- **Extended template functionality**: Provides additional template helper functions

If you are using `auto-changelog`, you can directly replace it with `auto-changelog-plus` without modifying any configuration.

## 📄 License

MIT
