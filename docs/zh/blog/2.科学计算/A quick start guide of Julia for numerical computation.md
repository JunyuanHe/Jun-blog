---
title: A quick start guide of Julia for numerical computation
createTime: 2026/05/13 10:17:14
permalink: /zh/blog/e77dcqn0/
---

Here is a practical Julia quick start guide, especially oriented toward scientific/numerical computing.

## 1. Install Julia

Recommended modern way:

```bash
# macOS / Linux
curl -fsSL https://install.julialang.org | sh
```

On Windows, install Julia from the Microsoft Store or use:

```powershell
winget install julia -s msstore
```

The official installer also installs `juliaup`, Julia’s version manager, and after installation you can start Julia by typing:

```bash
julia
```

Julia’s official docs recommend using the REPL — the interactive Julia shell — for quick experimentation. ([The Julia Programming Language][1])



## 2. First REPL commands

```julia
1 + 2
sqrt(2)
sin(pi / 2)
typeof(3.14)
```

Exit Julia:

```julia
exit()
```

or press `Ctrl-D`.

Julia is dynamically typed, but it compiles efficient machine code using type information inferred at runtime.



## 3. Variables and basic types

```julia
x = 3
y = 2.5
name = "Julia"

typeof(x)      # Int64
typeof(y)      # Float64
typeof(name)   # String
```

String interpolation:

```julia
x = 10
println("x = $x")
println("x^2 = $(x^2)")
```



## 4. Functions

Long form:

```julia
function square(x)
    return x^2
end
```

Short form:

```julia
square(x) = x^2
```

Anonymous function:

```julia
x -> x^2
```

Example:

```julia
map(x -> x^2, [1, 2, 3, 4])
```

Julia functions are generic functions; different argument types can dispatch to different methods, which is one of Julia’s central design ideas. ([docs.julialang.org][2])



## 5. Arrays and indexing

```julia
v = [1, 2, 3, 4]
A = [1 2; 3 4]
```

Important: **Julia uses 1-based indexing**, like MATLAB, not 0-based indexing like Python/C.

```julia
v[1]      # 1
A[1, 2]   # 2
A[:, 1]   # first column
A[2, :]   # second row
```

Array comprehensions:

```julia
squares = [i^2 for i in 1:10]
```

For numerical work, prefer arrays with concrete element types such as `Vector{Float64}` or `Matrix{Float64}`. The official docs note that arrays with specific element types are generally preferable for computational purposes. ([docs.julialang.org][3])



## 6. Loops and conditionals

```julia
for i in 1:5
    println(i)
end
```

```julia
x = 3

if x > 0
    println("positive")
elseif x < 0
    println("negative")
else
    println("zero")
end
```

While loop:

```julia
i = 1
while i <= 5
    println(i)
    i += 1
end
```



## 7. Packages

Julia has a built-in package manager called `Pkg`, used for installing, updating, and removing packages. ([docs.julialang.org][4])

Inside Julia:

```julia
using Pkg
Pkg.add("Plots")
Pkg.add("DataFrames")
```

Or press `]` in the REPL to enter package mode:

```julia
pkg> add Plots
pkg> status
```

Press Backspace or `Ctrl-C` to return to normal Julia mode.

For a project, use environments:

```julia
using Pkg
Pkg.activate(".")
Pkg.add("Plots")
```

This creates a `Project.toml` and usually a `Manifest.toml`, similar in spirit to Python’s virtual environments.



## 8. Plotting

Install:

```julia
using Pkg
Pkg.add("Plots")
```

Use:

```julia
using Plots

x = range(0, 2pi, length=200)
y = sin.(x)

plot(x, y, label="sin(x)")
```

Notice the dot:

```julia
sin.(x)
```

This means “apply `sin` elementwise.” This is very important in Julia.

Compare:

```julia
sin(1.0)      # scalar
sin.([1,2,3]) # vectorized / broadcasted
```



## 9. Linear algebra

```julia
using LinearAlgebra

A = [1.0 2.0; 3.0 4.0]
b = [1.0, 2.0]

x = A \ b       # solve Ax = b
det(A)
eigvals(A)
norm(b)
```

