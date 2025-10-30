FROM almalinux:9
RUN dnf -y install \
      https://download.oracle.com/otn_software/linux/instantclient/211000/oracle-instantclient-basic-21.1.0.0.0-1.x86_64.rpm \
      openssh-clients \
      sudo \
      tar \
      gzip \
      git \
      python3.11-devel \
      python3.11 \
      python3.11-pip \
      gcc \
      nodejs && \
    rm -rf /var/cache/yum && \
    npm install -g n && \
    n install stable

RUN npm install -g pyright

RUN groupadd --gid 1000 developer \
    && useradd --uid 1000 --gid 1000 -m developer \
    && echo "developer:tmp" | chpasswd \
    && echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER developer