FROM python:3.9-slim AS setup

ENV PYTHONUNBUFFERED 1

RUN groupadd -r app && useradd --no-log-init -d /app -r -g app app

RUN apt-get update
RUN apt-get install --no-install-recommends -y python3-scipy gcc g++ cmake make ca-certificates patchelf cython3 libopenblas-dev lsb-release wget libopenblas64-dev gfortran pkg-config

RUN pip install --no-cache-dir --upgrade pip wheel setuptools


FROM setup AS requirements

COPY ./requirements.txt .
RUN pip install -r requirements.txt


FROM requirements AS app

WORKDIR /app
COPY . .
COPY gunicorn_conf.py .

EXPOSE 8000

USER app:app

ENTRYPOINT ["gunicorn", "--conf", "gunicorn_conf.py", "--worker-class=uvicorn.workers.UvicornWorker", "mlapi:app"]
