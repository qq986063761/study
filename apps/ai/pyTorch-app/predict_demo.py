"""
加载 model.pt 并进行二维输入的分类预测。

用法示例：
1) 单次预测（命令行传参）
   python predict_demo.py --x1 0.5 --x2 -1.2

2) 交互式输入
   python predict_demo.py --interactive
"""

import argparse

import torch
from torch import nn


def build_model():
    """与训练脚本保持一致的网络结构。"""
    return nn.Sequential(
        nn.Linear(2, 16),
        nn.ReLU(),
        nn.Linear(16, 16),
        nn.ReLU(),
        nn.Linear(16, 2),
    )


def load_model(model_path: str = "model.pt", device: str = "cpu"):
    model = build_model().to(device)
    state_dict = torch.load(model_path, map_location=device)
    model.load_state_dict(state_dict)
    model.eval()
    return model


def predict(model, x1: float, x2: float, device: str = "cpu"):
    x = torch.tensor([[x1, x2]], dtype=torch.float32, device=device)
    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1)
        pred = int(torch.argmax(probs, dim=1).item())
    return pred, probs.squeeze(0).cpu().tolist()


def parse_args():
    parser = argparse.ArgumentParser(description="Load model.pt and run inference.")
    parser.add_argument("--x1", type=float, help="First input feature.")
    parser.add_argument("--x2", type=float, help="Second input feature.")
    parser.add_argument(
        "--model-path", default="model.pt", help="Path to model state_dict file."
    )
    parser.add_argument(
        "--interactive",
        action="store_true",
        help="Run in interactive mode and input x1 x2 repeatedly.",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = load_model(args.model_path, device=device)
    print(f"Using device: {device}")
    print(f"Loaded model from: {args.model_path}")

    if args.interactive:
        print("Interactive mode. Input format: x1 x2  (type q to quit)")
        while True:
            text = input("> ").strip()
            if text.lower() in {"q", "quit", "exit"}:
                break
            parts = text.split()
            if len(parts) != 2:
                print("Please input two numbers, e.g. 0.3 -1.2")
                continue
            try:
                x1, x2 = float(parts[0]), float(parts[1])
            except ValueError:
                print("Invalid number format.")
                continue
            pred, probs = predict(model, x1, x2, device=device)
            print(
                f"input=({x1:.4f}, {x2:.4f}) | pred={pred} | probs=[{probs[0]:.4f}, {probs[1]:.4f}]"
            )
        return

    if args.x1 is None or args.x2 is None:
        raise ValueError("Please provide --x1 and --x2, or use --interactive.")

    pred, probs = predict(model, args.x1, args.x2, device=device)
    print(
        f"input=({args.x1:.4f}, {args.x2:.4f}) | pred={pred} | probs=[{probs[0]:.4f}, {probs[1]:.4f}]"
    )


if __name__ == "__main__":
    main()
