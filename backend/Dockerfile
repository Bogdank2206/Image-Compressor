FROM node:22.11-bookworm-slim AS builder

RUN corepack enable

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY ./src/ ./src/
COPY ./public/ ./public/
COPY ./tsconfig.json ./

RUN yarn build

FROM node:22.11-bookworm-slim AS magick-builder

WORKDIR /imagemagick

RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y autoconf
RUN apt-get install -y libtool
RUN apt-get install -y pkg-config
RUN apt-get install -y git
RUN apt-get install -y libjpeg-dev
RUN apt-get install -y libpng-dev
RUN apt-get install -y libtiff-dev
RUN apt-get install -y libwebp-dev
RUN apt-get install -y libraw-dev
RUN apt-get install -y dcraw
RUN apt-get install -y libltdl-dev

RUN git clone --depth 1 --branch 7.1.2-3 https://github.com/ImageMagick/ImageMagick.git .

RUN ./configure --prefix=/tmp/magick --with-modules --with-jpeg --with-png \
                --with-tiff --with-gif --with-webp --with-raw --enable-static

RUN make -j$(nproc) install

FROM node:22.11-bookworm-slim AS production

COPY --from=magick-builder /tmp/magick /tmp/magick/
ENV PATH="/tmp/magick/bin:$PATH"

RUN apt-get update 
RUN apt-get install -y libjpeg-dev
RUN apt-get install -y libpng-dev
RUN apt-get install -y libtiff-dev
RUN apt-get install -y libwebp-dev
RUN apt-get install -y libraw-dev
RUN apt-get install -y libltdl7
RUN apt-get install -y libltdl-dev
RUN apt-get install -y dcraw

WORKDIR /app

COPY --from=builder /app/yarn.lock ./yarn.lock
COPY package.json .
RUN corepack enable
RUN yarn workspaces focus --all --production

COPY --from=builder /app/build/ ./build/
COPY --from=builder /app/src/templates/ ./build/templates/
COPY --from=builder /app/public/ ./public/

CMD ["yarn", "start"]