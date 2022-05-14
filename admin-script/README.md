# dunhack.me Admin Panel

This is the CLI Admin Interface for dunhack.me. 

## Installation

```
cd admin-script

pip install -e .
```

## Documentation

This is an example directory tree.

```
.
├── invalid-ctf
│   └── invalid-category
│       └── invalid-challenge
│           ├── DESCRIPTION
│           └── POINTS
├── soup-ctf
│   └── turtle-category
│       └── test
│           ├── DESCRIPTION
│           ├── FLAG
│           └── POINTS
└── turtle-ctf
    ├── DESCRIPTION
    └── turtle-category
        ├── DESCRIPTION
        ├── test-dynamic
        │   ├── DESCRIPTION
        │   └── FLAG
        ├── test-files
        │   ├── DESCRIPTION
        │   ├── FLAG
        │   ├── HINTS
        │   ├── POINTS
        │   └── flag.txt
        └── test-hints
            ├── DESCRIPTION
            ├── FLAG
            ├── HINTS
            └── POINTS
```

This directory is also available in here.

To change the AWS Bucket or PostgreSQL config, just edit `dunhack.py` directly. If you installed it with `pip install -e .`, it will update the command accordingly.

### DESCRIPTION

Description for its parent (ie. the parent CTF, category or challenge). It's optional for CTF and category, but required for challenges.

### FLAG

Flag for the parent challenge. It's required for challenges.

### POINTS

Points for the parent challenge, if static scoring (default) is used. If dynamic scoring is enabled, this file will be ignored. It must be a single integer value. It's required for challenges when the `-d` flag is not specified, and will be ignored if `-d` is specified (eg. `dunhack sync -d 1000 100`)

### HINTS

Hints for the parent challenge, each hint separated by a newline. It is optional for challenges.

### Other files

Other files that need to be attached to the challenge can be placed in the same challenge directory. They can't have conflicting names with the above files.

## Usage examples

```
cd example

dunhack sync # static by default
```

```
cd example

dunhack sync -d 1000 100 # dynamic scoring (initialPoints, minPoints)
```