Matrix multiplication:

```julia
A * A
```

Elementwise multiplication:

```julia
A .* A
```

This distinction is important.



## 10. A small numerical example

Solve the ODE:

[
u'(t) = -u(t), \quad u(0)=1
]

using explicit Euler:

```julia
function euler(f, u0, tspan, h)
    t0, T = tspan
    ts = collect(t0:h:T)
    us = similar(ts)
    us[1] = u0

    for n in 1:length(ts)-1
        us[n+1] = us[n] + h * f(ts[n], us[n])
    end

    return ts, us
end

f(t, u) = -u

ts, us = euler(f, 1.0, (0.0, 5.0), 0.01)

using Plots
plot(ts, us, label="Euler")
plot!(ts, exp.(-ts), label="exact", linestyle=:dash)
```

This shows a very Julia-like workflow: write a normal function, use arrays, broadcast with dots, and plot.



## 11. Structs and multiple dispatch

Define a type:

```julia
struct Point
    x::Float64
    y::Float64
end
```

Use it:

```julia
p = Point(1.0, 2.0)
p.x
p.y
```

Define behavior by type:

```julia
distance(p::Point) = sqrt(p.x^2 + p.y^2)

distance(Point(3.0, 4.0))  # 5.0
```

Multiple dispatch means Julia chooses which method to call based on the types of **all** arguments, not just the first one. This is one of the reasons Julia is elegant for mathematical software.



## 12. Performance basics

The most important rules:

```julia
# Good: put performance-critical code inside functions
function compute_sum(n)
    s = 0.0
    for i in 1:n
        s += 1 / i
    end
    return s
end
```

Avoid changing variable types inside tight loops:

```julia
# Less good
x = 1
x = 1.5
```

Use broadcasting instead of unnecessary temporary loops:

```julia
y = sin.(x) .+ cos.(x)
```

Inspect performance:

```julia
@time compute_sum(10^6)
```

For more serious benchmarking:

```julia
using Pkg
Pkg.add("BenchmarkTools")

using BenchmarkTools
@btime compute_sum(10^6)
```


## 13. File structure

A simple Julia project:

```text
my_project/
  Project.toml
  Manifest.toml
  src/
    MyProject.jl
  scripts/
    run_experiment.jl
```

Example script:

```julia
# scripts/run_experiment.jl

using LinearAlgebra

A = rand(5, 5)
b = rand(5)

x = A \ b
println(norm(A*x - b))
```

Run from terminal:

```bash
julia scripts/run_experiment.jl
```


## 14. Things that may surprise Python users

```julia
# 1-based indexing
v[1]

# ranges are common
1:10

# ! convention means function mutates its argument
sort(v)   # returns sorted copy
sort!(v)  # sorts v in place

# dot means elementwise/broadcast
x .+ y
sin.(x)
A .* B

# matrix multiply is *
A * B

# solve linear system
A \ b
```


## 15. Recommended learning path

1. Basic syntax: variables, functions, arrays, loops.
2. Broadcasting and linear algebra.
3. Package environments with `Pkg`.
4. Plotting and data IO.
5. Multiple dispatch and custom structs.
6. Performance: type stability, allocation, benchmarking.
7. Scientific packages: `DifferentialEquations.jl`, `Optim.jl`, `JuMP.jl`, `Tullio.jl`, `CUDA.jl` depending on your direction.

A nice first goal: rewrite a small numerical experiment you already know — for example, an RK method, finite difference solver, or optimization routine — in Julia. That will improve your understanding much faster than only reading syntax.

[1]: https://julialang.org/install/?utm_source=chatgpt.com "Installing Julia"
[2]: https://docs.julialang.org/en/v1/manual/functions/?utm_source=chatgpt.com "Functions - Julia Documentation"
[3]: https://docs.julialang.org/en/v1/manual/arrays/?utm_source=chatgpt.com "Single- and multi-dimensional Arrays - Julia Documentation"
[4]: https://docs.julialang.org/en/v1/stdlib/Pkg/?utm_source=chatgpt.com "Pkg - Julia Documentation - The Julia Programming Language"
