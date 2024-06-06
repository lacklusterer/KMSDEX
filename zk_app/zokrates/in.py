import hashlib
import sys
import argparse

def int_to_128bit_bytes(value):
    return value.to_bytes(16, byteorder='big')

def get_hash(preimage, verbose, args):
    if verbose:
        print(f"Binary representation of pre-image: {bin(int(preimage.hex(), 16))}")
        print(f"SHA-256 hash: {hashlib.sha256(preimage).hexdigest()}")

    # Split the SHA-256 digest into two 128-bit numbers
    digest = hashlib.sha256(preimage).hexdigest()
    digest_bytes = bytes.fromhex(digest)
    digest_int = int.from_bytes(digest_bytes, 'big')

    # Split the digest into two 128-bit numbers
    first_128bits = digest_int >> 128
    second_128bits = digest_int & ((1 << 128) - 1)

    # Print the two 128-bit numbers for verification
    if verbose:
        print(f"First 128 bits: {first_128bits}")
        print(f"Second 128 bits: {second_128bits}")
    else:
        print(f"{args.a} {args.b} {args.c} {args.d} {first_128bits} {second_128bits}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process 4 128-bit numbers and compute their SHA-256 hash.")
    parser.add_argument("a", type=int, help="First 128-bit number")
    parser.add_argument("b", type=int, help="Second 128-bit number")
    parser.add_argument("c", type=int, help="Third 128-bit number")
    parser.add_argument("d", type=int, help="Fourth 128-bit number")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output")

    args = parser.parse_args()
    print(args)

    try:
        if args.a < 0 or args.a > (2**128 - 1) or args.b < 0 or args.b > (2**128 - 1) or args.c < 0 or args.c > (2**128 - 1) or args.d < 0 or args.d > (2**128 - 1):
            raise ValueError("Each value must be a 128-bit number (0 <= value < 2^128)")

        preimage = int_to_128bit_bytes(args.a) + int_to_128bit_bytes(args.b) + int_to_128bit_bytes(args.c) + int_to_128bit_bytes(args.d)
        if args.verbose:
            print(f"Preimage: {preimage}")
        get_hash(preimage, args.verbose, args)

    except ValueError as e:
        print(f"Invalid input: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)
