![zokrates_usage](./zokrates.jpg)

## Require Zokrates to use

```bash
curl -LSfs get.zokrat.es | sh
```

## Usage

- All files bash (.sh) need to has execute permission. Therefore, you need to run the following command:
```bash
chmod +x {filename}
```

- Simply run the following command to obtain proof:

```bash
/bin/bash ./run.sh a b c d
```

- If you get the error: ```$'\r': command not found```, run the following command:
```bash
dos2unix {filename}
```

Where a, b, c, d are 128 bits numbers representing the pre-image (Example: 0 0 0 5)
