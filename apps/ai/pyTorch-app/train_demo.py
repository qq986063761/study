"""
PyTorch 最小训练示例。

这个脚本演示了一个完整训练流程：
1) 生成二维玩具分类数据；
2) 构建并训练一个简单的 MLP；
3) 输出每轮 loss/accuracy；
4) 将训练后的参数保存到 model.pt。

注意：这里保存的是 state_dict（模型参数），不是可直接运行的完整推理程序。
"""

import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset


def make_toy_data(n_samples: int = 1000):
    # 构造二维随机点；标签规则为 x1*x2>0 记为 1，否则为 0。
    x = torch.randn(n_samples, 2)
    y = (x[:, 0] * x[:, 1] > 0).long()
    return x, y


def train():
    # 固定随机种子，保证每次运行结果更可复现。
    torch.manual_seed(42)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    # 1) 准备数据与 DataLoader。
    x, y = make_toy_data()
    dataset = TensorDataset(x, y)
    loader = DataLoader(dataset, batch_size=64, shuffle=True)

    # 2) 定义模型：2 -> 16 -> 16 -> 2 的三层全连接网络。
    model = nn.Sequential(
        nn.Linear(2, 16),
        nn.ReLU(),
        nn.Linear(16, 16),
        nn.ReLU(),
        nn.Linear(16, 2),
    ).to(device)

    # 3) 定义损失函数与优化器。
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-2)

    epochs = 20
    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        correct = 0
        total = 0

        for batch_x, batch_y in loader:
            batch_x = batch_x.to(device)
            batch_y = batch_y.to(device)

            # 标准训练步骤：清梯度 -> 前向 -> 算损失 -> 反向 -> 更新参数。
            optimizer.zero_grad()
            logits = model(batch_x)
            loss = criterion(logits, batch_y)
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * batch_x.size(0)
            pred = logits.argmax(dim=1)
            correct += (pred == batch_y).sum().item()
            total += batch_x.size(0)

        avg_loss = total_loss / total
        acc = correct / total
        print(f"Epoch {epoch:02d} | loss={avg_loss:.4f} | acc={acc:.4f}")

    # 4) 只保存模型参数（state_dict），用于后续加载推理或继续训练。
    torch.save(model.state_dict(), "model.pt")
    print("Training done. Saved model to model.pt")


if __name__ == "__main__":
    train()
