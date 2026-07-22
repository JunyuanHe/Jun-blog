---
title: "Imitation Learning: Action Chunking with MSE loss"
createTime: 2026/07/22 14:24:01
permalink: /learning-notes/5na91yfk/
---

## Action Chunking

Action chunking lowers how often a policy must make decisions by generating several consecutive actions in a single prediction. At time $t$, the policy $\pi_\theta(A_t \mid o_t)$ takes the current observation $o_t$ and outputs an action sequence

$$
A_t = (a_t, a_{t+1}, \ldots, a_{t+K-1}),
$$

where $K$ is the fixed chunk length. These actions are then carried out open-loop: the environment executes $a_t$ at time $t$, $a_{t+1}$ at time $t+1$, and continues in this manner through $a_{t+K-1}$. Once the entire sequence has been executed, the policy receives the updated observation $o_{t+K}$ and predicts the next action chunk.

## MSE loss for Action Chunking

A straightforward approach to training an action-chunking policy is to minimize a mean-squared error loss. Given a dataset containing observation–expert-chunk pairs $(o_t^{(j)}, A_t^{(j)})$, the policy parameters are learned by minimizing

$$
L_{\mathrm{MSE}}(\theta) = 
\frac{1}{B}
\sum_{j=1}^{B}
\left\|
A_t^{(j)}-\pi_\theta(o_t^{(j)})
\right\|_2^2,
$$

for each training batch, where $\pi_\theta(o_t^{(j)})$ is the action chunk predicted by the policy network and $B$ denotes the batch size.

## Implementation

The starter code given in `models.py` defines a base class `BasePolicy` for action chunking policies, along with a subclass `MSEPolicy` that is intended to implement the MSE loss for action chunking. The `MSEPolicy` class has methods for computing the loss and sampling actions, which need to be implemented.

Below is the implementation of the base class.

```python:collapsed-lines title="models.py"
"""Model definitions for Push-T imitation policies."""

from __future__ import annotations

import abc
from typing import Literal, TypeAlias

import torch
from torch import nn


class BasePolicy(nn.Module, metaclass=abc.ABCMeta):
    """Base class for action chunking policies."""

    def __init__(self, state_dim: int, action_dim: int, chunk_size: int) -> None:
        super().__init__()
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.chunk_size = chunk_size

    @abc.abstractmethod
    def compute_loss(
        self, state: torch.Tensor, action_chunk: torch.Tensor
    ) -> torch.Tensor:
        """Compute training loss for a batch."""

    @abc.abstractmethod
    def sample_actions(
        self,
        state: torch.Tensor,
        *,
        num_steps: int = 10,  # only applicable for flow policy
    ) -> torch.Tensor:
        """Generate a chunk of actions with shape (batch, chunk_size, action_dim)."""
```

The `MSEPolicy` class is implemented as follows, which predicts action chunks using a simple MLP and computes the MSE loss.

```python title="models.py"
class MSEPolicy(BasePolicy):
    """Predicts action chunks with an MSE loss."""

    def __init__(
        self,
        state_dim: int,
        action_dim: int,
        chunk_size: int,
        hidden_dims: tuple[int, ...] = (128, 128),
    ) -> None:
        super().__init__(state_dim, action_dim, chunk_size)

        layers: list[nn.Module] = []
        current_dim = state_dim
        for hidden_dim in hidden_dims:
            layers.append(nn.Linear(current_dim, hidden_dim))
            layers.append(nn.ReLU())
            current_dim = hidden_dim
        layers.append(nn.Linear(current_dim, chunk_size * action_dim))
        self.model = nn.Sequential(*layers)

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        predicted_actions = self.model(state)
        predicted_actions = predicted_actions.view(-1, self.chunk_size, self.action_dim)
        return predicted_actions

    def compute_loss(
        self,
        state: torch.Tensor,
        action_chunk: torch.Tensor,
    ) -> torch.Tensor:
        predicted_actions = self.forward(state)
        return nn.functional.mse_loss(predicted_actions, action_chunk)

    @torch.inference_mode()
    def sample_actions(
        self,
        state: torch.Tensor,
        *,
        num_steps: int = 10,
    ) -> torch.Tensor:
        return self.forward(state)
```
