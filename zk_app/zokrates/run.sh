#!/bin/zsh

./compile.sh
./keygen.sh

# Check if the correct number of arguments is provided
if [ $# -ne 4 ]; then
	echo "Error: You must provide exactly 4 arguments for the Python script."
	echo "Usage: $0 <arg1> <arg2> <arg3> <arg4>"
	exit 1
fi

# Assign arguments to variables
PY_ARG1=$1
PY_ARG2=$2
PY_ARG3=$3
PY_ARG4=$4

# Run the Python script and capture its output
PYTHON_OUTPUT=$(python3 in.py $PY_ARG1 $PY_ARG2 $PY_ARG3 $PY_ARG4)

# Check if the Python script executed successfully
if [ $? -ne 0 ]; then
	echo "Error: Python script execution failed."
	exit 1
fi

# Run the comp.sh script with the output of the Python script
./comproof.sh $PYTHON_OUTPUT
