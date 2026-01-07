FROM python:3.11-slim

RUN pip install uv

WORKDIR /app

COPY pyproject.toml uv.lock* ./
COPY . .
COPY ./files/* ./files/

RUN uv sync --no-dev --frozen

EXPOSE 8000

CMD ["uv","run", "main.py"]
