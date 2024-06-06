#!/bin/zsh

# Define the target file and directory
BIN="./artifacts/psh256"
ART_DIR="./artifacts"

# Check if the file exists
if [ ! -f "$BIN" ]; then
    # Create the directory if it doesn't exist
    if [ ! -d "$ART_DIR" ]; then
        echo "Creating directory $ART_DIR"
        mkdir -p "$ART_DIR"
    fi

    # Run the zokrates compile command
    echo "Running zokrates compile command"
    zokrates compile -i ./psh256.zok -o $ART_DIR/psh256 -s $ART_DIR/abi.json -r $ART_DIR/out.r1cs

    echo "Compilation finished."
else
    echo "Compiled binary found"
fi
