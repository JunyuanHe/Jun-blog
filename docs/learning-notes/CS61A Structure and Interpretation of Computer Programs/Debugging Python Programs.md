---
title: Debugging Python Programs
createTime: 2026/07/23 10:33:49
permalink: /learning-notes/8y37h4dy/
---

## Using Doctests

Python includes a simple way to test your functions called **doctests**. A doctest is written inside a function’s docstring and shows an example of how the function should behave.

```python
def foo(x):
    """Returns the given value.

    >>> foo(4)
    4
    >>> foo(5)
    5
    """
```

The lines beginning with `>>>` represent commands entered into the Python interpreter. The line below each command shows the expected result.

To run the doctests in a file, open the terminal and enter:

```bash
python3 -m doctest file.py
```

Python will execute the examples and compare the actual results with the expected results. If a test fails, it will display information about the error.

You can also use the verbose option:

```bash
python3 -m doctest file.py -v
```

The `-v` option shows both successful and failed tests.

Starter files often already contain doctests, but you can add your own by following the same format. Writing extra tests can help you better understand the expected inputs and outputs, identify edge cases, and find mistakes earlier. Spending a little time creating tests can make debugging much easier later.

## Interactive Debugging

Another useful debugging method is to run a Python file in interactive mode:

```bash
python3 -i file.py
```

This command first runs the contents of the file and then opens an interactive Python session. From there, you can call functions, inspect variables, and test different inputs without restarting the program each time.
