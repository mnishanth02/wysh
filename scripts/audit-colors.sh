#!/bin/bash

# Color Audit Script for Wysh
# Purpose: Find all hardcoded hex/RGB color values in production code
# Usage: ./scripts/audit-colors.sh

echo "🎨 Auditing codebase for hardcoded colors..."
echo "================================================"
echo ""

# Directories to search
SEARCH_DIRS="app components lib hooks"

# Patterns to find (hex colors, rgb/rgba functions)
HEX_PATTERN='#[0-9a-fA-F]{3,8}'
RGB_PATTERN='rgba?\([0-9, ]+\)'

# Files to exclude (config files where hex colors are acceptable)
EXCLUDE_PATTERN='node_modules|\.next|\.git|globals\.css|tailwind\.config'

echo "Searching for hex color values (#rrggbb, #rgb, #rrggbbaa)..."
echo "-----------------------------------------------------------"
HEXCOUNT=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  -E "$HEX_PATTERN" $SEARCH_DIRS 2>/dev/null | \
  grep -vE "$EXCLUDE_PATTERN" | \
  tee /dev/tty | wc -l)

echo ""
echo "Searching for rgb/rgba function calls..."
echo "-----------------------------------------"
RGBCOUNT=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  -E "$RGB_PATTERN" $SEARCH_DIRS 2>/dev/null | \
  grep -vE "$EXCLUDE_PATTERN" | \
  tee /dev/tty | wc -l)

echo ""
echo "================================================"
echo "📊 Audit Summary"
echo "================================================"
echo "Hex color violations: $HEXCOUNT"
echo "RGB/RGBA violations: $RGBCOUNT"

TOTAL=$((HEXCOUNT + RGBCOUNT))
echo "Total violations: $TOTAL"
echo ""

if [ $TOTAL -eq 0 ]; then
  echo "✅ PASS: No hardcoded color values found!"
  exit 0
else
  echo "❌ FAIL: Found $TOTAL hardcoded color values"
  echo ""
  echo "💡 Action Required:"
  echo "Replace hardcoded colors with shadcn/ui CSS variables:"
  echo "  - Use hsl(var(--primary)) instead of #3b82f6"
  echo "  - Use hsl(var(--background)) instead of #ffffff"
  echo "  - Use hsl(var(--foreground)) instead of #000000"
  echo "  - See app/globals.css for available CSS variables"
  exit 1
fi
