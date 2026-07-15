---
title: Using Jupyterlab on Linux with uv as package manager
createTime: 2026/07/15 17:00:43
permalink: /blog/or1d9bzm/
tags:
  - Programming
  - Linux
  - JupyterLab
  - uv
---

# Using JupyterLab on Linux with uv

On Linux, installing packages into the system Python is generally discouraged because the interpreter may be managed by the operating system. For project work, use a virtual environment instead.

I use **uv** to manage Python environments and dependencies for research projects. However, JupyterLab is only an exploratory tool, so I do not want it to become a permanent project dependency.

There are two practical ways to use JupyterLab with a uv project.

## Option 1: Use a Shared JupyterLab Environment

Create a separate virtual environment for JupyterLab:

```bash
python3 -m venv ~/.venvs/jupyter
~/.venvs/jupyter/bin/pip install jupyterlab
```

In the uv project, install `ipykernel` as a development dependency:

```bash
uv add --dev ipykernel
```

Register the project environment as a Jupyter kernel:

```bash
uv run ipython kernel install \
  --user \
  --env VIRTUAL_ENV "$(pwd)/.venv"
  --name my-project \
  --display-name "Python (my-project)"
```

Start JupyterLab from the shared environment:

```bash
~/.venvs/jupyter/bin/jupyter lab
```

Then select **Python (my-project)** as the notebook kernel.

This approach works well when one JupyterLab installation is shared across many projects.

## Option 2: Run JupyterLab Temporarily with uv

uv can provide JupyterLab only for the current command:

```bash
uv run --with jupyter jupyter lab
```

JupyterLab is downloaded and made available for the session, but it is not added to the project's dependencies.

For a dedicated project kernel, first install and register `ipykernel`:

```bash
uv add --dev ipykernel

uv run ipython kernel install \
  --user \
  --env VIRTUAL_ENV "$(pwd)/.venv"
  --name my-project \
  --display-name "Python (my-project)"
```

Then launch JupyterLab:

```bash
uv run --with jupyter jupyter lab
```

## Adding Notebook Dependencies

Add reproducible project dependencies with:

```bash
uv add pandas matplotlib scikit-learn
```

Avoid installing packages manually inside the notebook when possible. Using `uv add` keeps `pyproject.toml`, `uv.lock`, and the project environment synchronized.

## Recommendation

For occasional notebook work, the simplest option is:

```bash
uv add --dev ipykernel
uv run --with jupyter jupyter lab
```

This keeps the system Python untouched, the project dependencies clean, and JupyterLab available whenever it is needed.
