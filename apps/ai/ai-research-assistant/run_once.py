import argparse

from tasks import run_research_flow


def main():
    parser = argparse.ArgumentParser(description="Run one research flow without API/Celery.")
    parser.add_argument("--task", default="分析苹果公司最近财报并给投资建议")
    parser.add_argument("--company", default="Apple")
    args = parser.parse_args()

    result = run_research_flow(args.task, args.company)
    print("Report URL:", result["report_url"])
    print("Report file:", result["report_file"])


if __name__ == "__main__":
    main()

