/**
 * @type {import('postcss').Plugin}
 */
module.exports = {
  postcssPlugin: 'svelte-nesting-css-fixer',
  Rule(rule) {
    delete rule.raws.ownSemicolon
  }
}
