FROM oven/bun:1.2.12 

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

EXPOSE 1337 

CMD ["bun", "run", "dev"]