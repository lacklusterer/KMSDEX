#!/bin/sh

PROVING_KEY=./peggy/proving.key
VERIFICATION_KEY=./victor/verification.key

if [ ! -f "$PROVING_KEY" ] || [ ! -f "$VERIFICATION_KEY" ]; then
	echo "Generating keys..."
	if [ ! -d "./peggy" ]; then
		mkdir peggy
	fi
	if [ ! -d "./victor" ]; then
		mkdir victor
	fi
	zokrates setup -i ./artifacts/psh256 -v $VERIFICATION_KEY -p $PROVING_KEY
else
	echo "Keys found"
fi

