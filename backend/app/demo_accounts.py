
from sqlalchemy.orm import Session

from app.models import User
from app.security import hash_password


DEMO_ACCOUNTS = [
    {
        "full_name": "KasiSkill Demo Worker",
        "email": "worker.demo@kasiskill.test",
        "password": "WorkerDemo2026!",
        "account_type": "worker",
    },
    {
        "full_name": "KasiSkill Demo Customer",
        "email": "customer.demo@kasiskill.test",
        "password": "CustomerDemo2026!",
        "account_type": "customer",
    },
    {
        "full_name": "KasiSkill Demo Contractor",
        "email": "contractor.demo@kasiskill.test",
        "password": "ContractorDemo2026!",
        "account_type": "contractor",
    },
    {
        "full_name": "KasiSkill Demo Assessor",
        "email": "assessor.demo@kasiskill.test",
        "password": "AssessorDemo2026!",
        "account_type": "assessor",
    },
]


def create_demo_accounts(db: Session):
    for account in DEMO_ACCOUNTS:
        existing_user = db.query(User).filter(
            User.email == account["email"]
        ).first()

        if existing_user:
            continue

        demo_user = User(
            full_name=account["full_name"],
            email=account["email"],
            hashed_password=hash_password(account["password"]),
            account_type=account["account_type"],
            is_active=True,
        )

        db.add(demo_user)

    db.commit()
