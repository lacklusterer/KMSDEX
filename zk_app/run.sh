#!/bin/bash

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 arg1 arg2 arg3 arg4"
    exit 1
fi

./scripts/compile.sh
./scripts/keygen.sh

ARGS=$(python ./scripts/in.py $1 $2 $3 $4)
LAST_ARG=$(echo "$ARGS" | awk '{print $7}')
echo "$ARGS" | awk '{print $1, $2, $3, $4, $5, $6}' | xargs ./scripts/comproof.sh
echo "SHA-256 digest: $LAST_ARG"
