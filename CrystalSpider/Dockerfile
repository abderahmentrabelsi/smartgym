FROM python:3.11-slim AS setup

ENV PYTHONUNBUFFERED 1

RUN groupadd -r app && useradd --no-log-init -d /app -r -g app app

RUN apt-get update
RUN apt-get install --no-install-recommends -y gcc g++ cmake make ca-certificates lsb-release wget

RUN pip install --no-cache-dir --upgrade pip wheel setuptools


FROM setup AS requirements

COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt


FROM requirements AS app

WORKDIR /app
RUN mkdir -p /app/data && chown -R app:app /app
COPY ./src ./src
COPY gunicorn_conf.py .

EXPOSE 8000

USER app:app

ENTRYPOINT ["gunicorn", "--conf", "gunicorn_conf.py", "--chdir", "src", "--worker-class=uvicorn.workers.UvicornWorker", "app:app"]
