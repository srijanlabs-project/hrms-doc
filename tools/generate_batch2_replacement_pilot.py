from pathlib import Path

from generate_final_ui_boards import SCREENS
from rebuild_final_ui_boards import mobile_board, statutory_hro_board


ROOT = Path(r"D:\HRMS-doc")
OUT = ROOT / "docs/10-ui-ux-architecture/screen-ui-designs/batch-04-payroll-and-workforce-v2"
SLUG = "pay-scr-004-statutory-workbench"


def main():
    screen = next(item for item in SCREENS if item[2] == SLUG)
    OUT.mkdir(parents=True, exist_ok=True)
    statutory_hro_board(screen).save(OUT / f"{SLUG}-desktop-final.png", "PNG", optimize=True)
    mobile_board(screen).save(OUT / f"{SLUG}-mobile-final.png", "PNG", optimize=True)
    print(f"Created replacement pilot in {OUT}")


if __name__ == "__main__":
    main()
