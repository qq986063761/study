# LangChain Demo

最小 [LangChain](https://python.langchain.com/) **LCEL**（`Prompt | ChatModel | OutputParser`）示例，与仓库内 `reAct-app`、`plan-and-execute-app` 一样：**默认零配置可跑**，可选接 OpenAI。

## 环境

```bash
cd lang-chain-app
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 运行

**离线（默认，不访问网络，使用 `FakeListChatModel`）：**

```bash
python demo.py
python demo.py --question "任意问题（离线时答复仍为预设文案）"
```

**在线（需密钥）：**

```bash
export OPENAI_API_KEY=你的密钥
python demo.py --live --question "用一句话介绍 LangChain LCEL"
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `demo.py` | `ChatPromptTemplate`、链路与离线/在线分支 |
| `requirements.txt` | `langchain-core`、`langchain-openai` |
