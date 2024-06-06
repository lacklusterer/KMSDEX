#!/bin/zsh

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 arg1 arg2 arg3 arg4"
    exit 1
fi

./scripts/compile.sh
./scripts/keygen.sh
python ./scripts/in.py $1 $2 $3 $4 | xargs ./scripts/comproof.sh
