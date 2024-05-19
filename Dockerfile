FROM node:slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
COPY ./frontend /app

WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod 

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

FROM python:3.10-slim
WORKDIR /data
WORKDIR /app
COPY  backend/requirements.txt /app/requirements.txt

RUN   pip config set global.index 'http://nexus.service.flag.org/repository/python/' && \
      pip config set global.index-url 'http://nexus.service.flag.org/repository/python/simple/'  && \
      pip config set global.trusted-host nexus.service.flag.org && \
      pip install --no-cache-dir --upgrade pip &&  pip install --no-cache-dir -r requirements.txt


COPY  backend/ /app/
COPY --from=build /app/dist/assets /app/static/assets
COPY --from=build /app/dist/index.html /app/templates/index.html

EXPOSE 8000
CMD [ "gunicorn","-b","0.0.0.0:8000", "wsgi:app" ]