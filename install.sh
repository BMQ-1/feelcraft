#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/BMQ-1/feelcraft.git"
TMP_DIR="$(mktemp -d)"
cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

echo "Downloading Feelcraft..."
if command -v git >/dev/null 2>&1; then
  git clone --depth 1 --quiet "$REPO_URL" "$TMP_DIR/repo"
else
  curl -fsSL "https://github.com/BMQ-1/feelcraft/archive/refs/heads/main.tar.gz" -o "$TMP_DIR/feelcraft.tar.gz"
  mkdir -p "$TMP_DIR/repo"
  tar -xzf "$TMP_DIR/feelcraft.tar.gz" --strip-components=1 -C "$TMP_DIR/repo"
fi

SRC_DIR="$TMP_DIR/repo/feelcraft"
INSTALLED=0

install_to() {
  local target_root="$1"
  local label="$2"
  mkdir -p "$target_root"
  rm -rf "$target_root/feelcraft"
  cp -R "$SRC_DIR" "$target_root/feelcraft"
  echo "  ✓ Installed for $label -> $target_root/feelcraft"
  INSTALLED=$((INSTALLED + 1))
}

# Install into every detected agent home + universal ~/.agents/skills
[ -d "$HOME/.gemini" ] && install_to "$HOME/.gemini/config/skills" "Antigravity"
[ -d "$HOME/.codex" ]  && install_to "$HOME/.codex/skills" "OpenAI Codex"
[ -d "$HOME/.claude" ] && install_to "$HOME/.claude/skills" "Claude Code"
install_to "$HOME/.agents/skills" "Universal (.agents)"

echo ""
echo "Done! Feelcraft installed in $INSTALLED location(s)."
echo "Try it in your agent: /feelcraft  or  \$feelcraft  or  'Use feelcraft on this project'"
