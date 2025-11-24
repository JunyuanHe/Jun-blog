---
title: WSL无法使用代理？镜像模式来帮你！
createTime: 2025/11/24 15:20:14
permalink: /article/d7rdvig7/
---

这两天给新系统安装 WSL 2，安装完毕后，弹出来下面一则提示：


> wsl: 检测到 localhost 代理配置，但未镜像到 WSL。NAT 模式下的 WSL 不支持 localhost 代理


然后我就瞬间想起了那个长期以来让很多人头大的问题：

- WSL 2 通常无法使用Windows的代理，这就让 **git、github 的代理**重新配置变得异常繁琐；
- 而且从 WSL 2 中看到的IP地址总是内部的虚拟 IP，并非局域网其它设备能够访问的地址，这也给开发人员**在局域网中测试应用程序**造成了一些麻烦。

我们知道，WSL 2 的网络默认使用的是桥接模式（NAT），而上面的提示表明，现在 WSL 2 已经支持镜像模式。镜像模式下的 WSL 是支持 localhost 代理的。这意味着，只要开启镜像模式，WSL 2 和 Windows 将共享网络设置，并且能够自动代理。

### **如何开启镜像模式？**

修改 WSL 网络模式为“镜像”（Mirrored）模式可将 WSL 和 Windows 主机网络互通。

- 打开 Windows 的 WSL Settings（在搜索框中输入 WSL Settings）。
- 在设置中，找到并切换到 Network (网络) 选项。
将网络模式从 NAT 更改为 Mirrored。
- 重启 WSL 生效。（重启方法：在 Powershell 中，输入 `wsl --shutdown`，然后重新打开 WSL 即可。）

![WSL Settings](wsl-settings.png)


至此，上述问题已有了完美的解决方案。感谢 Microsoft 团队的努力。