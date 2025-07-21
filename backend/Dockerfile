FROM manimcommunity/manim

USER root

RUN apt-get update && apt-get install -y \
    espeak-ng \
    libespeak-ng-dev \
    sox \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install manim-voiceover
RUN pip install edge-tts

COPY edge_tts_class.py edge_tts_class.py

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY server.mjs server.mjs
COPY middleware.mjs middleware.mjs 
COPY database.mjs database.mjs
COPY intro.py intro.py
COPY logo.mp3 logo.mp3
COPY ./fonts /usr/share/fonts/truetype/custom

RUN npm install

EXPOSE 4000

CMD [ "node" , "server.mjs" ]