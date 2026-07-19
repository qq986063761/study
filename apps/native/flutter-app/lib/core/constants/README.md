# Core Constants

此目录用于存放跨功能共享且稳定的常量，例如网络超时、分页默认值或全局配置键。

仅被单个 Feature 使用的常量应放在对应的 `features/<feature>/` 目录中，避免把业务细节提升为全局依赖。
