module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded text in JSX/TSX - use translation keys instead',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [], // no options
  },
  create(context) {
    return {
      JSXText(node) {
        const text = node.value.trim()
        // Skip empty, very short, or expression-like text
        if (text.length <= 2) return
        if (text.includes('{') || text.includes('}')) return
        // Skip if parent is already a translation call or variable
        const parent = node.parent
        if (parent && parent.type === 'JSXExpressionContainer') {
          // e.g., {t('key')} or {'some string'} - ignore
          return
        }
        context.report({
          node,
          message: `Hardcoded text found: "${text}". Use the translation system (t('key')) instead.`,
        })
      },
    }
  },
}
