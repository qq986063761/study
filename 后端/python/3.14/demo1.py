"""
Demo 1：Python 基础能力（必须先做）
目标：熟悉 NumPy/Pandas/Requests，建立“数据 -> 清洗 -> 调用 API -> 落盘”能力。
你要写的内容：

用 requests 拉一个公开 API（比如天气、新闻、GitHub）
用 pandas 清洗字段、去重、统计（groupby）
用 numpy 做简单数值处理（归一化、均值方差）
输出 csv + 一份简短分析报告（markdown）
这个 demo 做完，你会得到：

Python 数据处理手感
后续做 RAG 的“文档清洗能力”

Demo 1: Python basic AI data pipeline
Flow: requests -> pandas cleaning -> numpy stats -> csv + markdown report

Run:
    pip install requests pandas numpy
    python demo1.py
"""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
import requests


# =========================
# 配置区：API 地址和输出文件路径
# =========================
API_URL = "https://api.github.com/search/repositories"
OUTPUT_DIR = Path(__file__).resolve().parent / "output"
CSV_PATH = OUTPUT_DIR / "github_python_repos.csv"
REPORT_PATH = OUTPUT_DIR / "analysis_report.md"


def fetch_data() -> list[dict]:
    """Fetch top-starred Python repositories from GitHub."""
    # 查询参数：限定 Python 仓库，按 star 数倒序取前 50 条
    params = {
        "q": "language:python stars:>10000",
        "sort": "stars",
        "order": "desc",
        "per_page": 50,
    }
    # 请求头：声明 API 版本与调用方标识，避免被当作匿名异常请求
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "study-demo1-requests-pandas-numpy",
    }
    # 发起 HTTP 请求并抛出状态码异常（如 403/404/500）
    resp = requests.get(API_URL, params=params, headers=headers, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    # 仅返回仓库列表字段，作为后续清洗输入
    return data.get("items", [])


def clean_and_transform(items: list[dict]) -> pd.DataFrame:
    """Clean fields, deduplicate, parse date, and do numeric transforms."""
    # 结构化提取：把嵌套 JSON 转成扁平行记录
    rows = []
    for repo in items:
        rows.append(
            {
                "repo_name": repo.get("full_name"),
                "language": repo.get("language"),
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "open_issues": repo.get("open_issues_count", 0),
                "created_at": repo.get("created_at"),
                "updated_at": repo.get("updated_at"),
                "license": (repo.get("license") or {}).get("spdx_id"),
                "owner_type": (repo.get("owner") or {}).get("type"),
                "repo_url": repo.get("html_url"),
            }
        )

    df = pd.DataFrame(rows)

    # pandas 清洗：按仓库名去重，统一时间字段，并计算仓库存在天数
    df = df.drop_duplicates(subset=["repo_name"]).copy()
    df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
    df["updated_at"] = pd.to_datetime(df["updated_at"], errors="coerce")
    df["days_since_created"] = (
        pd.Timestamp.now(tz=timezone.utc) - df["created_at"]
    ).dt.days

    # numpy 数值处理：对 stars 做 min-max 归一化，便于后续建模或比较
    stars_np = df["stars"].to_numpy(dtype=np.float64)
    min_s, max_s = stars_np.min(), stars_np.max()
    if max_s == min_s:
        stars_norm = np.zeros_like(stars_np)
    else:
        stars_norm = (stars_np - min_s) / (max_s - min_s)
    df["stars_norm"] = stars_norm.round(6)

    # 按 stars 降序，重排索引，输出干净数据表
    return df.sort_values("stars", ascending=False).reset_index(drop=True)


def build_report(df: pd.DataFrame) -> str:
    """Generate a short markdown analysis report."""
    # 分组统计：仓库所有者类型、许可证分布
    owner_stats = (
        df.groupby("owner_type", dropna=False)["repo_name"]
        .count()
        .sort_values(ascending=False)
    )
    license_stats = (
        df.groupby("license", dropna=False)["repo_name"].count().sort_values(ascending=False)
    )

    # 数值统计：均值、标准差、分位数
    stars = df["stars"].to_numpy(dtype=np.float64)
    stars_mean = float(np.mean(stars))
    stars_std = float(np.std(stars))
    stars_p50 = float(np.percentile(stars, 50))
    stars_p90 = float(np.percentile(stars, 90))

    # 展示样本：选取 stars 最高的前 5 个仓库
    top5 = df[["repo_name", "stars", "forks", "repo_url"]].head(5)

    # 按 markdown 文本逐行构建分析报告
    lines = [
        "# GitHub Python Repo 数据分析报告",
        "",
        f"- 生成时间（UTC）: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}",
        f"- 样本量: {len(df)}",
        "",
        "## 数值统计（stars）",
        f"- 均值: {stars_mean:.2f}",
        f"- 标准差: {stars_std:.2f}",
        f"- P50: {stars_p50:.2f}",
        f"- P90: {stars_p90:.2f}",
        "",
        "## 分组统计（owner_type）",
    ]
    for k, v in owner_stats.items():
        lines.append(f"- {k}: {v}")

    lines.append("")
    lines.append("## 分组统计（license）")
    for k, v in license_stats.head(8).items():
        lines.append(f"- {k}: {v}")

    lines += [
        "",
        "## Top 5 仓库",
        "",
        "| repo_name | stars | forks | url |",
        "|---|---:|---:|---|",
    ]
    for _, row in top5.iterrows():
        lines.append(
            f"| {row['repo_name']} | {int(row['stars'])} | {int(row['forks'])} | {row['repo_url']} |"
        )

    lines += [
        "",
        "## 结论（简短）",
        "- 这个 Demo 跑通了从 API 获取数据到分析落盘的全流程。",
        "- 你已经具备做 RAG 前置数据清洗和统计分析的基础能力。",
    ]

    # 返回完整 markdown 字符串，供写入 .md 文件
    return "\n".join(lines) + "\n"


def main() -> None:
    # 主流程：
    # 1) 创建输出目录
    # 2) 拉取数据
    # 3) 清洗与转换
    # 4) 输出 CSV 和 markdown 报告
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    items = fetch_data()
    df = clean_and_transform(items)
    df.to_csv(CSV_PATH, index=False, encoding="utf-8-sig")
    report = build_report(df)
    REPORT_PATH.write_text(report, encoding="utf-8")

    print(f"CSV 已生成: {CSV_PATH}")
    print(f"报告已生成: {REPORT_PATH}")
    print("完成: requests -> pandas -> numpy -> csv + markdown")


if __name__ == "__main__":
    main()
