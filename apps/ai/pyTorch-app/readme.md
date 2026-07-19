# PyTorch Demo

这是一个最小可运行的 PyTorch 训练示例项目。

## 1. 创建虚拟环境

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## 2. 安装依赖

```bash
pip install -U pip
pip install -r requirements.txt
```

## 3. 运行训练

```bash
python train_demo.py
```

运行后会输出每个 epoch 的 loss 和 accuracy，并在当前目录生成 `model.pt`。

## 4. 加载模型并预测

先确认已完成训练并生成 `model.pt`，然后执行：

```bash
python predict_demo.py --x1 0.5 --x2 -1.2
```

也可以使用交互模式反复输入：

```bash
python predict_demo.py --interactive
```

输入格式为：`x1 x2`，例如 `0.3 -1.1`。

## 文件说明

- `train_demo.py`：使用随机生成的二维分类数据训练一个简单 MLP
- `predict_demo.py`：加载 `model.pt` 并执行推理预测
- `requirements.txt`：项目依赖
- `model.pt`：训练后生成的模型参数文件
