#!/usr/bin/env bash
# Alias del deploy rápido (mismo que deploy-storefront.sh)
exec "$(dirname "$0")/deploy-storefront.sh" "$@"
