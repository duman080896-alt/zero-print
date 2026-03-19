#!/bin/bash
# Restores GitHub SSH key from Replit Secret SSH_PRIVATE_KEY on every session start

if [ -z "$SSH_PRIVATE_KEY" ]; then
  echo "[setup-ssh] SSH_PRIVATE_KEY secret not set — skipping SSH setup"
  exit 0
fi

mkdir -p ~/.ssh
chmod 700 ~/.ssh

printf '%s\n' "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# Add GitHub to known_hosts (suppress output)
ssh-keyscan -t rsa,ecdsa,ed25519 github.com >> ~/.ssh/known_hosts 2>/dev/null
chmod 644 ~/.ssh/known_hosts

# Configure git to use SSH for github.com
git config --global url."git@github.com:".insteadOf "https://github.com/"

echo "[setup-ssh] GitHub SSH key configured successfully"
