FROM node:22.11-bookworm AS builder

RUN corepack enable

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY ./src/ ./src/
COPY ./public/ ./public/
COPY ./tsconfig.json ./

RUN yarn build

FROM node:22.11-bookworm AS production

WORKDIR /imagemagick

RUN apt-get update && apt-get install -y \
    build-essential autoconf libtool pkg-config libjpeg-dev libpng-dev \
    libtiff-dev libgif-dev libwebp-dev libraw-dev dcraw && rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 --branch 7.1.2-3 https://github.com/ImageMagick/ImageMagick.git .
RUN ./configure --prefix=/usr/local --sysconfdir=/etc --enable-shared --with-modules --with-jpeg --with-png --with-tiff \
                --with-gif --with-webp --with-raw --enable-delegate-build --with-dcraw
RUN make -j$(nproc)
RUN make install
RUN ldconfig /usr/local/lib

WORKDIR /app

COPY --from=builder /app/yarn.lock ./yarn.lock
COPY package.json .

RUN corepack enable
RUN yarn workspaces focus --all --production

COPY --from=builder /app/build/ ./build/
COPY --from=builder /app/src/templates/ ./build/templates/
COPY --from=builder /app/public/ ./public/

CMD ["yarn", "start"]