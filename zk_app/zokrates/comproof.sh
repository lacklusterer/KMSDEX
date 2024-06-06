#!/bin/zsh

PROOF=./proof.json
PROVER_DIR=./peggy

if [ ! -d $PROVER_DIR ]; then
	mkdir $PROVER_DIR
fi

cd $PROVER_DIR

if [ ! -f witness ]; then
  echo "Generating witness"
  zokrates compute-witness -i ../artifacts/psh256 -a $1 $2 $3 $4 $5 $6
else 
  echo "Witness file found"
fi

if [ ! -f ../$PROOF ]; then
  echo "Generating proof"
  zokrates generate-proof -i ../artifacts/psh256
  mv ./proof.json ../
else
  echo "Proof file found"
fi
