const { execSync } = require('node:child_process')

/**
 * Custom Handlebars helpers for auto-changelog-plus
 *
 * @author Lruihao <1024@lruihao.cn>
 * @license MIT
 *
 * @see {@link https://github.com/Lruihao/auto-changelog-plus} Project repository
 * @see {@link https://handlebarsjs.com/} Handlebars.js documentation
 */

module.exports = function (Handlebars) {
  /**
   * Check if the git remote is GitHub
   * @returns {boolean} True if remote is GitHub
   */
  function isGitHubRemote() {
    try {
      const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim()
      return remoteUrl.includes('github.com')
    }
    catch {
      return false
    }
  }

  /**
   * Handlebars helper for logical OR operation
   * @param {...*} args Values to check
   * @returns {boolean} True if any argument is truthy
   */
  Handlebars.registerHelper('or', (...args) => {
    // Remove the options object (last argument)
    const values = args.slice(0, -1)
    return values.some(val => !!val)
  })

  /**
   * Handlebars helper for logical AND operation
   * @param {...*} args Values to check
   * @returns {boolean} True if all arguments are truthy
   */
  Handlebars.registerHelper('and', (...args) => {
    // Remove the options object (last argument)
    const values = args.slice(0, -1)
    return values.every(val => !!val)
  })

  /**
   * Handlebars helper for equality comparison
   * @param {*} a First value
   * @param {*} b Second value
   * @returns {boolean} True if values are equal
   */
  Handlebars.registerHelper('eq', (a, b) => {
    return a === b
  })

  /**
   * Handlebars helper for greater than comparison
   * @param {*} a First value
   * @param {*} b Second value
   * @returns {boolean} True if a is greater than b
   */
  Handlebars.registerHelper('gt', (a, b) => {
    return a > b
  })

  /**
   * Handlebars helper for less than comparison
   * @param {*} a First value
   * @param {*} b Second value
   * @returns {boolean} True if a is less than b
   */
  Handlebars.registerHelper('lt', (a, b) => {
    return a < b
  })

  /**
   * Handlebars helper to replace a string with another string
   * @param {string} context The string to replace
   * @param {object} options
   * @param {string} options.hash.from The string to replace
   * @param {string} options.hash.to The string to replace with
   * @example {{replace "foo bar" from="foo" to="baz"}} => "baz bar"
   */
  Handlebars.registerHelper('replace', (context, options) => {
    return context.replace(options.hash.from, options.hash.to)
  })

  /**
   * Handlebars helper to convert a commit name to a GitHub username if applicable
   * @param {string} commitName Commit name to convert
   * @param {string} [commitEmail] Commit email
   * @param {object} [options]
   * @param {boolean} [options.hash.linked=true] Whether to return a linked username
   * @example {{getAuthor "Cell"}} => "Lruihao"
   * @example {{getAuthor "Cell" linked=true}} => "[@Lruihao](https://github.com/Lruihao)"
   */
  Handlebars.registerHelper('getAuthor', (commitName, commitEmail = '', { hash: { linked = false } }) => {
    // Check if remote URL is GitHub
    if (!isGitHubRemote()) {
      // Syntax: commitName <commitEmail>
      return `${commitName} \\<${commitEmail}\\>`
    }

    /**
     * Map Commit names to GitHub usernames
     * if your commit name is not same as your GitHub username, add an entry here.
     */
    const map = {
      // Author
      'Cell': 'Lruihao',
      // Bots
      'Cell[bot]': 'lrhx',
      'dependabot[bot]': 'dependabot',
      // Collaborators, Contributors
    }
    const githubUser = map[commitName] || commitName
    if (linked) {
      return `[@${githubUser}](https://github.com/${githubUser})`
    }
    return `@${githubUser}`
  })

  /**
   * Handlebars helper to capitalize the first letter of a string
   * @param {string} context The string to capitalize
   * @example {{capitalize "hello world"}} => "Hello world"
   * @example {{capitalize "**scope**: message"}} => "**Scope**: Message"
   */
  Handlebars.registerHelper('capitalize', (context) => {
    if (!context || typeof context !== 'string') {
      return context
    }

    // Check if it matches **scope**: pattern using regex
    const scopeMatch = context.match(/^\*\*([^*]+)\*\*:\s(.*)$/)
    if (scopeMatch) {
      const scope = scopeMatch[1]
      const message = scopeMatch[2]
      const capitalizedScope = scope.charAt(0).toUpperCase() + scope.slice(1)
      const capitalizedMessage = message.charAt(0).toUpperCase() + message.slice(1)
      return `**${capitalizedScope}**: ${capitalizedMessage}`
    }

    // Regular capitalization
    return context.charAt(0).toUpperCase() + context.slice(1)
  })

  /**
   * Merge commits, merges, and fixes into a unified array
   * @param {Array} merges Array of merge objects
   * @param {Array} fixes Array of fix objects
   * @param {Array} commits Array of commit objects
   * @returns {Array} Unified array of all commits
   */
  Handlebars.registerHelper('mergeAllCommits', (merges, fixes, commits) => {
    const allCommits = []

    // Add commits from merges
    if (merges && Array.isArray(merges)) {
      merges.forEach((merge) => {
        if (merge.commit) {
          allCommits.push({
            ...merge.commit,
            _source: 'merge',
            _mergeInfo: {
              id: merge.id,
              message: merge.message,
              href: merge.href,
              author: merge.author,
            },
          })
        }
      })
    }

    // Add commits from fixes
    if (fixes && Array.isArray(fixes)) {
      fixes.forEach((fix) => {
        if (fix.commit) {
          allCommits.push({
            ...fix.commit,
            _source: 'fix',
            _fixInfo: {
              fixes: fix.fixes,
            },
          })
        }
      })
    }

    // Add regular commits
    if (commits && Array.isArray(commits)) {
      commits.forEach((commit) => {
        allCommits.push({
          ...commit,
          _source: 'commit',
        })
      })
    }

    // Sort by date (newest first)
    // return allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
    return allCommits
  })
}
